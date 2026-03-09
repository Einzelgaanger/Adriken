import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";
import { SplineScene } from "@/components/ui/splite";
import { useAuth } from "@/contexts/AuthContext";

const suggestions = [
  "Looking for a 2-bedroom house to rent near me",
  "Need swimming lessons for kids this weekend",
  "Looking for an interior designer for my living room",
  "Find a private math tutor in Nairobi",
  "Need a plumber for urgent kitchen repairs",
  "Looking for a wedding photographer and videographer",
  "Need a chef to prepare meals for a family event",
  "Find a driving instructor near Westlands",
  "Looking for a trusted caregiver for my parent",
  "Need a house cleaner for weekly cleaning",
  "Looking for a secretary with admin and Excel skills",
  "Find a security guard for my shop",
  "Need guitar lessons for beginners",
  "Looking for a real estate agent to help me buy land",
  "Find a makeup artist for a graduation shoot",
  "Need an electrician for a power issue at home",
  "Looking for a social media manager for my business",
  "Need a pet sitter for 3 days",
  "Find a babysitter for evening hours",
  "Looking for someone to practice spoken English",
  "Need a trusted moving service for my house",
  "Looking for a gym trainer for weight loss",
  "Find a baker for birthday cupcakes",
  "Need help with CV writing and interview prep",
  "Looking for a friendly coffee chat this weekend",
  "Find a travel buddy for a short trip",
  "Need startup consulting for go-to-market",
  "Looking for French language classes near me",
  "Find an MC for a wedding reception",
  "Need a content creator for product shoots",
  "Looking for someone to go to a jazz date night and connect",
];

const SearchHero = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [showDesktopRobot, setShowDesktopRobot] = useState(false);
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
  const liveSearchExamples = suggestions.slice(0, 12);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % liveSearchExamples.length);
    }, 2200);

    return () => window.clearInterval(cycle);
  }, [liveSearchExamples.length]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const sync = () => setShowDesktopRobot(media.matches);
    sync();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", sync);
      return () => media.removeEventListener("change", sync);
    }

    media.addListener(sync);
    return () => media.removeListener(sync);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Orange warmth focused at center */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
      <BackgroundPathsLayer className="opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_62%_/_0.48)_0%,hsl(24_95%_68%_/_0.32)_26%,hsl(26_70%_90%_/_0.14)_52%,transparent_74%)] pointer-events-none" />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full bg-primary/[0.24] blur-[190px] pointer-events-none animate-hero-glow" />
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-orange-300/[0.3] blur-[145px] pointer-events-none animate-hero-glow" />
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-orange-400/[0.22] blur-[90px] pointer-events-none animate-hero-glow" />
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,hsl(12_76%_56%_/_0.06),transparent_38%,hsl(30_85%_58%_/_0.09)_72%,transparent)] pointer-events-none" />

      {/* Top running searches (below header) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="absolute top-16 sm:top-20 inset-x-0 px-2 sm:px-4 z-30"
      >
        <div className="marquee-row">
          <div className="marquee-track">
            {marqueeSuggestions.map((s, i) => (
              <button
                key={`top-${s}-${i}`}
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

      <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-14 pb-0 sm:pb-2 relative z-10">
        {showDesktopRobot && (
          <div className="absolute left-[-4%] top-[5%] h-[92%] w-[42%] z-20 pointer-events-none">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="absolute inset-[6%]"
            />
            <div className="absolute left-[34%] right-[24%] bottom-[-6%] h-1.5 rounded-full bg-black/95" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="max-w-3xl mx-auto xl:mr-0 xl:ml-auto text-center relative z-30 -mt-3 sm:-mt-2 xl:-mt-8"
        >
          <div className="hidden xl:block h-8 relative mb-3" />

          <div className="max-w-2xl mx-auto">
            <h1 className="neucha-regular mt-4 sm:mt-6 text-[clamp(2.85rem,8.8vw,4.6rem)] leading-[1.08] mb-3 sm:mb-4 text-foreground tracking-tight">
              Find services. <span className="text-gradient">Or offer yours.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed font-normal px-2 xl:px-0">
              Create an account, complete your profile details, and we will help show you to nearby clients for your services or goods, and even to people looking to connect as friends. You can also search for goods, service providers, or people near you.
            </p>

            {/* Dual CTA pills */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-row flex-wrap items-center justify-center gap-3 mb-5 sm:mb-6"
              >
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/10 shadow-soft w-auto max-w-full">
                  <div className="w-9 h-9 rounded-xl bg-primary/[0.1] flex items-center justify-center shrink-0">
                    <Users className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Looking for a service or goods?</p>
                    <p className="text-xs text-muted-foreground">Search below — no account needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-primary/10 shadow-soft w-auto max-w-full cursor-pointer hover:border-primary/30 hover:shadow-glow transition-all duration-200" onClick={() => navigate("/signup")}>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">Got a business or skill? Get found</p>
                    <p className="text-xs text-muted-foreground">Sign up and create your profile</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`relative max-w-2xl mx-auto rounded-2xl bg-card transition-all duration-300 ${
              focused ? "shadow-glow border-2 border-primary/25" : "shadow-card border-2 border-primary/[0.08]"
            }`}
          >
            <div className="flex flex-row items-start p-1.5 sm:p-1.5 gap-1.5 sm:gap-0">
              <div className="flex-1 flex items-start gap-2.5 p-2.5 sm:p-2.5 min-w-0">
                <Search className="w-5 h-5 text-primary/50 mt-0.5 shrink-0" aria-hidden />
                <div className="relative w-full">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSearch(); }
                    }}
                    placeholder=""
                    className="w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/40 text-base sm:text-base min-h-[32px] sm:min-h-[24px] max-h-[96px] font-body py-0 leading-relaxed"
                    rows={1}
                    aria-label="Search for businesses and services"
                  />
                  {!query.trim() && (
                    <div className="pointer-events-none absolute left-0 right-0 -top-0.5 sm:-top-1 text-left">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={liveSearchExamples[exampleIndex]}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 0.9, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.26 }}
                          className="inline-block text-[12px] sm:text-[13px] text-primary/65"
                        >
                          e.g. "{liveSearchExamples[exampleIndex]}"
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSearch}
                className="rounded-xl w-auto shrink-0 h-11 px-5 m-1"
                disabled={!query.trim()}
                aria-label="Search"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="px-4 sm:px-5 pb-2 flex items-center justify-center sm:justify-start gap-2 text-xs text-primary/40 font-medium">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              <span>Results prioritized by your location</span>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default SearchHero;
