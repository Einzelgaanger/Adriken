import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Loader2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ViewingHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const { data: views, isLoading } = useQuery({
    queryKey: ["profile-views", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_views")
        .select("*, listings(title, location, hourly_rate, fixed_price, listing_type)")
        .eq("viewer_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const seen = new Set<string>();
      const deduped = (data || []).filter((v: any) => {
        if (seen.has(v.listing_id)) return false;
        seen.add(v.listing_id);
        return true;
      });

      const providerIds = Array.from(new Set(deduped.map((v: any) => v.provider_id).filter(Boolean)));
      let profilesByUserId = new Map<string, any>();

      if (providerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("user_id, full_name, business_name, avatar_url")
          .in("user_id", providerIds);
        if (profilesError) throw profilesError;
        profilesByUserId = new Map((profiles || []).map((p: any) => [p.user_id, p]));
      }

      return deduped.map((v: any) => ({
        ...v,
        profiles: profilesByUserId.get(v.provider_id) || null,
      }));
    },
    enabled: !!user,
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profile_views").delete().eq("viewer_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-views"] });
      toast.success("History cleared");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 sm:pt-20 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary shrink-0" /> Businesses I Checked
              </h1>
              {views && views.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => clearHistory.mutate()} className="text-muted-foreground hover:text-destructive h-8 text-xs">
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
            ) : views && views.length > 0 ? (
              <div className="space-y-2">
                {views.map((v: any) => {
                  const profile = v.profiles as any;
                  const listing = v.listings as any;
                  const name = profile?.business_name || profile?.full_name || "Business";
                  const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                  return (
                    <Link key={v.id} to={`/provider/${v.listing_id}`} className="block">
                      <div className="rounded-lg sm:rounded-xl bg-card border border-border p-3 sm:p-3.5 flex items-center gap-3 hover:border-primary/30 transition-colors">
                        <img src={avatar} alt="" className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-foreground truncate">{listing?.title || "Business"}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">by {name}</p>
                          {listing?.location && (
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">{listing.location}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" />
                            {new Date(v.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-card border border-border p-8 sm:p-10 text-center">
                <Eye className="w-9 h-9 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No viewing history yet</p>
                <Link to={user ? "/dashboard" : "/"}><Button variant="soft" size="sm" className="mt-3">Browse Services</Button></Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ViewingHistory;
