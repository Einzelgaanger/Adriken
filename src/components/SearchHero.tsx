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
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Service Matching
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
            Just say what you need.{" "}
            <span className="text-gradient">We'll find who.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            No filters. No categories. Just tell us what you're looking for in your own words — our AI matches you with the perfect person nearby.
          </p>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative max-w-2xl mx-auto rounded-2xl bg-card border-2 transition-all duration-300 ${
              focused ? "border-primary shadow-elevated" : "border-border shadow-card"
            }`}
          >
            <div className="flex items-start p-2">
              <div className="flex-1 flex items-start gap-3 p-3">
                <Search className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
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
                  className="w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground text-base min-h-[24px] max-h-[120px] font-body"
                  rows={1}
                />
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleSearch}
                className="rounded-xl shrink-0 m-1"
                disabled={!query.trim()}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="px-5 pb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>Results prioritized by your location</span>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-2"
          >
            {suggestions.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200 shadow-soft"
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
