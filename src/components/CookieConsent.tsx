import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "adriken_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (value: "all" | "essential") => {
    localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-2xl">
            <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-elevated">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium mb-1">🍪 Cookie Notice</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use essential cookies for authentication and security. Optional analytics cookies help us improve the platform.{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Learn more</Link>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none rounded-xl" onClick={() => accept("essential")}>
                    Essential Only
                  </Button>
                  <Button size="sm" variant="hero" className="flex-1 sm:flex-none rounded-xl" onClick={() => accept("all")}>
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
