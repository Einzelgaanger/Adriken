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
      // Fetch all active listings with their provider profiles
      const { data: listings, error: dbError } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, location)")
        .eq("is_active", true);

      if (dbError) throw dbError;
      if (!listings || listings.length === 0) return { listings: [], matches: [] };

      // Call AI matching
      const { data: matchData, error: fnError } = await supabase.functions.invoke("match-listings", {
        body: {
          query,
          listings: listings.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            type: l.listing_type,
            skills: l.skills,
            services: l.services,
            location: l.location,
            hourly_rate: l.hourly_rate,
            fixed_price: l.fixed_price,
            experience: l.experience,
            rating: l.rating,
            review_count: l.review_count,
            availability: l.availability,
          })),
        },
      });

      if (fnError) throw fnError;

      const aiMatches: AIMatch[] = matchData?.matches || [];

      // Sort listings by AI match score
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
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 text-sm text-primary mb-2 font-medium">
              <Sparkles className="w-4 h-4" /> AI-powered results
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Results for: "{query}"
            </h1>
          </motion.div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">AI is finding the best matches...</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 text-center">
              <p className="text-destructive font-medium">Something went wrong while searching.</p>
              <p className="text-sm text-muted-foreground mt-1">Please try again.</p>
            </div>
          )}

          {!isLoading && !error && listings.length === 0 && (
            <div className="rounded-2xl bg-card border border-border p-10 text-center">
              <p className="text-lg font-display font-semibold text-foreground mb-2">No listings yet</p>
              <p className="text-muted-foreground mb-6">Be the first to offer what people are looking for!</p>
              <Link to="/become-provider">
                <Button variant="hero">Create a Listing</Button>
              </Link>
            </div>
          )}

          <div className="space-y-4">
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
