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
  Package,
  Briefcase,
  Users,
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

const STEPS = [
  { id: 1, title: "What you offer", icon: Briefcase },
  { id: 2, title: "About you", icon: User },
  { id: 3, title: "Contact", icon: Phone },
  { id: 4, title: "Location", icon: MapPin },
  { id: 5, title: "What's next", icon: Package },
  { id: 6, title: "Tour", icon: Sparkles },
];

type LatLng = { lat: number; lng: number };

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: what they offer (any combination of goods, service, friends)
  const [intents, setIntents] = useState<("goods" | "service" | "friends")[]>([]);
  const toggleIntent = (value: "goods" | "service" | "friends") => {
    setIntents((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };
  const hasGoods = intents.includes("goods");
  const hasService = intents.includes("service");
  const hasFriends = intents.includes("friends");
  const onlyFriends = intents.length === 1 && hasFriends;
  const showBusinessName = hasGoods || hasService;

  // Step 2
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");

  // Step 3
  const [phone, setPhone] = useState("");
  const [emailPublic, setEmailPublic] = useState("");

  // Step 4
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
      const p = profile as any;
      if (p.onboarding_intents?.length) setIntents(p.onboarding_intents);
      else if (p.onboarding_intent === "goods" || p.onboarding_intent === "service" || p.onboarding_intent === "friends") setIntents([p.onboarding_intent]);
      setFullName(profile.full_name || "");
      setBusinessName(p.business_name || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setEmailPublic(p.email_public || "");
      setLiveLocation(!!profile.live_location_enabled);
      if (profile.latitude != null && profile.longitude != null) {
        setUserCoords({ lat: profile.latitude, lng: profile.longitude });
      }
      if (profile.location) setLocationText(profile.location);
    }
  }, [profile]);


  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, user, navigate]);

  // First-time users only: if they already completed onboarding, send to dashboard
  useEffect(() => {
    if (profile && (profile as any).onboarding_completed_at) navigate("/dashboard", { replace: true });
  }, [profile, navigate]);

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
      const completedAt = new Date().toISOString();
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed_at: completedAt })
        .eq("user_id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      queryClient.setQueryData(["profile-onboarding", user.id], { onboarding_completed_at: completedAt });
      toast.success("You're all set! Taking you to your dashboard…");
      setTimeout(() => navigate("/dashboard", { replace: true }), 900);
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleStep1Next = async () => {
    if (intents.length === 0) {
      toast.error("Please choose at least one");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({ onboarding_intents: intents });
      setStep(2);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleStep2Next = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSaving(true);
    try {
      await saveProfile({
        full_name: fullName.trim(),
        business_name: showBusinessName ? (businessName.trim() || null) : null,
        bio: bio.trim() || null,
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
        phone: phone.trim() || null,
        email_public: emailPublic.trim() || null,
      });
      setStep(4);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const handleStep4Next = async () => {
    setSaving(true);
    try {
      await saveProfile({
        latitude: userCoords?.lat ?? null,
        longitude: userCoords?.lng ?? null,
        live_location_enabled: liveLocation,
        location: locationText.trim() || null,
      });
      setStep(5);
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const startTour = async () => {
    if (!user) return;
    const completedAt = new Date().toISOString();
    const { error } = await supabase.from("profiles").update({ onboarding_completed_at: completedAt }).eq("user_id", user.id);
    if (!error) {
      queryClient.setQueryData(["profile-onboarding", user.id], { onboarding_completed_at: completedAt });
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
    navigate("/nearby?onboarding_tour=1");
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
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">What brings you to Adriken?</h1>
                <p className="text-sm text-muted-foreground mt-1">Pick all that apply — we'll tailor your experience.</p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-3 shadow-soft">
                {[
                  { value: "goods" as const, label: "Share or sell goods", sub: "Products, items, properties", icon: Package },
                  { value: "service" as const, label: "Offer a service", sub: "Skills, gigs, professional help", icon: Briefcase },
                  { value: "friends" as const, label: "Connect with people", sub: "Make friends, find community", icon: Users },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleIntent(opt.value)}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                      intents.includes(opt.value) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <opt.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.sub}</p>
                    </div>
                    {intents.includes(opt.value) && <CheckCircle2 className="w-5 h-5 text-primary ml-auto shrink-0" />}
                  </button>
                ))}
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip onboarding
                  </Button>
                  <Button onClick={handleStep1Next} disabled={saving || intents.length === 0} className="rounded-xl flex-1">
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
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {onlyFriends ? "Introduce yourself" : "About you"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {onlyFriends ? "A few details so others can find you." : "Tell us a bit about yourself so we can personalize your experience."}
                </p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                <div className="space-y-2">
                  <Label>Your name *</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Jane" className="rounded-xl" />
                </div>
                {showBusinessName && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business name (optional)</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. My Shop" className="rounded-xl" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Short bio (optional)</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={onlyFriends ? "What you're into or looking for" : "What you do or what you're looking for"}
                    rows={2}
                    className="rounded-xl resize-none"
                  />
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
                    <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl">Back</Button>
                    <Button onClick={handleStep4Next} disabled={saving} className="rounded-xl flex-1">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">What's next for you</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasGoods && hasService && "You can add your goods and your service offering in your profile. We'll show you where."}
                  {hasGoods && !hasService && "You can upload your goods — photos, name, price, location — in your profile. We'll take you there."}
                  {hasService && !hasGoods && "You can add your service — title, description, rates — in your profile. We'll show you where."}
                  {onlyFriends && "Discover people and places near you. We'll take you through the app."}
                  {hasFriends && (hasGoods || hasService) && "You can add goods or services in your profile and discover people nearby. We'll show you around."}
                </p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                {(hasGoods || hasService) && (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 sm:p-4">
                    <p className="text-sm font-medium text-foreground">
                      {hasGoods && "• Upload items: photos, name, price, description, location (e.g. properties, products)."}
                    </p>
                    {hasGoods && hasService && <br />}
                    <p className="text-sm font-medium text-foreground">
                      {hasService && "• Add your offering: title, description, skills, and rates so clients can find you."}
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">We'll walk you through the key pages next.</p>
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip to dashboard
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <Button variant="outline" onClick={() => setStep(4)} className="rounded-xl">Back</Button>
                    <Button onClick={() => setStep(6)} className="rounded-xl flex-1">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">Take a quick tour</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll take you to Nearby, Search, and your Profile so you know where to do what.
                </p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>See who's around you (Nearby)</li>
                  <li>Try searching for services, goods, or people</li>
                  <li>Add your profile details, goods, or offering</li>
                  <li>Land on your dashboard</li>
                </ul>
                <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                  <Button variant="ghost" onClick={completeOnboarding} disabled={saving} className="rounded-xl flex-1">
                    Skip to dashboard
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <Button variant="outline" onClick={() => setStep(5)} className="rounded-xl">Back</Button>
                    <Button onClick={startTour} className="rounded-xl flex-1">
                      Start tour
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
