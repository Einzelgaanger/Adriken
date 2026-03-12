import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  Loader2,
  Building2,
  Phone,
  Mail,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const STEPS = [
  { id: 1, title: "About you", icon: User },
  { id: 2, title: "Contact", icon: Phone },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Discover", icon: Sparkles },
];

type LatLng = { lat: number; lng: number };
const toRad = (v: number) => (v * Math.PI) / 180;
const haversineKm = (a: LatLng, b: LatLng) => {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
};
const formatDistance = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");

  // Step 2
  const [phone, setPhone] = useState("");
  const [emailPublic, setEmailPublic] = useState("");

  // Step 3
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);
  const [liveLocation, setLiveLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationText, setLocationText] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBusinessName((profile as any).business_name || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setEmailPublic((profile as any).email_public || "");
      setLiveLocation(!!profile.live_location_enabled);
      if (profile.latitude != null && profile.longitude != null) {
        setUserCoords({ lat: profile.latitude, lng: profile.longitude });
      }
      if (profile.location) setLocationText(profile.location);
    }
  }, [profile]);

  const { data: nearbyListings } = useQuery({
    queryKey: ["onboarding-nearby", userCoords?.lat, userCoords?.lng],
    queryFn: async () => {
      const { data: listings, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, business_name, avatar_url, location, latitude, longitude)")
        .eq("is_active", true);
      if (error) throw error;
      if (!listings?.length || !userCoords) return [];
      return (listings as any[])
        .map((l) => {
          const lat = l.latitude ?? l.profiles?.latitude;
          const lng = l.longitude ?? l.profiles?.longitude;
          if (lat == null || lng == null) return null;
          return { ...l, distanceKm: haversineKm(userCoords, { lat, lng }) };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.distanceKm - b.distanceKm)
        .slice(0, 6);
    },
    enabled: step === 4 && !!userCoords,
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, user, navigate]);

  const saveProfile = async (updates: Record<string, unknown>) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase
        .from("profiles")
        .update({ onboarding_completed_at: new Date().toISOString() })
        .eq("user_id", user.id);
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      navigate("/dashboard", { replace: true });
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleStep1Next = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({
        full_name: fullName.trim(),
        business_name: businessName.trim() || null,
        bio: bio.trim() || null,
      });
      setStep(2);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleStep2Next = async () => {
    setSaving(true);
    try {
      await saveProfile({
        phone: phone.trim() || null,
        email_public: emailPublic.trim() || null,
      });
      setStep(3);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleStep3Next = async () => {
    setSaving(true);
    try {
      await saveProfile({
        latitude: userCoords?.lat ?? null,
        longitude: userCoords?.lng ?? null,
        live_location_enabled: liveLocation,
        location: locationText.trim() || null,
      });
      setStep(4);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocating(false);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await res.json();
          setLocationText(data.display_name || "");
        } catch {
          setLocationText(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        }
      },
      () => {
        setLocating(false);
        toast.error("Could not get location");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-2 flex-1 max-w-[60px] rounded-full transition-colors ${
                step >= s.id ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Welcome to Adriken</h1>
                <p className="text-sm text-muted-foreground mt-1">Tell us a bit about yourself so we can personalize your experience.</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                <div className="space-y-2">
                  <Label>Your name *</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Jane" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business name (optional)</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. My Shop" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Short bio (optional)</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What you do or what you're looking for" rows={2} className="rounded-xl resize-none" />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip onboarding
                  </Button>
                  <Button onClick={handleStep1Next} disabled={saving} className="rounded-xl flex-1">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">How can people reach you?</h1>
                <p className="text-sm text-muted-foreground mt-1">Optional — you can add or change these later in your profile.</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 700 000 000" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email (for contact)</Label>
                  <Input type="email" value={emailPublic} onChange={(e) => setEmailPublic(e.target.value)} placeholder="you@example.com" className="rounded-xl" />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip onboarding
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">Back</Button>
                    <Button onClick={handleStep2Next} disabled={saving} className="rounded-xl flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Where are you?</h1>
                <p className="text-sm text-muted-foreground mt-1">We'll show you services and people near you.</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                {!userCoords ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">Allow location access to see businesses around you.</p>
                    <Button onClick={requestLocation} disabled={locating} className="rounded-xl h-12 w-full">
                      {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Navigation className="w-5 h-5 mr-2" /> Use my location</>}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={locationText} onChange={(e) => setLocationText(e.target.value)} placeholder="City or area" className="rounded-xl" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-3">
                      <span className="text-sm font-medium">Use live location on my profile</span>
                      <Switch checked={liveLocation} onCheckedChange={setLiveLocation} />
                    </div>
                  </>
                )}
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip onboarding
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">Back</Button>
                    <Button onClick={handleStep3Next} disabled={saving} className="rounded-xl flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">You're all set</h1>
                <p className="text-sm text-muted-foreground mt-1">Here are some businesses near you to get started.</p>
              </div>

              {!userCoords && (
                <div className="rounded-2xl bg-card border border-border p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Enable location to see nearby businesses.</p>
                  <Button onClick={requestLocation} disabled={locating} className="rounded-xl">
                    {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Use my location"}
                  </Button>
                </div>
              )}

              {userCoords && nearbyListings && nearbyListings.length > 0 && (
                <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-soft">
                  <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Around you
                  </h2>
                  <div className="space-y-2">
                    {nearbyListings.slice(0, 5).map((listing: any, i: number) => (
                      <Link key={listing.id} to={`/provider/${listing.id}`} className="block p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${listing.profiles?.full_name || "U"}`}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{listing.profiles?.business_name || listing.profiles?.full_name || "Business"}</p>
                            <p className="text-xs text-muted-foreground truncate">{listing.title}</p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">{formatDistance(listing.distanceKm)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link to="/nearby" className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full rounded-xl">See all nearby</Button>
                  </Link>
                </div>
              )}

              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 sm:p-5 flex items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Head to your dashboard to search, browse, and message providers.</p>
                  <p className="text-sm text-muted-foreground mt-0.5">You can always edit your profile later.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl flex-1">Back</Button>
                <Button onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Go to dashboard"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
