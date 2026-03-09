import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Loader2, Calendar, CheckCircle2, XCircle, Clock, MessageSquare, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const { data: bookingsAsSeeker } = useQuery({
    queryKey: ["bookings-seeker", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, listings(title), profiles!bookings_provider_id_fkey(full_name)")
        .eq("seeker_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: bookingsAsProvider } = useQuery({
    queryKey: ["bookings-provider", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, listings(title), profiles!bookings_seeker_id_fkey(full_name)")
        .eq("provider_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });


  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status: status as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings-provider"] });
      queryClient.invalidateQueries({ queryKey: ["bookings-seeker"] });
      toast.success("Booking updated");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                <Link to="/profile/edit" className="flex-1 sm:flex-none">
                  <Button variant="soft" size="sm" className="w-full h-11 rounded-xl"><User className="w-4 h-4 mr-1" /> My Profile</Button>
                </Link>
                <Link to="/messages" className="flex-1 sm:flex-none">
                  <Button variant="outline" size="sm" className="w-full h-11 rounded-xl"><MessageSquare className="w-4 h-4 mr-1" /> Messages</Button>
                </Link>
                <Link to="/history" className="flex-1 sm:flex-none">
                  <Button variant="outline" size="sm" className="w-full h-11 rounded-xl"><Eye className="w-4 h-4 mr-1" /> History</Button>
                </Link>
                <Link to="/become-provider" className="flex-1 sm:flex-none">
                  <Button variant="hero" size="sm" className="w-full h-11 rounded-xl"><Plus className="w-4 h-4 mr-1" /> New Listing</Button>
                </Link>
              </div>
            </div>


            {/* Incoming Bookings (as provider) */}
            {bookingsAsProvider && bookingsAsProvider.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Incoming Booking Requests
                </h2>
                <div className="space-y-3">
                  {bookingsAsProvider.map((b: any) => {
                    const StatusIcon = statusIcons[b.status] || Clock;
                    return (
                      <div key={b.id} className="rounded-xl bg-card border border-border p-4">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{b.profiles?.full_name || "Someone"} wants to book</p>
                            <p className="text-sm text-muted-foreground">{b.listings?.title}</p>
                            {b.scheduled_day && <p className="text-xs text-muted-foreground mt-1">Day: {b.scheduled_day}</p>}
                            {b.message && <p className="text-xs text-muted-foreground mt-1 italic">"{b.message}"</p>}
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                            <StatusIcon className="w-3 h-3" /> {b.status}
                          </span>
                        </div>
                        {b.status === "pending" && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button size="sm" variant="hero" className="min-h-[44px] rounded-xl touch-manipulation" onClick={() => updateBookingStatus.mutate({ id: b.id, status: "confirmed" })}>
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" className="min-h-[44px] rounded-xl touch-manipulation" onClick={() => updateBookingStatus.mutate({ id: b.id, status: "cancelled" })}>
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* My Bookings (as seeker) */}
            {bookingsAsSeeker && bookingsAsSeeker.length > 0 && (
              <section>
                <h2 className="font-display font-bold text-xl text-foreground mb-4">My Booking Requests</h2>
                <div className="space-y-3">
                  {bookingsAsSeeker.map((b: any) => {
                    const StatusIcon = statusIcons[b.status] || Clock;
                    return (
                      <div key={b.id} className="rounded-xl bg-card border border-border p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{b.listings?.title}</p>
                          <p className="text-sm text-muted-foreground">with {b.profiles?.full_name || "Provider"}</p>
                          {b.scheduled_day && <p className="text-xs text-muted-foreground mt-1">Day: {b.scheduled_day}</p>}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                          <StatusIcon className="w-3 h-3" /> {b.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
