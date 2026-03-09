import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, X, Loader2, MapPin, Phone, Mail, MessageSquare, Instagram, Facebook, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
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

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
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

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed", { description: error.message });
      return null;
    }
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
      if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name} is too large (max 20MB)`); continue; }
      const url = await uploadFile(file, "portfolios");
      if (url) {
        if (file.type.startsWith("video/")) {
          setPortfolioVideos(prev => [...prev, url]);
        } else {
          setPortfolioImages(prev => [...prev, url]);
        }
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
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} is too large (max 10MB)`); continue; }
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
          const addr = data.display_name || `${pos.coords.latitude}, ${pos.coords.longitude}`;
          setLocation(addr);
          toast.success("Location detected");
        } catch {
          setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
      },
      () => toast.error("Location permission denied"),
      { timeout: 10000 }
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const update: Record<string, unknown> = {
      full_name: fullName.trim(),
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
    if (error) {
      toast.error("Failed to save", { description: error.message });
    } else {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
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

  if (!user) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">Edit Profile</h1>

            {/* Avatar */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-4 flex items-center gap-5">
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
                <p className="text-sm text-muted-foreground">Tap the camera icon to change your photo</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-4 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Basic Info</h2>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people about yourself..." rows={3} />
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-card border border-border p-6 mb-4 space-y-4">
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
            <div className="rounded-2xl bg-card border border-border p-6 mb-4 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Contact & Social Links</h2>
              <p className="text-sm text-muted-foreground">All optional. These will be visible on your profile so people can reach you.</p>
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
            <div className="rounded-2xl bg-card border border-border p-6 mb-4 space-y-4">
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
                      <button
                        type="button"
                        onClick={() => setPortfolioImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {portfolioVideos.map((url, i) => (
                    <div key={`v-${i}`} className="relative group rounded-xl overflow-hidden border border-border aspect-square">
                      <video src={url} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPortfolioVideos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
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
            <div className="rounded-2xl bg-card border border-border p-6 mb-6 space-y-4">
              <h2 className="font-display font-bold text-lg text-foreground">Certifications</h2>
              <p className="text-sm text-muted-foreground">Upload any certificates or licenses you have (optional). PDF or images, max 10MB each.</p>
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

            <Button variant="hero" size="lg" className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
