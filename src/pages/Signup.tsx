import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      toast.error("Please fill in all fields (password must be at least 6 characters)");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (error) {
      toast.error("Signup failed", { description: error.message });
    } else {
      toast.success("Account created!", { description: "Check your email to confirm, then log in." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 flex items-center justify-center min-h-[85vh] px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 w-12 h-12 justify-center rounded-xl bg-gradient-warm mb-4">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Join Adriken and start connecting</p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="pl-9 h-12 sm:h-10 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9 h-12 sm:h-10 rounded-xl" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="pl-9 pr-12 h-12 sm:h-10 rounded-xl" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button variant="hero" className="w-full h-12 rounded-xl text-base font-semibold touch-manipulation" type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-5">
              By signing up, you agree to our <Link to="/terms" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded">Privacy Policy</Link>. Your data is processed in accordance with the Kenya Data Protection Act and GDPR.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 rounded">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
