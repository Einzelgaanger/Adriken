import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center min-h-[85vh] px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Reset your password</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {sent ? "Check your inbox for a reset link." : "Enter your email and we'll send you a reset link."}
            </p>
          </div>
          {!sent ? (
            <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>
          ) : (
            <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-card">
              <p className="text-foreground font-medium mb-2">Email sent!</p>
              <p className="text-muted-foreground text-sm">If an account exists for {email}, you'll receive a password reset link shortly.</p>
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
