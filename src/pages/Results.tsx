import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, SlidersHorizontal, Map as MapIcon, List as ListIcon, Navigation, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";

interface AIMatch {
  id: string;
  matchScore: number;
  matchReason: string;
}

type SortOption = "relevance" | "rating" | "price-low" | "price-high" | "distance";
type ViewMode = "list" | "map";

interface LatLng {
  lat: number;
  lng: number;
}

const toRad = (v: number) => (v * Math.PI) / 180;
const haversineKm = (a: LatLng, b: LatLng) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(s1 + s2));
};

const formatDistance = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m away` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`);

const MapResizeHandler = () => {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);

  return null;
};

const Results = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);
  const [mapRenderKey, setMapRenderKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const setCoords = (lat: number | null, lng: number | null) => {
      if (cancelled || lat == null || lng == null) return;
      setUserCoords({ lat, lng });
    };

    const fetchProfileCoords = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from("profiles")
        .select("latitude, longitude")
        .eq("user_id", userId)
        .maybeSingle();
      setCoords(data?.latitude ?? null, data?.longitude ?? null);
    };

    const persistCoords = async (lat: number, lng: number) => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return;

      await supabase
        .from("profiles")
        .update({
          latitude: lat,
          longitude: lng,
          live_location_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords(pos.coords.latitude, pos.coords.longitude);
          void persistCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => { void fetchProfileCoords(); },
        { enableHighAccuracy: false, timeout: 7000, maximumAge: 60_000 },
      );
    } else {
      void fetchProfileCoords();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (viewMode === "map") setMapRenderKey((prev) => prev + 1);
  }, [viewMode, userCoords]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, userCoords?.lat, userCoords?.lng],
    queryFn: async () => {
      const { data: listings, error: dbError } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, business_name, avatar_url, location, latitude, longitude, live_location_enabled)")
        .eq("is_active", true);

      if (dbError) throw dbError;
      if (!listings || listings.length === 0) return { listings: [], matches: [] };

      const { data: matchData, error: fnError } = await supabase.functions.invoke("match-listings", {
        body: {
          query,
          listings: listings.map((l) => ({
            id: l.id, title: l.title, description: l.description, type: l.listing_type,
            skills: l.skills, services: l.services, location: l.location,
            hourly_rate: l.hourly_rate, fixed_price: l.fixed_price, experience: l.experience,
            rating: l.rating, review_count: l.review_count, availability: l.availability,
            business_name: (l as any).profiles?.business_name || "",
            provider_name: (l as any).profiles?.full_name || "",
          })),
        },
      });

      if (fnError) throw fnError;

      const aiMatches: AIMatch[] = matchData?.matches || [];
      const matchMap = new Map(aiMatches.map((m: AIMatch) => [m.id, m]));
      const sorted = [...listings]
        .filter((l) => matchMap.has(l.id))
        .sort((a, b) => (matchMap.get(b.id)?.matchScore || 0) - (matchMap.get(a.id)?.matchScore || 0));

      const withDistance = sorted.map((listing: any) => {
        const lat = listing.latitude ?? listing.profiles?.latitude;
        const lng = listing.longitude ?? listing.profiles?.longitude;
        const distanceKm = userCoords && lat != null && lng != null
          ? haversineKm(userCoords, { lat, lng })
          : null;
        return { ...listing, distanceKm };
      });

      return { listings: withDistance, matchMap };
    },
    enabled: !!query,
  });

  let listings = data?.listings || [];
  const matchMap = data?.matchMap as Map<string, AIMatch> | undefined;

  if (sortBy === "rating") {
    listings = [...listings].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else if (sortBy === "price-low") {
    listings = [...listings].sort((a, b) => (Number(a.hourly_rate || a.fixed_price) || 0) - (Number(b.hourly_rate || b.fixed_price) || 0));
  } else if (sortBy === "price-high") {
    listings = [...listings].sort((a, b) => (Number(b.hourly_rate || b.fixed_price) || 0) - (Number(a.hourly_rate || a.fixed_price) || 0));
  } else if (sortBy === "distance") {
    listings = [...listings].sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
  }

  const mappableListings = useMemo(
    () => listings.filter((l: any) => (l.latitude ?? l.profiles?.latitude) != null && (l.longitude ?? l.profiles?.longitude) != null),
    [listings],
  );

  const mapCenter: [number, number] = useMemo(() => {
    if (userCoords) return [userCoords.lat, userCoords.lng];
    const first = mappableListings[0];
    if (first) return [first.latitude ?? first.profiles?.latitude, first.longitude ?? first.profiles?.longitude];
    return [-1.286389, 36.817223];
  }, [mappableListings, userCoords]);

  const topMatch = listings[0];
  const otherMatches = sortBy === "relevance" ? listings.slice(1) : listings;
  const showTopSeparately = sortBy === "relevance" && listings.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Subtle warm gradient strip behind header */}
      <div className="absolute top-0 left-0 right-0 h-[180px] sm:h-[200px] pointer-events-none bg-[linear-gradient(180deg,hsl(28_35%_98.5%)_0%,hsl(26_30%_98%)_50%,transparent_100%)]" aria-hidden />
      <div className="relative pt-20 sm:pt-24 pb-10 sm:pb-20 px-4 sm:px-6 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
        <div className="container mx-auto max-w-3xl lg:max-w-4xl">
          <Link to={user ? "/dashboard" : "/"} className="inline-block mb-2 sm:mb-3">
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-primary/[0.06] h-9 min-h-[40px] touch-manipulation px-3 -ml-1">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="mb-4 sm:mb-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-1.5 text-[11px] sm:text-xs text-primary mb-2 font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> AI-powered results
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground break-words tracking-tight leading-tight">
              Results for &ldquo;{query}&rdquo;
            </h1>
            {!isLoading && listings.length > 0 && (
              <p className="text-sm sm:text-base text-muted-foreground mt-1.5">{listings.length} match{listings.length !== 1 ? "es" : ""} found</p>
            )}
          </motion.div>

          {/* Controls */}
          {!isLoading && listings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 space-y-2"
            >
              <div className="flex items-stretch gap-1 p-1 rounded-xl border border-border/60 bg-card w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors min-h-[44px] sm:min-h-[34px] touch-manipulation ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <ListIcon className="w-3.5 h-3.5" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors min-h-[44px] sm:min-h-[34px] touch-manipulation ${
                    viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" /> Map
                </button>
              </div>

              {viewMode === "list" && listings.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  {([
                    ["relevance", "Best Match"],
                    ["rating", "Top Rated"],
                    ["price-low", "Price: Low"],
                    ["price-high", "Price: High"],
                    ["distance", "Closest"],
                  ] as [SortOption, string][])
                    .filter(([key]) => key !== "distance" || !!userCoords)
                    .map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSortBy(key)}
                        className={`px-3 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors shrink-0 min-h-[40px] sm:min-h-[34px] touch-manipulation ${
                          sortBy === key
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 sm:py-24"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/[0.08] flex items-center justify-center mb-5">
                <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-spin" aria-hidden />
              </div>
              <p className="text-foreground/90 font-semibold text-[15px] sm:text-base">Finding the best matches...</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">This usually takes a few seconds</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-destructive/[0.06] border border-destructive/20 p-6 sm:p-10 text-center"
            >
              <p className="text-destructive font-semibold text-[15px] sm:text-base">Something went wrong while searching</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again or go back and search with different words.</p>
            </motion.div>
          )}

          {!isLoading && !error && listings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
              className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-sm border border-primary/[0.1] p-8 sm:p-12 md:p-14 text-center shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/[0.08] flex items-center justify-center mx-auto mb-5 sm:mb-6"
              >
                <Search className="w-8 h-8 sm:w-9 sm:h-9 text-primary/70" aria-hidden />
              </motion.div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
                No matches yet for this search
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-1">
                We didn&apos;t find any listings for &ldquo;{query}&rdquo; right now.
              </p>
              <p className="text-muted-foreground/90 text-xs sm:text-sm max-w-md mx-auto mb-8 sm:mb-10">
                {user
                  ? "You can add a listing from your profile, or try a different search."
                  : "Sign up and create your profile to offer this — or try another search."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                {user ? (
                  <Link to="/profile/edit" className="inline-flex sm:shrink-0">
                    <Button variant="hero" size="lg" className="rounded-xl h-12 min-h-[48px] px-6 text-sm font-semibold touch-manipulation w-full sm:w-auto shadow-[0_2px_12px_-2px_hsl(12_76%_56%_/_0.25)]">
                      Who I am & what I offer
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="inline-flex sm:shrink-0">
                    <Button variant="hero" size="lg" className="rounded-xl h-12 min-h-[48px] px-6 text-sm font-semibold touch-manipulation w-full sm:w-auto shadow-[0_2px_12px_-2px_hsl(12_76%_56%_/_0.25)]">
                      Sign up & create your profile
                    </Button>
                  </Link>
                )}
                <Link to={user ? "/dashboard" : "/"} className="inline-flex sm:shrink-0">
                  <Button variant="outline" size="lg" className="rounded-xl h-12 min-h-[48px] px-6 text-sm touch-manipulation w-full sm:w-auto border-primary/[0.2] hover:bg-primary/[0.06]">
                    Try a different search
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {viewMode === "map" && !isLoading && !error && listings.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-xl sm:rounded-2xl border border-border/60 bg-card p-1.5 sm:p-3 shadow-soft overflow-hidden">
              {mappableListings.length > 0 ? (
                <MapContainer
                  key={`results-map-${mapRenderKey}`}
                  center={mapCenter}
                  zoom={12}
                  scrollWheelZoom={true}
                  className="h-[280px] sm:h-[420px] md:h-[520px] w-full rounded-lg sm:rounded-xl"
                >
                  <MapResizeHandler />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {userCoords && (
                    <CircleMarker center={[userCoords.lat, userCoords.lng]} radius={8} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}>
                      <Popup>You are here</Popup>
                    </CircleMarker>
                  )}

                  {mappableListings.map((listing: any) => {
                    const lat = listing.latitude ?? listing.profiles?.latitude;
                    const lng = listing.longitude ?? listing.profiles?.longitude;
                    const label = listing.profiles?.business_name || listing.profiles?.full_name || "Provider";
                    return (
                      <CircleMarker
                        key={listing.id}
                        center={[lat, lng]}
                        radius={7}
                        pathOptions={{ color: "#ea580c", fillColor: "#f97316", fillOpacity: 0.9 }}
                      >
                        <Popup>
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">{label}</p>
                            <p className="text-xs text-muted-foreground">{listing.title}</p>
                            {listing.distanceKm != null && (
                              <p className="text-xs inline-flex items-center gap-1"><Navigation className="w-3 h-3" />{formatDistance(listing.distanceKm)}</p>
                            )}
                            <Link to={`/provider/${listing.id}`} className="text-xs font-medium text-primary">View profile</Link>
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              ) : (
                <div className="h-[280px] rounded-xl border border-dashed border-border/70 flex items-center justify-center text-sm text-muted-foreground">
                  No providers with map coordinates found for this search.
                </div>
              )}
            </motion.div>
          )}

          {/* Top Match */}
          {viewMode === "list" && showTopSeparately && topMatch && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Best Match</span>
              </div>
              <ProviderCard
                provider={{
                  id: topMatch.id,
                  name: (topMatch as any).profiles?.business_name || (topMatch as any).profiles?.full_name || "Unknown",
                  avatar: (topMatch as any).profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${(topMatch as any).profiles?.full_name || "U"}`,
                  title: topMatch.title,
                  skills: topMatch.skills || [],
                  rating: Number(topMatch.rating) || 0,
                  reviews: topMatch.review_count || 0,
                  hourlyRate: Number(topMatch.hourly_rate) || Number(topMatch.fixed_price) || 0,
                  location: topMatch.location || (topMatch as any).profiles?.location || "",
                  distance: topMatch.distanceKm != null ? formatDistance(topMatch.distanceKm) : "",
                  bio: topMatch.description,
                  experience: topMatch.experience || "",
                  availability: topMatch.availability || [],
                  responseTime: topMatch.response_time || "~30 min",
                  verified: true,
                }}
                index={0}
                matchReason={matchMap?.get(topMatch.id)?.matchReason}
              />
            </div>
          )}

          {/* Other Matches */}
          {viewMode === "list" && ((showTopSeparately && otherMatches.length > 0) || (!showTopSeparately && listings.length > 0)) && (
            <div>
              {showTopSeparately && (
                <div className="flex items-center gap-2 mb-2.5 mt-6">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Other Matches</span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
              )}
              <div className="space-y-2.5 sm:space-y-3">
                {(showTopSeparately ? otherMatches : listings).map((listing: any, i: number) => {
                  const match = matchMap?.get(listing.id);
                  const profile = listing.profiles;
                  return (
                    <ProviderCard
                      key={listing.id}
                      provider={{
                        id: listing.id,
                        name: profile?.business_name || profile?.full_name || "Unknown",
                        avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || "U"}`,
                        title: listing.title,
                        skills: listing.skills || [],
                        rating: Number(listing.rating) || 0,
                        reviews: listing.review_count || 0,
                        hourlyRate: Number(listing.hourly_rate) || Number(listing.fixed_price) || 0,
                        location: listing.location || profile?.location || "",
                        distance: listing.distanceKm != null ? formatDistance(listing.distanceKm) : "",
                        bio: listing.description,
                        experience: listing.experience || "",
                        availability: listing.availability || [],
                        responseTime: listing.response_time || "~30 min",
                        verified: true,
                      }}
                      index={showTopSeparately ? i + 1 : i}
                      matchReason={match?.matchReason}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA at bottom */}
          {!isLoading && !error && listings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 rounded-2xl bg-card border border-border/60 p-4 sm:p-6 text-center"
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">Don&apos;t see what you need?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user ? (
                  <Link to="/profile/edit" className="block w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="rounded-xl w-full h-11 min-h-[44px] touch-manipulation">Who I am & what I offer</Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="block w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="rounded-xl w-full h-11 min-h-[44px] touch-manipulation">Sign up & offer services</Button>
                  </Link>
                )}
                <Link to={user ? "/dashboard" : "/"} className="block w-full sm:w-auto">
                  <Button variant="soft" size="sm" className="rounded-xl w-full h-11 min-h-[44px] touch-manipulation">Try a different search</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
