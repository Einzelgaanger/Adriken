import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "I need a nanny for my 2 kids on weekdays",
  "Looking for a house cleaner near me",
  "Need a personal chef for a dinner party",
  "Find me a reliable plumber ASAP",
  "I want a yoga instructor for home sessions",
  "Need a consultant for my startup",
];

const SearchHero = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    navigate(`/results?q=${encodeURIComponent(s)}`);
  };

  return (
    <section className="relative min-h-[85dvh] sm:min-h-[90vh] flex items-center justify-center bg-gradient-hero overflow-hidden py-12 sm:py-16">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-primary/10 text-primary mb-6 sm:mb-8 font-medium text-xs sm:text-sm"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            AI-Powered Service Matching
          </motion.div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-foreground px-1">
            Just say what you need.{" "}
            <span className="text-gradient">We'll find who.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-1">
            No filters. No categories. Just tell us what you're looking for in your own words — our AI matches you with the perfect person nearby.
          </p>

          {/* Search box - stacked on small screens for better mobile UX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative max-w-2xl mx-auto rounded-2xl bg-card border-2 transition-all duration-300 ${
              focused ? "border-primary shadow-elevated" : "border-border shadow-card"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start p-3 sm:p-2 gap-3 sm:gap-0">
              <div className="flex-1 flex items-start gap-3 p-2 sm:p-3 min-w-0">
                <Search className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0 hidden sm:block" aria-hidden />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Tell us what you need... e.g. 'I need a nanny for 2 kids on weekdays'"
                  className="w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground text-base min-h-[44px] sm:min-h-[24px] max-h-[120px] font-body py-2 sm:py-0"
                  rows={2}
                  aria-label="Describe what you need"
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSearch}
                className="rounded-xl w-full sm:w-auto sm:shrink-0 h-12 sm:h-11 px-6 sm:m-1"
                disabled={!query.trim()}
                aria-label="Search for providers"
              >
                <ArrowRight className="w-5 h-5 sm:mr-0" />
                <span className="sm:sr-only">Search</span>
              </Button>
            </div>

            <div className="px-4 sm:px-5 pb-3 flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden />
              <span>Results prioritized by your location</span>
            </div>
          </motion.div>

          {/* Suggestions - larger tap targets on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-2"
          >
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="px-4 py-3 sm:py-2 rounded-full bg-card border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary active:bg-primary/5 transition-colors duration-200 shadow-soft min-h-[44px] sm:min-h-0 inline-flex items-center justify-center text-left"
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
