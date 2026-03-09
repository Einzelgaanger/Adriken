import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera, Upload, X, Loader2, MapPin, Phone, Mail, MessageSquare,
  Instagram, Facebook, Plus, Sparkles, Star, Building2, Briefcase
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

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [savingListing, setSavingListing] = useState(false);

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

  // Fetch existing listing
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

  // Fetch reviews for this user's listings
  const { data: reviews } = useQuery({
    queryKey: ["my-reviews", user?.id],
    queryFn: async () => {
      // Get all listings by this user first
      const { data: listings } = await supabase
        .from("listings")
        .select("id")
        .eq("user_id", user!.id);
      if (!listings || listings.length === 0) return [];
      const listingIds = listings.map((l: any) => l.id);
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles:reviewer_id(full_name, avatar_url)")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false });
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
      setAvailability(existingListing.availability || []);
      setExperience(existingListing.experience || "");
    }
  }, [existingListing]);

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

  const toggleDay = (day: string) => {
    setAvailability(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const update: Record<string, unknown> = {
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
        update.latitude = pos.coords.latitude;
        update.longitude = pos.coords.longitude;
      } catch { /* ignore */ }
    }
    const { error } = await supabase.from("profiles").update(update).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error("Failed to save", { description: error.message });
    else {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  const handleSaveListing = async () => {
    if (!user) return;
    if (!listingTitle.trim()) { toast.error("Please add a title for your listing"); return; }
    setSavingListing(true);

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
      availability,
      experience,
    };

    let error;
    if (existingListing) {
      ({ error } = await supabase.from("listings").update(listingData).eq("id", existingListing.id));
    } else {
      ({ error } = await supabase.from("listings").insert(listingData));
    }

    setSavingListing(false);
    if (error) toast.error("Failed to save listing", { description: error.message });
    else {
      toast.success(existingListing ? "Listing updated!" : "Listing created!");
      queryClient.invalidateQueries({ queryKey: ["my-listing"] });
    }
  };

  if (authLoading || isLoading) {
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
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Header */}
            <div className="text-center mb-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your identity, listings, and how people find you.</p>
            </div>

            {/* ==================== PROFILE SECTION ==================== */}

            {/* Avatar */}
            <div className="rounded-2xl bg-card border border-border p-6 flex items-center gap-5">
              <div className="relative">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName || "U"}`}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-border"
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
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Basic Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business / Company Name</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Jane's Cleaning Co." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself or your business..." rows={3} />
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Location</h2>
              <div className="space-y-2">
                <Label>Address / Area</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nairobi, Westlands" className="pl-9" />
                  </div>
                  <Button type="button" variant="outline" onClick={handleGetLocation} className="shrink-0">
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
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Contact & Social Links</h2>
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
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Portfolio — Work Samples</h2>
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
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
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

            {/* Save Profile */}
            <Button variant="hero" size="lg" className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving Profile..." : "Save Profile"}
            </Button>

            {/* ==================== LISTING SECTION ==================== */}

            <div className="pt-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  <Briefcase className="w-4 h-4" /> {existingListing ? "My Listing" : "Create a Listing"}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5">
                {existingListing ? "Update your listing so people can find you." : "Describe what you're offering — AI will match you with the right people."}
              </p>
            </div>

            {/* Type & Pricing */}
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">What are you offering?</h2>
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
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
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
                    <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-secondary-foreground">
                      <span className="flex-1">{s}</span>
                      <button type="button" onClick={() => setServices(services.filter(x => x !== s))}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
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
                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {s}
                      <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            {listingType === "service" && (
              <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h2 className="font-display font-bold text-lg text-foreground">Availability</h2>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        availability.includes(day)
                          ? "bg-primary text-primary-foreground shadow-elevated"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Listing */}
            <Button variant="hero" size="lg" className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleSaveListing} disabled={savingListing}>
              {savingListing ? "Saving..." : existingListing ? "Update Listing" : "Publish Listing"}
            </Button>

            {/* ==================== REVIEWS / FEEDBACK ==================== */}

            <div className="rounded-2xl bg-card border border-border p-6 space-y-4 mt-4">
              <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Reviews & Feedback
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r: any) => {
                    const p = r.profiles as any;
                    const name = p?.full_name || "Anonymous";
                    const avatar = p?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
                    return (
                      <div key={r.id} className="flex gap-3">
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
                <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Once you get feedback, it will show up here.</p>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
