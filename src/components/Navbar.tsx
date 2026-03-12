import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Clock, Search, MapPin, KeyRound, Rocket } from "lucide-react";
import adrikenLogo from "@/assets/adriken-logo.png";
import { useState, useEffect, forwardRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isAuthPage = ["/login", "/signup", "/check-email", "/forgot-password", "/reset-password"].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    queryClient.removeQueries({ queryKey: ["profile-onboarding"] });
    queryClient.removeQueries({ queryKey: ["profile"] });
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <>
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {user ? (
              <>
                <Link to="/profile/edit">
                  <Button variant="soft" size="sm" className="rounded-xl inline-flex items-center gap-1.5 text-xs sm:text-sm">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="hidden sm:inline">Who I am & what I offer</span>
                  </Button>
                </Link>
                <Link to="/history" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 shrink-0" /> History
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5 p-2 sm:px-3" aria-label="Sign out">
                  <LogOut className="w-4 h-4 shrink-0" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-medium inline-flex items-center gap-1.5 text-xs sm:text-sm rounded-xl">
                    <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="sm" className="rounded-xl px-3 sm:px-5 inline-flex items-center gap-1.5 text-xs sm:text-sm">
                    <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
    </>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
