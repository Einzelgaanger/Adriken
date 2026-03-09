import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  MapPin,
  ArrowRight,
  Users,
  Briefcase,
  ChefHat,
  GraduationCap,
  Camera,
  ShieldCheck,
  Plane,
  Handshake,
  Music2,
  BriefcaseBusiness,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const suggestions = [
  "Need a private chef for weekend events",
  "Looking for a math tutor for high school",
  "Find a wedding photographer in Nairobi",
  "I need a night security guard for my business",
  "Looking for an admin secretary for my office",
  "Need a tax consultant for my startup",
  "Find a DJ for a birthday party",
  "Need a travel buddy for Jamaica in July",
  "Looking for a gym accountability partner",
  "Need a business mentor for e-commerce",
  "Find a videographer for product shoots",
  "Looking for a caregiver for my parent",
  "Need a cleaner for weekly apartment cleaning",
  "Find a driver for airport pickups",
  "Looking for a guitar teacher near me",
  "Need an events MC for a wedding",
  "Find a co-founder to build a fintech MVP",
  "Looking for a French language tutor",
  "Need an electrician for urgent repair",
  "Find a content creator for my brand",
  "Looking for a friendly coffee chat this weekend",
  "Need a startup consultant for go-to-market",
  "Find a pet sitter for 3 days",
  "Looking for a secretary with Excel skills",
  "Need a study partner for CFA prep",
  "Find a plumber in Westlands",
  "Looking for a social media manager",
  "Need a makeup artist for a graduation shoot",
  "Find a sports coach for teenage football",
  "Looking for someone to practice spoken English",
];

const laptopIdeaCards = [
  {
    title: "Chef Booking",
    subtitle: "\"Need a private chef for 20 guests this Saturday in Nairobi\"",
    query: "Need a private chef for home events",
    icon: ChefHat,
    className: "from-orange-100 via-amber-50 to-rose-100 border-orange-200/70",
    iconWrap: "bg-orange-500/15 text-orange-700",
    frameClass: "border-2 border-orange-300/70 shadow-[0_14px_30px_-16px_rgba(234,88,12,0.55)] before:absolute before:inset-x-3 before:top-2 before:h-[1px] before:bg-orange-300/70 before:content-['']",
    accentClass: "from-orange-500/70 to-amber-400/70",
    badge: "Chef",
    tiltClass: "-rotate-[7deg]",
    shapeClass: "rounded-[32px_20px_14px_28px]",
    floatDelay: 0,
  },
  {
    title: "Tutor Search",
    subtitle: "\"Looking for a math tutor for Grade 11 exam prep, 3 times a week\"",
    query: "Looking for a math tutor for high school",
    icon: GraduationCap,
    className: "from-blue-100 via-sky-50 to-cyan-100 border-blue-200/70",
    iconWrap: "bg-blue-500/15 text-blue-700",
    frameClass: "border-2 border-dashed border-blue-300/80 shadow-[0_12px_28px_-16px_rgba(37,99,235,0.45)]",
    accentClass: "from-blue-500/70 to-cyan-400/70",
    badge: "Tutor",
    tiltClass: "rotate-[6deg]",
    shapeClass: "rounded-[16px_36px_18px_36px]",
    floatDelay: 0.4,
  },
  {
    title: "Event Media",
    subtitle: "\"Find a photographer and videographer for my engagement party\"",
    query: "Find a wedding photographer in Nairobi",
    icon: Camera,
    className: "from-fuchsia-100 via-pink-50 to-rose-100 border-fuchsia-200/70",
    iconWrap: "bg-pink-500/15 text-pink-700",
    frameClass: "border-[1.5px] border-fuchsia-300/80 shadow-[0_14px_32px_-18px_rgba(217,70,239,0.52)] after:absolute after:-top-4 after:-right-4 after:w-14 after:h-14 after:rounded-full after:bg-fuchsia-300/30 after:content-['']",
    accentClass: "from-fuchsia-500/70 to-rose-400/70",
    badge: "Media",
    tiltClass: "-rotate-[8deg]",
    shapeClass: "rounded-[28px_14px_34px_12px]",
    floatDelay: 0.8,
  },
  {
    title: "Business Safety",
    subtitle: "\"I need a night security guard for my mini market from 7pm to 6am\"",
    query: "I need a night security guard for my business",
    icon: ShieldCheck,
    className: "from-emerald-100 via-teal-50 to-green-100 border-emerald-200/70",
    iconWrap: "bg-emerald-500/15 text-emerald-700",
    frameClass: "border-2 border-emerald-300/75 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.55)]",
    accentClass: "from-emerald-500/70 to-teal-400/70",
    badge: "Security",
    tiltClass: "rotate-[7deg]",
    shapeClass: "rounded-[20px] border-dashed",
    floatDelay: 1.2,
  },
  {
    title: "Travel Buddy",
    subtitle: "\"Need a travel buddy for Jamaica in July, beach + food vibes\"",
    query: "Need a travel buddy for Jamaica in July",
    icon: Plane,
    className: "from-violet-100 via-purple-50 to-indigo-100 border-violet-200/70",
    iconWrap: "bg-violet-500/15 text-violet-700",
    frameClass: "border-2 border-violet-300/75 shadow-[0_12px_32px_-18px_rgba(124,58,237,0.52)]",
    accentClass: "from-violet-500/70 to-indigo-400/70",
    badge: "Travel",
    tiltClass: "-rotate-[6deg]",
    shapeClass: "rounded-[38px_18px_28px_14px]",
    floatDelay: 0.2,
  },
  {
    title: "Social Match",
    subtitle: "\"Looking for a friendly coffee chat and networking meetup partner\"",
    query: "Looking for a friendly coffee chat this weekend",
    icon: Handshake,
    className: "from-lime-100 via-green-50 to-emerald-100 border-lime-200/70",
    iconWrap: "bg-lime-500/15 text-lime-700",
    frameClass: "border-[1.5px] border-lime-300/80 shadow-[0_12px_28px_-18px_rgba(101,163,13,0.55)] before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:bg-lime-400/55 before:content-['']",
    accentClass: "from-lime-500/70 to-emerald-400/70",
    badge: "Social",
    tiltClass: "rotate-[7deg]",
    shapeClass: "rounded-[34px]",
    floatDelay: 0.6,
  },
  {
    title: "Party Vibes",
    subtitle: "\"Find a DJ and MC for my birthday party next weekend\"",
    query: "Find a DJ and MC for a birthday party",
    icon: Music2,
    className: "from-rose-100 via-pink-50 to-fuchsia-100 border-rose-200/70",
    iconWrap: "bg-rose-500/15 text-rose-700",
    frameClass: "border-2 border-double border-rose-300/80 shadow-[0_14px_30px_-18px_rgba(244,63,94,0.52)]",
    accentClass: "from-rose-500/70 to-pink-400/70",
    badge: "Events",
    tiltClass: "-rotate-[8deg]",
    shapeClass: "rounded-[14px_30px_30px_14px]",
    floatDelay: 1,
  },
  {
    title: "Career Growth",
    subtitle: "\"Find a startup mentor for product and go-to-market guidance\"",
    query: "Find a business mentor for my startup",
    icon: BriefcaseBusiness,
    className: "from-yellow-100 via-amber-50 to-orange-100 border-yellow-200/70",
    iconWrap: "bg-amber-500/15 text-amber-700",
    frameClass: "border-[1.5px] border-yellow-300/80 shadow-[0_12px_30px_-18px_rgba(245,158,11,0.5)]",
    accentClass: "from-amber-500/70 to-orange-400/70",
    badge: "Mentor",
    tiltClass: "rotate-[6deg]",
    shapeClass: "rounded-[18px] border-[1.5px]",
    floatDelay: 1.4,
  },
  {
    title: "Office Support",
    subtitle: "\"Looking for an office secretary with Excel and scheduling skills\"",
    query: "Looking for an admin secretary for my office",
    icon: Briefcase,
    className: "from-cyan-100 via-sky-50 to-blue-100 border-cyan-200/70",
    iconWrap: "bg-cyan-500/15 text-cyan-700",
    frameClass: "border-[1.5px] border-cyan-300/85 shadow-[0_12px_30px_-18px_rgba(6,182,212,0.52)]",
    accentClass: "from-cyan-500/70 to-blue-400/70",
    badge: "Office",
    tiltClass: "-rotate-[6deg]",
    shapeClass: "rounded-[30px_12px_30px_12px]",
    floatDelay: 1.8,
  },
  {
    title: "Royal Match",
    subtitle: "\"Looking for someone to go to a jazz date night and connect\"",
    query: "Looking for someone to go to a jazz date night",
    icon: Star,
    className: "from-indigo-100 via-violet-50 to-purple-100 border-indigo-200/70",
    iconWrap: "bg-indigo-500/15 text-indigo-700",
    frameClass: "border-[2px] border-indigo-300/80 shadow-[0_12px_30px_-18px_rgba(79,70,229,0.52)]",
    accentClass: "from-indigo-500/70 to-purple-400/70",
    badge: "Date",
    tiltClass: "rotate-[7deg]",
    shapeClass: "rounded-[16px_16px_34px_34px]",
    floatDelay: 2,
  },
];

const SearchHero = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = () => {
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    navigate(`/results?q=${encodeURIComponent(s)}`);
  };

  const marqueeSuggestions = [...suggestions, ...suggestions];
  const marqueeSuggestionsAlt = [...suggestions.slice(8), ...suggestions.slice(0, 8), ...suggestions.slice(8), ...suggestions.slice(0, 8)];

  return (
    <section className="relative min-h-[92dvh] sm:min-h-[94vh] flex items-center justify-center overflow-hidden">
      {/* Orange warmth focused at center */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_65%_/_0.28)_0%,hsl(24_95%_70%_/_0.18)_26%,hsl(26_70%_92%_/_0.08)_48%,transparent_72%)] pointer-events-none" />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-primary/[0.11] blur-[140px] pointer-events-none" />
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-orange-300/[0.14] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 relative z-10">
        {/* Laptop-only discovery cards around hero */}
        <div className="hidden xl:block pointer-events-none">
          <div className="absolute left-[-8px] 2xl:left-[-28px] top-24 w-[285px] space-y-3">
            {laptopIdeaCards.slice(0, 5).map((card, i) => (
              <motion.button
                key={card.title}
                type="button"
                initial={{ opacity: 0, x: -20, y: 8 }}
                animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                onClick={() => handleSuggestion(card.query)}
                className={`pointer-events-auto ${i % 2 === 0 ? "w-[94%]" : "w-full ml-2"} text-left border px-4 py-3.5 bg-gradient-to-br ${card.className} ${card.frameClass} ${card.shapeClass} ${card.tiltClass} hover:rotate-0 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden relative`}
                style={{ animationDelay: `${card.floatDelay}s` }}
              >
                <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${card.accentClass} mb-3`} />
                <div className="flex items-start gap-3">
                  <span className={`w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0 ${card.iconWrap}`}>
                    <card.icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-bold text-primary/80 flex items-center gap-2">
                      <span>{card.title}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-white/60 border border-white/80 text-[10px] font-semibold text-foreground/70">{card.badge}</span>
                    </p>
                    <p className="text-xs text-foreground/90 mt-1.5 leading-relaxed font-medium">{card.subtitle}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="absolute right-[-8px] 2xl:right-[-28px] top-24 w-[285px] space-y-3">
            {laptopIdeaCards.slice(5).map((card, i) => (
              <motion.button
                key={card.title}
                type="button"
                initial={{ opacity: 0, x: 20, y: 8 }}
                animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                onClick={() => handleSuggestion(card.query)}
                className={`pointer-events-auto ${i % 2 === 0 ? "w-full mr-0" : "w-[94%] mr-2"} text-left border px-4 py-3.5 bg-gradient-to-br ${card.className} ${card.frameClass} ${card.shapeClass} ${card.tiltClass} hover:rotate-0 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden relative`}
                style={{ animationDelay: `${card.floatDelay}s` }}
              >
                <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${card.accentClass} mb-3`} />
                <div className="flex items-start gap-3">
                  <span className={`w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0 ${card.iconWrap}`}>
                    <card.icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide font-bold text-primary/80 flex items-center gap-2">
                      <span>{card.title}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-white/60 border border-white/80 text-[10px] font-semibold text-foreground/70">{card.badge}</span>
                    </p>
                    <p className="text-xs text-foreground/90 mt-1.5 leading-relaxed font-medium">{card.subtitle}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center relative"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.1] text-primary mb-6 sm:mb-8 font-semibold text-[13px] border border-primary/15 shadow-xs font-accent tracking-[0.02em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Matching · Find or Offer Services
          </motion.div>

          <h1 className="font-display text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] mb-4 sm:mb-5 text-foreground tracking-tight">
            Find services. <span className="text-gradient">Or offer yours.</span>
          </h1>

          <p className="text-[15px] sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-normal px-2">
            From blue-collar jobs to specialist consultants - search for chefs, tutors, photographers, security guards, secretaries, and more.
          </p>

          {/* Dual CTA pills */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 sm:mb-10"
            >
              <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/10 shadow-soft w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-primary/[0.1] flex items-center justify-center shrink-0">
                  <Users className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Looking for a service?</p>
                  <p className="text-xs text-muted-foreground">Search below — no account needed</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/10 shadow-soft w-full sm:w-auto cursor-pointer hover:border-primary/30 hover:shadow-glow transition-all duration-200" onClick={() => navigate("/signup")}>
                <div className="w-9 h-9 rounded-xl bg-primary/[0.1] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Got a business? Get found</p>
                  <p className="text-xs text-muted-foreground">Sign up and create your profile</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`relative max-w-2xl mx-auto rounded-2xl bg-card transition-all duration-300 ${
              focused ? "shadow-glow border-2 border-primary/25" : "shadow-card border-2 border-primary/[0.08]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start p-2.5 sm:p-2 gap-2.5 sm:gap-0">
              <div className="flex-1 flex items-start gap-3 p-2 sm:p-3 min-w-0">
                <Search className="w-5 h-5 text-primary/50 mt-0.5 shrink-0 hidden sm:block" aria-hidden />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSearch(); }
                  }}
                  placeholder="Search for a business or service... e.g. 'security guard in Nairobi' or 'best math tutor near me'"
                  className="w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-[15px] sm:text-base min-h-[48px] sm:min-h-[28px] max-h-[120px] font-body py-1.5 sm:py-0 leading-relaxed"
                  rows={2}
                  aria-label="Search for businesses and services"
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSearch}
                className="rounded-xl w-full sm:w-auto sm:shrink-0 h-12 sm:h-11 px-7 sm:m-1"
                disabled={!query.trim()}
                aria-label="Search"
              >
                <span className="sm:hidden font-semibold">Search</span>
                <ArrowRight className="w-5 h-5 hidden sm:block" />
              </Button>
            </div>

            <div className="px-4 sm:px-5 pb-3 flex items-center justify-center sm:justify-start gap-2 text-xs text-primary/40 font-medium">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              <span>Results prioritized by your location</span>
            </div>
          </motion.div>

          {/* Animated search examples */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 sm:mt-8"
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-medium font-accent tracking-[0.015em]">Popular searches</p>
            <div className="marquee-row">
              <div className="marquee-track">
                {marqueeSuggestions.map((s, i) => (
                  <button
                    key={`${s}-${i}`}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-full bg-card/85 border border-primary/[0.1] text-[12px] sm:text-[13px] text-muted-foreground hover:border-primary/25 hover:text-primary hover:bg-primary/[0.04] hover:shadow-soft active:scale-[0.98] transition-all duration-200 min-h-[44px] sm:min-h-0 inline-flex items-center touch-manipulation whitespace-nowrap shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="marquee-row mt-2.5">
              <div className="marquee-track marquee-track-reverse">
                {marqueeSuggestionsAlt.map((s, i) => (
                  <button
                    key={`${s}-alt-${i}`}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-full bg-card/85 border border-primary/[0.1] text-[12px] sm:text-[13px] text-muted-foreground hover:border-primary/25 hover:text-primary hover:bg-primary/[0.04] hover:shadow-soft active:scale-[0.98] transition-all duration-200 min-h-[44px] sm:min-h-0 inline-flex items-center touch-manipulation whitespace-nowrap shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchHero;
