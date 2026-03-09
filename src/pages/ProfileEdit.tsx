import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera, Upload, X, Loader2, MapPin, Phone, Mail, MessageSquare,
  Instagram, Facebook, Plus, Sparkles, Star, Building2, Briefcase, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ProfileEdit = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [emailPublic, setEmailPublic] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [liveLocation, setLiveLocation] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [portfolioVideos, setPortfolioVideos] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  // Listing state
  const [listingTitle, setListingTitle] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingType, setListingType] = useState<string>("service");
  const [hourlyRate, setHourlyRate] = useState("");
  const [fixedPrice, setFixedPrice] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [experience, setExperience] = useState("");

  const { data: profile, isLoading } = useQuery({
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

  const { data: existingListing } = useQuery({
    queryKey: ["my-listing", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: reviews } = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: async () => {
      const { data: listings } = await supabase
        .from("listings")
        .select("id")
        .eq("user_id", user!.id);
      if (!listings || listings.length === 0) return [];
      const listingIds = listings.map((l: any) => l.id);
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select("*")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!reviewsData || reviewsData.length === 0) return [];

      const reviewerIds = reviewsData
        .map((r) => r.reviewer_id)
        .filter((id): id is string => !!id);
      
      let profilesMap: Record<string, { full_name: string; avatar_url: string | null }> = {};
      if (reviewerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", reviewerIds);
        if (profiles) {
          profilesMap = Object.fromEntries(
            profiles.map((p) => [p.user_id, { full_name: p.full_name, avatar_url: p.avatar_url }])
          );
        }
      }

      return reviewsData.map((r) => ({
        ...r,
        profile: r.reviewer_id ? profilesMap[r.reviewer_id] || null : null,
      }));
    },
    enabled: !!user,
  });

  // Track initial state for dirty detection
  const [initialState, setInitialState] = useState<string>("");

  const currentState = useMemo(() => JSON.stringify({
    fullName, businessName, bio, location, phone, emailPublic, whatsapp, instagram, tiktok, facebook,
    avatarUrl, liveLocation, portfolioImages, portfolioVideos, certifications,
    listingTitle, listingDescription, listingType, hourlyRate, fixedPrice, skills, services, experience,
  }), [fullName, businessName, bio, location, phone, emailPublic, whatsapp, instagram, tiktok, facebook,
    avatarUrl, liveLocation, portfolioImages, portfolioVideos, certifications,
    listingTitle, listingDescription, listingType, hourlyRate, fixedPrice, skills, services, experience]);

  const hasChanges = initialState !== "" && currentState !== initialState;

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBusinessName((profile as any).business_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setPhone(profile.phone || "");
      setEmailPublic((profile as any).email_public || "");
      setWhatsapp((profile as any).whatsapp || "");
      setInstagram((profile as any).instagram || "");
      setTiktok((profile as any).tiktok || "");
      setFacebook((profile as any).facebook || "");
      setAvatarUrl(profile.avatar_url || "");
      setLiveLocation(profile.live_location_enabled || false);
      setPortfolioImages((profile as any).portfolio_images || []);
      setPortfolioVideos((profile as any).portfolio_videos || []);
      setCertifications((profile as any).certifications || []);
    }
  }, [profile]);

  useEffect(() => {
    if (existingListing) {
      setListingTitle(existingListing.title || "");
      setListingDescription(existingListing.description || "");
      setListingType(existingListing.listing_type || "service");
      setHourlyRate(existingListing.hourly_rate?.toString() || "");
      setFixedPrice(existingListing.fixed_price?.toString() || "");
      setSkills(existingListing.skills || []);
      setServices(existingListing.services || []);
      setExperience(existingListing.experience || "");
    }
  }, [existingListing]);

  // Set initial state once both profile and listing have loaded
  useEffect(() => {
    if (profile && !authLoading && !isLoading) {
      // small delay to allow listing state to settle
      const t = setTimeout(() => {
        setInitialState(JSON.stringify({
          fullName, businessName, bio, location, phone, emailPublic, whatsapp, instagram, tiktok, facebook,
          avatarUrl, liveLocation, portfolioImages, portfolioVideos, certifications,
          listingTitle, listingDescription, listingType, hourlyRate, fixedPrice, skills, services, experience,
        }));
      }, 300);
      return () => clearTimeout(t);
    }
  }, [profile, existingListing, authLoading, isLoading]);

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed", { description: error.message }); return null; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Avatar must be under 5MB"); return; }
    setUploading("avatar");
    const url = await uploadFile(file, "avatars");
    if (url) setAvatarUrl(url);
    setUploading(null);
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading("portfolio");
    for (const file of Array.from(files)) {
      if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name} too large (max 20MB)`); continue; }
      const url = await uploadFile(file, "portfolios");
      if (url) {
        if (file.type.startsWith("video/")) setPortfolioVideos(prev => [...prev, url]);
        else setPortfolioImages(prev => [...prev, url]);
      }
    }
    setUploading(null);
    if (portfolioInputRef.current) portfolioInputRef.current.value = "";
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading("cert");
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} too large (max 10MB)`); continue; }
      const url = await uploadFile(file, "certifications");
      if (url) setCertifications(prev => [...prev, url]);
    }
    setUploading(null);
    if (certInputRef.current) certInputRef.current.value = "";
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          setLocation(data.display_name || `${pos.coords.latitude}, ${pos.coords.longitude}`);
          toast.success("Location detected");
        } catch {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      () => toast.error("Location permission denied"),
      { timeout: 10000 }
    );
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setSaving(true);

    // Save profile
    const profileUpdate: Record<string, unknown> = {
      full_name: fullName.trim(),
      business_name: businessName.trim(),
      bio: bio.trim(),
      location: location.trim(),
      phone: phone.trim(),
      email_public: emailPublic.trim(),
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      tiktok: tiktok.trim(),
      facebook: facebook.trim(),
      avatar_url: avatarUrl,
      live_location_enabled: liveLocation,
      portfolio_images: portfolioImages,
      portfolio_videos: portfolioVideos,
      certifications,
    };
    if (liveLocation && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        profileUpdate.latitude = pos.coords.latitude;
        profileUpdate.longitude = pos.coords.longitude;
      } catch { /* ignore */ }
    }
    const { error: profileError } = await supabase.from("profiles").update(profileUpdate).eq("user_id", user.id);

    // Save listing if title exists
    let listingError = null;
    if (listingTitle.trim()) {
      const listingData = {
        user_id: user.id,
        listing_type: listingType as "service" | "product" | "property" | "vehicle" | "other",
        title: listingTitle.trim(),
        description: listingDescription.trim(),
        skills,
        services,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        fixed_price: fixedPrice ? parseFloat(fixedPrice) : null,
        location: location.trim(),
        experience,
      };

      if (existingListing) {
        ({ error: listingError } = await supabase.from("listings").update(listingData).eq("id", existingListing.id));
      } else {
        ({ error: listingError } = await supabase.from("listings").insert(listingData));
      }
    }

    setSaving(false);
    if (profileError || listingError) {
      toast.error("Failed to save", { description: (profileError || listingError)?.message });
    } else {
      toast.success("Everything saved!");
      setInitialState(currentState);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-listing"] });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-44 sm:pt-52 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-44 sm:pt-52 pb-16 flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-4">
            <div className="inline-flex items-center gap-2 w-14 h-14 justify-center rounded-xl bg-gradient-warm mb-6">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Sign in to get started</h1>
            <p className="text-muted-foreground mb-6">You need an account to manage your profile and offer services.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" onClick={() => navigate("/signup")}>Create Account</Button>
              <Button variant="outline" onClick={() => navigate("/login")}>Log In</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background">
      <Navbar />
      <div className="pt-44 sm:pt-52 pb-10 sm:pb-16 px-3 sm:px-6">
        <div className="container mx-auto max-w-2xl min-w-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 overflow-x-hidden">

            {/* Header */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-medium mb-3 border border-primary/10">
                <Sparkles className="w-3.5 h-3.5" /> My Profile
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Manage Your Profile</h1>
              <p className="text-muted-foreground mt-1">Update your identity, services, and how people find you.</p>
            </div>

            {/* Avatar */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-soft">
              <div className="relative">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName || "U"}`}
                  alt="Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary/20"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-elevated"
                >
                  {uploading === "avatar" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">{fullName || "Your Name"}</p>
                {businessName && <p className="text-sm text-primary font-medium">{businessName}</p>}
                {avgRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-sm font-semibold text-foreground">{avgRating}</span>
                    <span className="text-xs text-muted-foreground">({reviews?.length} reviews)</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Tap the camera icon to change your photo</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft min-w-0">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                Basic Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                <div className="space-y-2 min-w-0">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="min-w-0 w-full" />
                </div>
                <div className="space-y-2 min-w-0">
                  <Label>Business / Company Name</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Jane's Cleaning Co." className="min-w-0 w-full" />
                </div>
              </div>
              <div className="space-y-2 min-w-0">
                <Label>Bio</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself or your business..."
                  rows={5}
                  className="min-h-[120px] resize-y break-words overflow-auto"
                />
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                Location
              </h2>
              <div className="space-y-2">
                <Label>Address / Area</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nairobi, Westlands" className="pl-9" />
                  </div>
                  <Button type="button" variant="outline" onClick={handleGetLocation} className="shrink-0 h-11">
                    <MapPin className="w-4 h-4 mr-1" /> Detect
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Live Location</Label>
                  <p className="text-xs text-muted-foreground mt-1">Helps find people near you in real-time</p>
                </div>
                <Switch checked={liveLocation} onCheckedChange={setLiveLocation} />
              </div>
            </div>

            {/* Contact & Social */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                Contact & Social Links
              </h2>
              <p className="text-sm text-muted-foreground">All optional. Visible on your profile so people can reach you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 700 000 000" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Public Email</Label>
                  <Input type="email" value={emailPublic} onChange={(e) => setEmailPublic(e.target.value)} placeholder="contact@you.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</Label>
                  <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+254 700 000 000" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram</Label>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourhandle" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Facebook className="w-3.5 h-3.5" /> Facebook</Label>
                  <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="facebook.com/you" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">🎵 TikTok</Label>
                  <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="@yourhandle" />
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-accent" />
                </div>
                Portfolio — Work Samples
              </h2>
              <p className="text-sm text-muted-foreground">Upload images or videos of your work (optional). Max 20MB each.</p>
              <Button type="button" variant="outline" onClick={() => portfolioInputRef.current?.click()} disabled={uploading === "portfolio"}>
                {uploading === "portfolio" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
                Upload Images / Videos
              </Button>
              <input ref={portfolioInputRef} type="file" accept="image/*,video/*" multiple onChange={handlePortfolioUpload} className="hidden" />
              {(portfolioImages.length > 0 || portfolioVideos.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {portfolioImages.map((url, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-border aspect-square">
                      <img src={url} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPortfolioImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {portfolioVideos.map((url, i) => (
                    <div key={`v-${i}`} className="relative group rounded-xl overflow-hidden border border-border aspect-square">
                      <video src={url} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPortfolioVideos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-foreground/50 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground">Certifications</h2>
              <p className="text-sm text-muted-foreground">Upload any certificates or licenses (optional). PDF or images, max 10MB.</p>
              <Button type="button" variant="outline" onClick={() => certInputRef.current?.click()} disabled={uploading === "cert"}>
                {uploading === "cert" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
                Upload Certifications
              </Button>
              <input ref={certInputRef} type="file" accept="image/*,.pdf" multiple onChange={handleCertUpload} className="hidden" />
              {certifications.length > 0 && (
                <div className="space-y-2">
                  {certifications.map((url, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary border border-border">
                      <span className="flex-1 text-sm text-foreground truncate">{url.split("/").pop()}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0">View</a>
                      <button type="button" onClick={() => setCertifications(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==================== LISTING SECTION ==================== */}

            <div className="pt-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/10">
                  <Briefcase className="w-4 h-4" /> {existingListing ? "My Offering" : "Create an Offering"}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5">
                {existingListing ? "Update your offering so people can find you." : "Describe what you're offering — AI will match you with the right people."}
              </p>
            </div>

            {/* Type & Pricing */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                What are you offering?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="property">Property / House</SelectItem>
                      <SelectItem value="vehicle">Vehicle / Car</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{listingType === "service" ? "Hourly Rate (KSh)" : "Price (KSh)"}</Label>
                  {listingType === "service" ? (
                    <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="500" />
                  ) : (
                    <Input type="number" value={fixedPrice} onChange={(e) => setFixedPrice(e.target.value)} placeholder="5000" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={listingTitle} onChange={(e) => setListingTitle(e.target.value)} placeholder="e.g. Professional Nanny, 3-Bedroom House for Rent" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={listingDescription} onChange={(e) => setListingDescription(e.target.value)} placeholder="Describe in detail what you're offering..." rows={4} />
              </div>
              {listingType === "service" && (
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years" />
                </div>
              )}
            </div>

            {/* Services / Features */}
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground">
                {listingType === "service" ? "What can you do?" : "Key Features"}
              </h2>
              <p className="text-sm text-muted-foreground">Describe in natural language — add as many as you like.</p>
              <div className="flex gap-2">
                <Input value={serviceInput} onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                  placeholder={listingType === "service" ? "e.g. I can cook Mediterranean meals" : "e.g. 3 bedrooms, garden, parking"} />
                <Button type="button" variant="soft" onClick={addService}><Plus className="w-4 h-4" /></Button>
              </div>
              {services.length > 0 && (
                <div className="space-y-2">
                  {services.map((s) => (
                    <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/[0.05] border border-primary/10 text-sm text-foreground">
                      <span className="flex-1">{s}</span>
                      <button type="button" onClick={() => setServices(services.filter(x => x !== s))}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground">Tags & Keywords</h2>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Cooking, Plumbing, Furnished" />
                <Button type="button" variant="soft" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/15">
                      {s}
                      <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ==================== SAVE ALL BUTTON ==================== */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="sticky bottom-2 sm:bottom-4 z-20 pb-[env(safe-area-inset-bottom)]"
            >
              <Button
                variant="hero"
                size="lg"
                className={`w-full h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-semibold shadow-elevated transition-all duration-300 ${
                  hasChanges ? "scale-100 opacity-100" : "scale-[0.98] opacity-70"
                }`}
                onClick={handleSaveAll}
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving everything...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {hasChanges ? "Save All Changes" : "No changes to save"}
                  </>
                )}
              </Button>
            </motion.div>

            {/* ==================== REVIEWS / FEEDBACK ==================== */}

            <div className="rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4 shadow-soft">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                Reviews & Feedback
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r: any) => {
                    const name = r.profile?.full_name || "Anonymous";
                    const avatar = r.profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                    return (
                      <div key={r.id} className="flex gap-3 p-3 rounded-xl bg-primary/[0.03] border border-primary/[0.06]">
                        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground">{name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-primary fill-primary" : "text-muted-foreground/20"}`} />
                            ))}
                          </div>
                          {r.comment && <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/[0.06] flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-primary/40" />
                  </div>
                  <p className="text-sm text-muted-foreground">No reviews yet. Once you get feedback, it will show up here.</p>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
