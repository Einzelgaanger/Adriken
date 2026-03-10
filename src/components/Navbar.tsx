import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Clock } from "lucide-react";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
    navigate("/dashboard");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ${
        scrolled
          ? "bg-white/95 backdrop-blur-2xl border-b border-primary/[0.06] shadow-xs"
          : "bg-white/90 backdrop-blur-xl"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl sm:text-[22px] shrink-0 text-foreground tracking-tight">
          <img src={adrikenLogo} alt="Adriken" className="w-9 h-9 sm:w-10 sm:h-10" />
          <span className="electrolize-regular text-[1.5rem] sm:text-[1.75rem] font-black leading-none">Adriken</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium">Find Services</Button>
          </Link>
          <Link to="/nearby">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium">See businesses and people near you</Button>
          </Link>
          <Link to={user ? "/profile/edit" : "/signup"}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium">Offer Services</Button>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <>
              <Link to="/profile/edit">
                <Button variant="soft" size="sm" className="rounded-xl">
                  <User className="w-4 h-4 mr-1.5" /> My Profile
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Clock className="w-4 h-4 mr-1" /> History
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4 mr-1" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm" className="rounded-xl px-5">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
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
              <Link to="/" onClick={() => setMobileOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium hover:text-primary">Find Services</Button>
              </Link>
              <Link to={user ? "/profile/edit" : "/signup"} onClick={() => setMobileOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium hover:text-primary">Offer Services</Button>
              </Link>
              <Link to="/nearby" onClick={() => setMobileOpen(false)} className="block">
                <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium hover:text-primary">See businesses and people near you</Button>
              </Link>
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-1.5">
                {user ? (
                  <>
                    <Link to="/profile/edit" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="soft" className="w-full h-12 text-base rounded-xl">
                        <User className="w-4 h-4 mr-1.5" /> My Profile
                      </Button>
                    </Link>
                    <Link to="/history" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start hover:text-primary">
                        <Clock className="w-4 h-4 mr-1.5" /> Businesses I Checked
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start text-muted-foreground hover:text-destructive" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-1.5" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl font-medium">Log in</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="hero" className="w-full h-12 text-base rounded-xl">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
