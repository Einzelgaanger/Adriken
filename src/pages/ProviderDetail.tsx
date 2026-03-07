import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, ArrowLeft, Calendar, Briefcase, MessageSquare, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const ProviderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, avatar_url, location, bio)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/login");
      return;
    }
    if (!selectedDay) {
      toast.error("Please select a day first");
      return;
    }
    if (!listing) return;

    setBooking(true);
    const { error } = await supabase.from("bookings").insert({
      listing_id: listing.id,
      seeker_id: user.id,
      provider_id: listing.user_id,
      scheduled_day: selectedDay,
      message: message.trim(),
    });
    setBooking(false);

    if (error) {
      toast.error("Booking failed", { description: error.message });
    } else {
      toast.success("Booking request sent!", { description: "The provider will confirm shortly." });
      navigate("/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Listing not found</h1>
          <Link to="/"><Button variant="soft" className="mt-4">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const profile = listing.profiles as any;
  const name = profile?.full_name || "Provider";
  const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const price = listing.hourly_rate || listing.fixed_price || 0;
  const priceLabel = listing.hourly_rate ? "/hour" : listing.fixed_price ? " fixed" : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <button onClick={() => window.history.back()}>
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative">
                  <img src={avatar} alt={name} className="w-20 h-20 rounded-2xl object-cover" />
                  <CheckCircle2 className="w-5 h-5 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold text-foreground">{name}</h1>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                      <Shield className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{listing.title}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-foreground">{Number(listing.rating).toFixed(1)}</span>
                      ({listing.review_count} reviews)
                    </span>
                    {listing.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.location}</span>
                    )}
                    {listing.response_time && (
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {listing.response_time}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {listing.completed_jobs} completed
                    </span>
                  </div>
                </div>
                {price > 0 && (
                  <div className="text-center sm:text-right">
                    <div className="font-display text-3xl font-bold text-foreground">${Number(price)}</div>
                    <div className="text-sm text-muted-foreground">{priceLabel}</div>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> About
              </h2>
              <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              {listing.services && listing.services.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">What's offered:</h3>
                  <ul className="space-y-1">
                    {listing.services.map((s: string) => (
                      <li key={s} className="text-sm text-muted-foreground">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {listing.skills && listing.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {listing.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Booking */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Book This
              </h2>
              {listing.availability && listing.availability.length > 0 && (
                <>
                  <p className="text-sm text-muted-foreground mb-4">Select an available day:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const available = listing.availability?.includes(day);
                      return (
                        <button key={day} disabled={!available} onClick={() => setSelectedDay(day)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            selectedDay === day ? "bg-primary text-primary-foreground shadow-elevated"
                            : available ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                          }`}>{day}</button>
                      );
                    })}
                  </div>
                </>
              )}
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to the provider (optional)..."
                rows={3}
                className="mb-4"
              />
              <Button variant="hero" size="lg" className="w-full" onClick={handleBook} disabled={booking}>
                {booking ? "Sending..." : "Send Booking Request"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
