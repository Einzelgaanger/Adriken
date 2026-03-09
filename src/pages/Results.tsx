import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProviderCard from "@/components/ProviderCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AIMatch {
  id: string;
  matchScore: number;
  matchReason: string;
}

const Results = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const { data: listings, error: dbError } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, location)")
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

  const listings = data?.listings || [];
  const matchMap = data?.matchMap as Map<string, AIMatch> | undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="inline-block mb-5">
            <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 text-xs text-primary mb-3 font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> AI-powered results
            </div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground mb-1 break-words tracking-tight">
              Results for "{query}"
            </h1>
            {!isLoading && listings.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">{listings.length} match{listings.length !== 1 ? "es" : ""} found</p>
            )}
          </motion.div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
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
            <div className="rounded-2xl bg-card border border-border/60 p-12 text-center shadow-soft">
              <p className="text-lg font-display font-bold text-foreground mb-2">No listings yet</p>
              <p className="text-muted-foreground mb-7 max-w-sm mx-auto">Be the first to offer what people are looking for!</p>
              <Link to="/become-provider">
                <Button variant="hero" size="lg" className="rounded-xl">Create a Listing</Button>
              </Link>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            {listings.map((listing: any, i: number) => {
              const match = matchMap?.get(listing.id);
              const profile = listing.profiles;
              return (
                <ProviderCard
                  key={listing.id}
                  provider={{
                    id: listing.id,
                    name: profile?.full_name || "Unknown",
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
                  index={i}
                  matchReason={match?.matchReason}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
