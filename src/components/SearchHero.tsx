import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, MapPin, ArrowRight, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "I need a nanny for my 2 kids on weekdays",
  "Looking for a house cleaner near me",
  "Find me a reliable plumber ASAP",
  "I want a yoga instructor at home",
];

const SearchHero = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    navigate(`/results?q=${encodeURIComponent(s)}`);
  };

  return (
    <section className="relative min-h-[92dvh] sm:min-h-[94vh] flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16 sm:pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/[0.07] text-primary mb-6 sm:mb-8 font-medium text-[13px] border border-primary/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Matching · Two-Sided Marketplace
          </motion.div>

          <h1 className="font-display text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.08] mb-4 sm:mb-5 text-foreground tracking-tight">
            Find help. <span className="text-gradient">Or offer it.</span>
          </h1>

          <p className="text-[15px] sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed font-normal px-2">
            Describe what you need and our AI matches you instantly. Or list your skills and let customers find you.
          </p>

          {/* Dual CTA pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 sm:mb-10"
          >
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-border/60 shadow-soft w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-primary/[0.08] flex items-center justify-center shrink-0">
                <Users className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Looking for help?</p>
                <p className="text-xs text-muted-foreground">Search below — AI finds the best match</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-border/60 shadow-soft w-full sm:w-auto cursor-pointer hover:border-primary/20 transition-colors" onClick={() => navigate("/become-provider")}>
              <div className="w-9 h-9 rounded-xl bg-accent/[0.08] flex items-center justify-center shrink-0">
                <Briefcase className="w-4.5 h-4.5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">Got skills? Earn money</p>
                <p className="text-xs text-muted-foreground">List your services — customers come to you</p>
              </div>
            </div>
          </motion.div>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`relative max-w-2xl mx-auto rounded-2xl bg-card transition-all duration-300 ${
              focused ? "shadow-glow border-2 border-primary/20" : "shadow-card border-2 border-transparent"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start p-2.5 sm:p-2 gap-2.5 sm:gap-0">
              <div className="flex-1 flex items-start gap-3 p-2 sm:p-3 min-w-0">
                <Search className="w-5 h-5 text-muted-foreground/60 mt-0.5 shrink-0 hidden sm:block" aria-hidden />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSearch(); }
                  }}
                  placeholder="Describe what you need... e.g. 'I need a nanny for 2 kids on weekdays'"
                  className="w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-[15px] sm:text-base min-h-[48px] sm:min-h-[28px] max-h-[120px] font-body py-1.5 sm:py-0 leading-relaxed"
                  rows={2}
                  aria-label="Describe what you need"
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSearch}
                className="rounded-xl w-full sm:w-auto sm:shrink-0 h-12 sm:h-11 px-7 sm:m-1"
                disabled={!query.trim()}
                aria-label="Search for providers"
              >
                <span className="sm:hidden font-semibold">Search</span>
                <ArrowRight className="w-5 h-5 hidden sm:block" />
              </Button>
            </div>

            <div className="px-4 sm:px-5 pb-3 flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground/60">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              <span>Results prioritized by your location</span>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-5 sm:mt-7 flex flex-wrap justify-center gap-2 px-2"
          >
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-full bg-card/80 border border-border/60 text-[12px] sm:text-[13px] text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-soft active:scale-[0.98] transition-all duration-200 min-h-[44px] sm:min-h-0 inline-flex items-center touch-manipulation"
              >
                {s}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchHero;
