import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, CheckCircle2, ArrowLeft, MessageSquare, Shield, Loader2, Phone, Mail, Instagram, Facebook, ExternalLink, Image, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ReviewsSection from "@/components/ReviewsSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const ProviderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(full_name, business_name, avatar_url, location, bio, phone, whatsapp, instagram, tiktok, facebook, email_public, certifications, portfolio_images, portfolio_videos)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Track profile view (only for signed-in users)
  useEffect(() => {
    if (user && listing && user.id !== listing.user_id) {
      supabase.from("profile_views").insert({
        viewer_id: user.id,
        listing_id: listing.id,
        provider_id: listing.user_id,
      }).then(() => {});
    }
  }, [user, listing]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Business not found</h1>
          <Link to={user ? "/dashboard" : "/"}><Button variant="soft" className="mt-4">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const profile = listing.profiles as any;
  const name = profile?.business_name || profile?.full_name || "Business";
  const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const price = listing.hourly_rate || listing.fixed_price || 0;
  const priceLabel = listing.hourly_rate ? "/hour" : listing.fixed_price ? " fixed" : "";
  const portfolioImages: string[] = profile?.portfolio_images || [];
  const portfolioVideos: string[] = profile?.portfolio_videos || [];
  const certifications: string[] = profile?.certifications || [];
  const hasContact = profile?.phone || profile?.whatsapp || profile?.email_public || profile?.instagram || profile?.facebook || profile?.tiktok;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-18 sm:pt-24 pb-10 sm:pb-16 px-3 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <Button type="button" variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4 sm:mb-6 h-11 min-w-[44px] rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="rounded-2xl bg-card border border-border p-3.5 sm:p-6 mb-3.5 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img src={avatar} alt={name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover" />
                  <CheckCircle2 className="w-5 h-5 text-accent absolute -bottom-1 -right-1 bg-card rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">{name}</h1>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent"><Shield className="w-3.5 h-3.5" /> Verified</span>
                  </div>
                  {profile?.business_name && profile?.full_name && (
                    <p className="text-sm text-muted-foreground mb-1">by {profile.full_name}</p>
                  )}
                  <p className="text-muted-foreground mb-2 text-sm sm:text-base">{listing.title}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-foreground">{Number(listing.rating).toFixed(1)}</span>
                      ({listing.review_count} reviews)
                    </span>
                    {listing.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {listing.location}</span>}
                    {listing.response_time && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {listing.response_time}</span>}
                  </div>
                </div>
                {price > 0 && (
                  <div className="text-center sm:text-right">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">KSh {Number(price).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{priceLabel}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {hasContact && (
              <div className="rounded-2xl bg-card border border-border p-3.5 sm:p-6 mb-3.5 sm:mb-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-3">Contact</h2>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {profile?.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      <Phone className="w-4 h-4 text-muted-foreground" /> {profile.phone}
                    </a>
                  )}
                  {profile?.whatsapp && (
                    <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" /> WhatsApp
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.email_public && (
                    <a href={`mailto:${profile.email_public}`} className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      <Mail className="w-4 h-4 text-muted-foreground" /> {profile.email_public}
                    </a>
                  )}
                  {profile?.instagram && (
                    <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      <Instagram className="w-4 h-4 text-muted-foreground" /> {profile.instagram}
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.facebook && (
                    <a href={profile.facebook.startsWith("http") ? profile.facebook : `https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      <Facebook className="w-4 h-4 text-muted-foreground" /> Facebook
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {profile?.tiktok && (
                    <a href={`https://tiktok.com/@${profile.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] sm:text-sm text-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-secondary min-h-[42px]">
                      🎵 {profile.tiktok}
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl bg-card border border-border p-3.5 sm:p-6 mb-3.5 sm:mb-6">
              <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> About
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

            {/* Portfolio */}
            {(portfolioImages.length > 0 || portfolioVideos.length > 0) && (
              <div className="rounded-2xl bg-card border border-border p-3.5 sm:p-6 mb-3.5 sm:mb-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" /> Work Portfolio
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {portfolioImages.map((url, i) => (
                    <button key={i} type="button" onClick={() => setLightboxImg(url)} className="rounded-xl overflow-hidden border border-border aspect-square hover:opacity-90 transition-opacity">
                      <img src={url} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {portfolioVideos.map((url, i) => (
                    <div key={`v-${i}`} className="rounded-xl overflow-hidden border border-border aspect-square relative">
                      <video src={url} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="rounded-2xl bg-card border border-border p-3.5 sm:p-6 mb-3.5 sm:mb-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" /> Certifications
                </h2>
                <div className="space-y-2">
                  {certifications.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-sm text-foreground hover:text-primary transition-colors">
                      📄 {url.split("/").pop()}
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews — visible to everyone, anonymous can submit */}
            <div className="mb-3.5 sm:mb-6">
              <ReviewsSection listingId={listing.id} providerId={listing.user_id} />
            </div>

          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Portfolio" className="max-w-full max-h-[90vh] rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
};

export default ProviderDetail;
