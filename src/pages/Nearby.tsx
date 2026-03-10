import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { ArrowLeft, Loader2, Map as MapIcon, List as ListIcon, MapPin, Navigation } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type ViewMode = "list" | "map";
type LatLng = { lat: number; lng: number };

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

const Nearby = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported on this device.");
      return;
    }

    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocating(false);

        // Save latest location for logged-in users.
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id;
        if (userId) {
          await supabase
            .from("profiles")
            .update({
              latitude: coords.lat,
              longitude: coords.lng,
              live_location_enabled: true,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
      },
      () => {
        setLocating(false);
        setLocationError("Location access is required to show who is around you.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const { data: nearbyListings, isLoading, error } = useQuery({
    queryKey: ["nearby-listings", userCoords?.lat, userCoords?.lng],
    queryFn: async () => {
      const { data: listings, error: dbError } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, business_name, avatar_url, location, latitude, longitude)")
        .eq("is_active", true);

      if (dbError) throw dbError;
      if (!listings || !userCoords) return [];

      return listings
        .map((listing: any) => {
          const lat = listing.latitude ?? listing.profiles?.latitude;
          const lng = listing.longitude ?? listing.profiles?.longitude;
          if (lat == null || lng == null) return null;
          const distanceKm = haversineKm(userCoords, { lat, lng });
          return { ...listing, distanceKm, lat, lng };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
    },
    enabled: !!userCoords,
  });

  const mapCenter: [number, number] = useMemo(() => {
    if (userCoords) return [userCoords.lat, userCoords.lng];
    return [-1.286389, 36.817223];
  }, [userCoords]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-44 sm:pt-52 pb-10 sm:pb-20 px-3 sm:px-6 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
        <div className="container mx-auto max-w-3xl">
          <Link to="/dashboard" className="inline-block mb-3 sm:mb-4">
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground h-10 min-h-[44px] touch-manipulation px-3">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-1 break-words tracking-tight leading-tight">
              See businesses and people near you
            </h1>
            <p className="text-[13px] sm:text-sm text-muted-foreground">Discover services, goods sellers, and people around you without searching.</p>
          </motion.div>

          {!userCoords && (
            <div className="rounded-2xl bg-card border border-border/60 p-4 sm:p-8 text-center shadow-soft">
              <MapPin className="w-8 h-8 sm:w-7 sm:h-7 text-primary mx-auto mb-3 sm:mb-2" aria-hidden />
              <p className="text-foreground font-semibold text-[15px] sm:text-base mb-1">Enable live location to continue</p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-[280px] mx-auto">{locationError || "We need your location to show who is around you."}</p>
              <Button variant="hero" onClick={requestLocation} disabled={locating} className="rounded-xl h-12 min-h-[44px] px-6 touch-manipulation w-full sm:w-auto">
                {locating ? "Getting location..." : "Use My Location"}
              </Button>
            </div>
          )}

          {userCoords && (
            <>
              <div className="mb-3 sm:mb-4">
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
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/[0.06] flex items-center justify-center mb-4 sm:mb-5">
                    <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary animate-spin" aria-hidden />
                  </div>
                  <p className="text-muted-foreground font-semibold text-[14px] sm:text-[15px]">Finding who is around you...</p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-destructive/[0.05] border border-destructive/15 p-5 sm:p-8 text-center">
                  <p className="text-destructive font-semibold text-[15px] sm:text-base">Could not load nearby listings.</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">Please try again.</p>
                </div>
              )}

              {!isLoading && !error && nearbyListings && nearbyListings.length === 0 && (
                <div className="rounded-2xl bg-card border border-border/60 p-5 sm:p-8 text-center shadow-soft">
                  <p className="text-foreground font-semibold text-[15px] sm:text-base mb-1">No nearby listings yet</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">As more people add their location, they will appear here automatically.</p>
                </div>
              )}

              {viewMode === "map" && !isLoading && !error && nearbyListings && nearbyListings.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-xl sm:rounded-2xl border border-border/60 bg-card p-1.5 sm:p-3 shadow-soft overflow-hidden">
                  <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="h-[280px] sm:h-[420px] md:h-[520px] w-full rounded-lg sm:rounded-xl">
                    <MapResizeHandler />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CircleMarker center={[userCoords.lat, userCoords.lng]} radius={8} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}>
                      <Popup>You are here</Popup>
                    </CircleMarker>

                    {nearbyListings.map((listing: any) => {
                      const label = listing.profiles?.business_name || listing.profiles?.full_name || "Provider";
                      return (
                        <CircleMarker
                          key={listing.id}
                          center={[listing.lat, listing.lng]}
                          radius={7}
                          pathOptions={{ color: "#ea580c", fillColor: "#f97316", fillOpacity: 0.9 }}
                        >
                          <Popup>
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{label}</p>
                              <p className="text-xs text-muted-foreground">{listing.title}</p>
                              <p className="text-xs inline-flex items-center gap-1"><Navigation className="w-3 h-3" />{formatDistance(listing.distanceKm)}</p>
                              <Link to={`/provider/${listing.id}`} className="inline-block mt-1 py-1.5 px-2 -mx-1 rounded text-xs font-medium text-primary hover:underline min-h-[32px] touch-manipulation">View profile</Link>
                            </div>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </motion.div>
              )}

              {viewMode === "list" && !isLoading && !error && nearbyListings && nearbyListings.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {nearbyListings.map((listing: any, i: number) => {
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
                          distance: formatDistance(listing.distanceKm),
                          bio: listing.description,
                          experience: listing.experience || "",
                          availability: listing.availability || [],
                          responseTime: listing.response_time || "~30 min",
                          verified: true,
                        }}
                        index={i + 1}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nearby;
