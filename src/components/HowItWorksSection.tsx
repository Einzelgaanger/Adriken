import { motion } from "framer-motion";
import { MessageSquare, Brain, UserCheck, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe What You Need",
    description: "Use natural language — no forms, no filters. Just say it like you'd tell a friend.",
    color: "from-primary/10 to-primary/5",
  },
  {
    icon: Brain,
    title: "AI Finds the Best Match",
    description: "Our AI analyzes skills, experience, location, and reviews to rank your perfect matches.",
    color: "from-accent/10 to-accent/5",
  },
  {
    icon: UserCheck,
    title: "Review & Choose",
    description: "Browse recommended profiles with ratings, portfolios, and contact details.",
    color: "from-primary/10 to-primary/5",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Schedule a time, send a message, and you're all set. It's that simple.",
    color: "from-accent/10 to-accent/5",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 sm:py-24 md:py-28 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-primary font-semibold text-sm mb-3 tracking-wide uppercase">How It Works</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-foreground tracking-tight">
            From request to booking in minutes
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Four simple steps, powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-2xl bg-card border border-border/50 p-6 text-center hover:shadow-card hover:border-border transition-all duration-300 group"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-warm text-primary-foreground text-xs font-bold flex items-center justify-center shadow-xs">
                {i + 1}
              </div>

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mt-2 mb-5 group-hover:scale-105 transition-transform duration-300`}>
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-base sm:text-[17px] mb-2.5 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
