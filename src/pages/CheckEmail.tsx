import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";

const CheckEmail = () => {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate("/login", { replace: true });
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, navigate]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(28_35%_98%)_0%,hsl(26_40%_97%)_100%)]" />
      <BackgroundPathsLayer className="opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,hsl(18_92%_62%_/_0.28)_0%,hsl(24_95%_68%_/_0.18)_28%,transparent_70%)] pointer-events-none" />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.12] blur-[140px] pointer-events-none" />
      <div className="pt-24 sm:pt-28 pb-16 flex items-center justify-center min-h-[85vh] px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] mx-auto text-center"
        >
          <div className="rounded-2xl bg-card/95 backdrop-blur-sm border border-border/60 p-8 sm:p-10 shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Check your email
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mb-1">
              We&apos;ve sent you a confirmation link.
            </p>
            {email && (
              <p className="text-muted-foreground/90 text-sm font-medium mb-4 break-all">
                {email}
              </p>
            )}
            <p className="text-muted-foreground text-sm mb-6">
              Click the link in the email to verify your account. You won&apos;t be able to log in until you&apos;ve confirmed.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="block">
                <Button variant="hero" className="w-full h-12 rounded-xl font-semibold gap-2">
                  Go to Log in <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                {secondsLeft > 0 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Redirecting to log in in {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}…
                  </>
                ) : (
                  "Redirecting…"
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckEmail;
