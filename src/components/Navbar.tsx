import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Clock, Search, MapPin, KeyRound, Rocket } from "lucide-react";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const isHomepageGuest = !user && isHomepage;
  const isAuthPage = ["/login", "/signup", "/check-email", "/forgot-password", "/reset-password"].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu backdrop: blur rest of screen and close on tap */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-black/25 backdrop-blur-md touch-none cursor-default"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        )}
      </AnimatePresence>

      <nav
      ref={ref}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ${
        scrolled
          ? "bg-white/95 backdrop-blur-2xl border-b border-primary/[0.06] shadow-xs"
          : "bg-white/90 backdrop-blur-xl"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-6">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 font-extrabold text-xl sm:text-[22px] shrink-0 text-foreground tracking-tight">
          <img src={adrikenLogo} alt="Adriken" className="w-9 h-9 sm:w-10 sm:h-10" />
          <span className="electrolize-regular text-[1.5rem] sm:text-[1.75rem] font-black leading-none">Adriken</span>
        </Link>

        {user && (
          <div className="hidden md:flex items-center gap-0.5">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium inline-flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 shrink-0" /> Search for goods, services or people
              </Button>
            </Link>
            <Link to="/nearby">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" /> Nearby goods, services and people
              </Button>
            </Link>
          </div>
        )}

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <>
                <Link to="/profile/edit">
                  <Button variant="soft" size="sm" className="rounded-xl inline-flex items-center gap-1.5">
                    <User className="w-4 h-4 shrink-0" /> Who I am & what I offer
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 shrink-0" /> History
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5">
                  <LogOut className="w-4 h-4 shrink-0" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium inline-flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 shrink-0" /> Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="sm" className="rounded-xl px-5 inline-flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 shrink-0" /> Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger — hidden on auth pages */}
        {!isAuthPage && (
        <div className="md:hidden">
          <motion.button
            type="button"
            className="touch-target flex items-center justify-center rounded-xl border border-border/80 bg-white/85 text-foreground shadow-xs hover:shadow-soft hover:border-primary/25 active:scale-[0.97] transition-all w-11 h-11"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <span className="relative w-[18px] h-[14px] block">
              <motion.span
                className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-foreground"
                animate={mobileOpen ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-foreground"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-[12px] h-[2px] w-full rounded-full bg-foreground"
                animate={mobileOpen ? { top: 6, rotate: -45 } : { top: 12, rotate: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
            </span>
          </motion.button>
        </div>
        )}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-b border-border"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="px-4 py-4 pb-6 flex flex-col gap-1">
              {!isHomepageGuest && (
                <>
                  <Link to={user ? "/dashboard" : "/"} onClick={() => setMobileOpen(false)} className="block">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium hover:text-primary gap-2">
                      <Search className="w-4 h-4 shrink-0" /> Search for goods, services or people
                    </Button>
                  </Link>
                  <Link to="/nearby" onClick={() => setMobileOpen(false)} className="block">
                    <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium hover:text-primary gap-2">
                      <MapPin className="w-4 h-4 shrink-0" /> Nearby goods, services and people
                    </Button>
                  </Link>
                </>
              )}
              <div className={`flex flex-col gap-1.5 ${!isHomepageGuest ? "border-t border-border pt-3 mt-2" : ""}`}>
                {user ? (
                  <>
                    <Link to="/profile/edit" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="soft" className="w-full h-12 text-base rounded-xl justify-start gap-2">
                        <User className="w-4 h-4 shrink-0" /> Who I am & what I offer
                      </Button>
                    </Link>
                    <Link to="/history" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start hover:text-primary gap-2">
                        <Clock className="w-4 h-4 shrink-0" /> History
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start text-muted-foreground hover:text-destructive gap-2" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut className="w-4 h-4 shrink-0" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl font-medium justify-start gap-2">
                        <KeyRound className="w-4 h-4 shrink-0" /> Log in
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="hero" className="w-full h-12 text-base rounded-xl justify-start gap-2">
                        <Rocket className="w-4 h-4 shrink-0" /> Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
