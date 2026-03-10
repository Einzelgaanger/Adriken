import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import adrikenLogo from "@/assets/adriken-logo.png";

// Capture hash at module load so we don't lose it when Supabase client consumes it before our effect runs
const getInitialRecoveryFromUrl = () => {
  if (typeof window === "undefined") return { hash: false, code: false };
  const h = window.location.hash;
  const q = new URLSearchParams(window.location.search);
  const hasHash =
    h.includes("type=recovery") || h.includes("access_token");
  const hasCode = !!q.get("code");
  return { hash: hasHash, code: hasCode };
};
const initialUrl = getInitialRecoveryFromUrl();

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(initialUrl.hash);
  const [checking, setChecking] = useState(!initialUrl.hash);
  const [hadCodeInUrl, setHadCodeInUrl] = useState(initialUrl.code);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasCode = !!searchParams.get("code");

    // Listen for PASSWORD_RECOVERY (fires after PKCE code exchange or when using hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setChecking(false);
      }
    });

    // Hash fragment (implicit flow) or type=recovery in query
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.replace("#", ""));
    const hasRecoveryToken =
      hash.includes("type=recovery") ||
      hashParams.get("type") === "recovery" ||
      searchParams.get("type") === "recovery" ||
      hash.includes("access_token");

    if (hasRecoveryToken) {
      setIsRecovery(true);
      setChecking(false);
    }
    if (hasCode) {
      setHadCodeInUrl(true);
      // detectSessionInUrl will exchange the code; we wait for PASSWORD_RECOVERY or timeout
    }

    const timeoutMs = hasCode ? 5000 : 2000;
    const timeout = setTimeout(() => setChecking(false), timeoutMs);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Once we think we're in recovery, confirm we have a session (or form submit will fail)
  useEffect(() => {
    if (!isRecovery || checking) return;
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setHasValidSession(!!user);
    });
    return () => { cancelled = true; };
  }, [isRecovery, checking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Failed to reset password", { description: error.message });
    } else {
      toast.success("Password updated!", { description: "You can now log in with your new password." });
      navigate("/login");
    }
  };

  if (checking) {
    return (
      <div className="relative min-h-screen bg-background overflow-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
        <BackgroundPathsLayer className="opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_62%_/_0.38)_0%,hsl(24_95%_68%_/_0.24)_28%,hsl(26_70%_90%_/_0.12)_52%,transparent_76%)] pointer-events-none" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.16] blur-[190px] pointer-events-none animate-hero-glow" />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="pt-24 sm:pt-28 flex items-center justify-center min-h-[70vh] relative z-10">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // No recovery flow, or recovery flow but no valid session (e.g. landed with empty #)
  if (!isRecovery || (hasValidSession === false)) {
    const hash = window.location.hash.replace("#", "").trim();
    const hasNoToken = !hash || (!hash.includes("access_token") && !hash.includes("type=recovery"));
    const sameBrowserHint = hadCodeInUrl;
    const noSessionHint = hasValidSession === false;
    return (
      <div className="relative min-h-screen bg-background overflow-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
        <BackgroundPathsLayer className="opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_62%_/_0.38)_0%,hsl(24_95%_68%_/_0.24)_28%,hsl(26_70%_90%_/_0.12)_52%,transparent_76%)] pointer-events-none" />
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.16] blur-[190px] pointer-events-none animate-hero-glow" />
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="pt-24 sm:pt-28 pb-16 flex items-center justify-center min-h-[70vh] px-4 sm:px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-6 sm:p-7 shadow-card">
              <div className="pointer-events-none absolute -top-14 -right-10 w-44 h-44 rounded-full bg-orange-300/25 blur-2xl" />
              <div className="pointer-events-none absolute top-20 -left-10 w-28 h-28 rounded-full bg-orange-400/20 blur-xl" />
              <div className="relative z-10 text-center">
                <img src={adrikenLogo} alt="Adriken" className="w-14 h-14 mx-auto mb-4" />
                <p className="electrolize-regular text-[1.45rem] font-black text-foreground leading-none mb-2">Adriken</p>
                <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                  {sameBrowserHint ? "Open link in the same browser" : (hasNoToken || noSessionHint) ? "Reset link didn’t open correctly" : "Invalid or expired link"}
                </h1>
                <p className="text-muted-foreground text-sm mb-6">
                  {sameBrowserHint
                    ? "This reset link must be opened in the same browser where you requested the password reset. Request a new link and open the email on that device."
                    : (hasNoToken || noSessionHint)
                      ? "The link from the email often loses its data when opened from some email apps. Request a new link, then open the email on your computer and click the link in Chrome or Safari—or copy the full link and paste it into the browser bar. Use the same browser where you requested the reset."
                      : "This password reset link is no longer valid or has expired."}
                </p>
                <Button variant="hero" className="rounded-xl h-12 min-h-[44px] touch-manipulation" onClick={() => navigate("/forgot-password")}>
                  Request a new link
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
      <BackgroundPathsLayer className="opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_62%_/_0.38)_0%,hsl(24_95%_68%_/_0.24)_28%,hsl(26_70%_90%_/_0.12)_52%,transparent_76%)] pointer-events-none" />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.16] blur-[190px] pointer-events-none animate-hero-glow" />
      <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 flex items-center justify-center min-h-[88vh] px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px] mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-6 sm:p-7 shadow-card">
            <div className="pointer-events-none absolute -top-14 -right-10 w-44 h-44 rounded-full bg-orange-300/25 blur-2xl" />
            <div className="pointer-events-none absolute top-20 -left-10 w-28 h-28 rounded-full bg-orange-400/20 blur-xl" />
            <div className="pointer-events-none absolute -bottom-10 right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-2xl" />
            <div className="relative z-10 text-center mb-6">
              <img src={adrikenLogo} alt="Adriken" className="w-14 h-14 mx-auto mb-4" />
              <p className="electrolize-regular text-[1.45rem] font-black text-foreground leading-none mb-2">Adriken</p>
              <h1 className="font-display text-2xl sm:text-[28px] font-extrabold text-foreground tracking-tight mb-1.5">Set new password</h1>
              <p className="text-muted-foreground text-sm">Enter your new password below.</p>
            </div>
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-foreground/80 font-medium text-sm">New Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                  <Input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="pl-10 pr-12 h-12 sm:h-11 rounded-xl border-border/60 bg-background focus:border-primary/30" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground/80 font-medium text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                  <Input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="pl-10 h-12 sm:h-11 rounded-xl border-border/60 bg-background focus:border-primary/30" required minLength={6} />
                </div>
              </div>
              <Button variant="hero" className="w-full h-12 rounded-xl text-base font-bold touch-manipulation" type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
