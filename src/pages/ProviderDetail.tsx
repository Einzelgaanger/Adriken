import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, CheckCircle2, ArrowLeft, Calendar,
  Briefcase, MessageSquare, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { mockProviders } from "@/data/mockProviders";
import { useState } from "react";
import { toast } from "sonner";

const ProviderDetail = () => {
  const { id } = useParams();
  const provider = mockProviders.find((p) => p.id === id);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Provider not found</h1>
          <Link to="/">
            <Button variant="soft" className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    if (!selectedDay) {
      toast.error("Please select a day first");
      return;
    }
    toast.success(`Booking request sent to ${provider.name} for ${selectedDay}!`, {
      description: "They'll confirm shortly. You'll receive an email notification.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="javascript:void(0)" onClick={() => window.history.back()}>
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to results
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  {provider.verified && (
                    <CheckCircle2 className="w-5 h-5 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl font-bold text-foreground">{provider.name}</h1>
                    {provider.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                        <Shield className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{provider.title}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-foreground">{provider.rating}</span>
                      ({provider.reviews} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {provider.location} · {provider.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Responds in {provider.responseTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {provider.completedJobs} jobs completed
                    </span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="font-display text-3xl font-bold text-foreground">${provider.hourlyRate}</div>
                  <div className="text-sm text-muted-foreground">/hour</div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> About
              </h2>
              <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {provider.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Booking */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Book {provider.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select an available day to send a booking request:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                  const available = provider.availability.includes(day);
                  return (
                    <button
                      key={day}
                      disabled={!available}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedDay === day
                          ? "bg-primary text-primary-foreground shadow-elevated"
                          : available
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={handleBook}>
                Send Booking Request
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetail;
