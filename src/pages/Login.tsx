import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import adrikenLogo from "@/assets/adriken-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast.error("Login failed", { description: error.message });
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

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
              <h1 className="font-display text-2xl sm:text-[28px] font-extrabold text-foreground tracking-tight mb-1.5">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Log in to your Adriken account</p>
            </div>
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground/80 font-medium text-sm">Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 h-12 sm:h-11 rounded-xl border-border/60 bg-background focus:border-primary/30" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground/80 font-medium text-sm">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
                  <Input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-10 pr-12 h-12 sm:h-11 rounded-xl border-border/60 bg-background focus:border-primary/30" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center touch-manipulation" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button variant="hero" className="w-full h-12 rounded-xl text-base font-bold touch-manipulation" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="relative z-10 my-5">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground/60 font-medium">or continue with</span></div>
            </div>

            <Button
              variant="outline"
              className="relative z-10 w-full h-12 rounded-xl text-sm font-semibold touch-manipulation"
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: `${window.location.origin}/` },
                });
                if (error) toast.error("Google sign-in failed", { description: (error as Error).message });
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>

            <div className="text-center mt-5">
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Forgot your password?
              </Link>
            </div>

            <div className="relative z-10 mt-5 pt-4 border-t border-border/50 space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
              </p>
              <Link to="/" className="block">
                <Button variant="soft" className="w-full h-11 rounded-xl">
                  <Home className="w-4 h-4 mr-1.5" /> Home
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
