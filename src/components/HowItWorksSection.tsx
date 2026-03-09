import { motion } from "framer-motion";
import { MessageSquare, Brain, UserCheck, CalendarCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const seekerSteps = [
  {
    icon: MessageSquare,
    title: "Search for What You Need",
    description: "Just type it naturally — no account required. Search for businesses, services, or people.",
  },
  {
    icon: Brain,
    title: "AI Matches You",
    description: "Our AI analyzes skills, location, reviews to find the best fit.",
  },
  {
    icon: UserCheck,
    title: "Contact & Review",
    description: "View profiles, check ratings, contact via WhatsApp, and leave feedback.",
  },
];

const providerSteps = [
  {
    icon: UserCheck,
    title: "Create Your Profile",
    description: "Sign up and set up your business — name, services, contact, portfolio.",
  },
  {
    icon: CalendarCheck,
    title: "Get Discovered",
    description: "Set availability, rates, and let AI match you to customers.",
  },
  {
    icon: Brain,
    title: "Get Booked & Earn",
    description: "Receive requests, confirm bookings, and grow your business.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-primary font-semibold text-sm mb-2.5 tracking-wide uppercase">How It Works</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2.5 text-foreground tracking-tight">
            Simple for everyone
          </h2>
          <p className="text-muted-foreground text-[15px] sm:text-lg max-w-lg mx-auto">
            Whether you're searching for help or offering your services, we've got you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Seeker track */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card border border-border/60 p-5 sm:p-7"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">Looking for a Service</h3>
            </div>
            <div className="space-y-4">
              {seekerSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-warm text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-foreground mb-0.5">{step.title}</h4>
                    <p className="text-muted-foreground text-[13px] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/" className="block mt-5">
              <Button variant="soft" size="sm" className="rounded-xl w-full sm:w-auto">
                Search Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Provider track */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-card border border-border/60 p-5 sm:p-7"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">Offering Services</h3>
            </div>
            <div className="space-y-4">
              {providerSteps.map((step, i) => (
                <div key={step.title} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-foreground mb-0.5">{step.title}</h4>
                    <p className="text-muted-foreground text-[13px] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/signup" className="block mt-5">
              <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
