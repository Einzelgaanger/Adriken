import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, MessageSquare, Eye } from "lucide-react";
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
    navigate("/");
  };

  const links = [
    { to: "/", label: "Find Help" },
    { to: "/become-provider", label: "Offer Services" },
    { to: "/how-it-works", label: "How It Works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-border/60 shadow-xs"
          : "bg-white/70 backdrop-blur-xl"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-xl sm:text-[22px] shrink-0 text-foreground tracking-tight">
          <img src={adrikenLogo} alt="Adriken" className="w-10 h-10 sm:w-11 sm:h-11" />
          <span>Adriken</span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">{link.label}</Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="soft" size="sm" className="rounded-xl">
                  <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-1" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-medium">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm" className="rounded-xl px-5">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden touch-target flex items-center justify-center rounded-xl text-foreground hover:bg-secondary active:bg-secondary/80 transition-colors -mr-1 w-11 h-11"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start h-12 text-base rounded-xl font-medium">{link.label}</Button>
                </Link>
              ))}
              <div className="border-t border-border pt-3 mt-2 flex flex-col gap-1.5">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="soft" className="w-full h-12 text-base rounded-xl">
                        <LayoutDashboard className="w-4 h-4 mr-1.5" /> Dashboard
                      </Button>
                    </Link>
                    <Link to="/messages" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start">
                        <MessageSquare className="w-4 h-4 mr-1.5" /> Messages
                      </Button>
                    </Link>
                    <Link to="/history" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start">
                        <Eye className="w-4 h-4 mr-1.5" /> Viewing History
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full h-12 text-base rounded-xl justify-start text-muted-foreground" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
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
