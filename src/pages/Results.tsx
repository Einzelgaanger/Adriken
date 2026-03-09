import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface AIMatch {
  id: string;
  matchScore: number;
  matchReason: string;
}

type SortOption = "relevance" | "rating" | "price-low" | "price-high";

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data: listings, error: dbError } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, business_name, avatar_url, location)")
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

      return { listings: sorted, matchMap };
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
  }

  const topMatch = listings[0];
  const otherMatches = sortBy === "relevance" ? listings.slice(1) : listings;
  const showTopSeparately = sortBy === "relevance" && listings.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-18 sm:pt-24 pb-10 sm:pb-20 px-3 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground h-10 min-h-[44px] touch-manipulation">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-8">
            <div className="inline-flex items-center gap-2 text-xs text-primary mb-2.5 font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> AI-powered results
            </div>
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground mb-1 break-words tracking-tight leading-tight">
              Results for "{query}"
            </h1>
            {!isLoading && listings.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">{listings.length} match{listings.length !== 1 ? "es" : ""} found</p>
            )}
          </motion.div>

          {/* Sort controls */}
          {!isLoading && listings.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {([
                ["relevance", "Best Match"],
                ["rating", "Top Rated"],
                ["price-low", "Price: Low"],
                ["price-high", "Price: High"],
              ] as [SortOption, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors shrink-0 min-h-[34px] touch-manipulation ${
                    sortBy === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/[0.06] flex items-center justify-center mb-5">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-semibold text-[15px]">AI is finding the best matches...</p>
              <p className="text-sm text-muted-foreground/60 mt-1">This usually takes a few seconds</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-destructive/[0.05] border border-destructive/15 p-8 text-center">
              <p className="text-destructive font-semibold">Something went wrong while searching.</p>
              <p className="text-sm text-muted-foreground mt-1.5">Please try again.</p>
            </div>
          )}

          {!isLoading && !error && listings.length === 0 && (
            <div className="rounded-2xl bg-card border border-border/60 p-10 sm:p-12 text-center shadow-soft">
              <p className="text-lg font-display font-bold text-foreground mb-2">No businesses found</p>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">Be the first to offer what people are looking for!</p>
              <Link to="/signup">
                <Button variant="hero" size="lg" className="rounded-xl">Sign Up & Create Your Profile</Button>
              </Link>
            </div>
          )}

          {/* Top Match */}
          {showTopSeparately && topMatch && (
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
                  distance: "",
                  bio: topMatch.description,
                  experience: topMatch.experience || "",
                  availability: topMatch.availability || [],
                  completedJobs: topMatch.completed_jobs || 0,
                  responseTime: topMatch.response_time || "~30 min",
                  verified: true,
                }}
                index={0}
                matchReason={matchMap?.get(topMatch.id)?.matchReason}
              />
            </div>
          )}

          {/* Other Matches */}
          {((showTopSeparately && otherMatches.length > 0) || (!showTopSeparately && listings.length > 0)) && (
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
                        distance: "",
                        bio: listing.description,
                        experience: listing.experience || "",
                        availability: listing.availability || [],
                        completedJobs: listing.completed_jobs || 0,
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
              className="mt-8 rounded-2xl bg-card border border-border/60 p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-3">Don't see what you need?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/signup">
                  <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto">Sign Up & Offer Services</Button>
                </Link>
                <Link to="/">
                  <Button variant="soft" size="sm" className="rounded-xl w-full sm:w-auto">Try a Different Search</Button>
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
