import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import adrikenLogo from "@/assets/adriken-logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send reset email", { description: error.message });
    } else {
      setSent(true);
      toast.success("Check your email", { description: "We sent you a password reset link." });
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
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center min-h-[85vh] px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
          {!sent ? (
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card">
              <div className="pointer-events-none absolute -top-14 -right-10 w-44 h-44 rounded-full bg-orange-300/25 blur-2xl" />
              <div className="pointer-events-none absolute top-20 -left-10 w-28 h-28 rounded-full bg-orange-400/20 blur-xl" />
              <div className="pointer-events-none absolute -bottom-10 right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-2xl" />
              <div className="relative z-10 text-center mb-6">
                <img src={adrikenLogo} alt="Adriken" className="w-14 h-14 mx-auto mb-4" />
                <p className="electrolize-regular text-[1.45rem] font-black text-foreground leading-none mb-2">Adriken</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Reset your password</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Enter your email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 h-12 sm:h-10 rounded-xl" required />
                  </div>
                </div>
                <Button variant="hero" className="w-full h-12 rounded-xl text-base font-semibold touch-manipulation" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="relative z-10 mt-5 pt-4 border-t border-border/50 space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to login
                  </Link>
                </p>
                <Link to="/dashboard" className="block">
                  <Button variant="soft" className="w-full h-11 rounded-xl">
                    <Home className="w-4 h-4 mr-1.5" /> Home
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 text-center shadow-card">
              <div className="pointer-events-none absolute -top-14 -right-10 w-44 h-44 rounded-full bg-orange-300/25 blur-2xl" />
              <div className="pointer-events-none absolute top-20 -left-10 w-28 h-28 rounded-full bg-orange-400/20 blur-xl" />
              <div className="pointer-events-none absolute -bottom-10 right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-2xl" />
              <div className="relative z-10">
                <img src={adrikenLogo} alt="Adriken" className="w-14 h-14 mx-auto mb-4" />
                <p className="electrolize-regular text-[1.45rem] font-black text-foreground leading-none mb-3">Adriken</p>
                <p className="text-foreground font-medium mb-2">Email sent!</p>
                <p className="text-muted-foreground text-sm">If an account exists for {email}, you'll receive a password reset link shortly.</p>
              </div>
              <div className="relative z-10 mt-5 pt-4 border-t border-border/50 space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to login
                  </Link>
                </p>
                <Link to="/dashboard" className="block">
                  <Button variant="soft" className="w-full h-11 rounded-xl">
                    <Home className="w-4 h-4 mr-1.5" /> Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
