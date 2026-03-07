import { motion } from "framer-motion";
import { MessageSquare, Brain, UserCheck, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe What You Need",
    description: "Use natural language — no forms, no filters. Just say it like you'd tell a friend.",
  },
  {
    icon: Brain,
    title: "AI Finds the Best Match",
    description: "Our AI analyzes skills, experience, location, availability, and reviews to find your perfect match.",
  },
  {
    icon: UserCheck,
    title: "Review & Choose",
    description: "Browse recommended profiles, see ratings, and pick the person that fits best.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Schedule a time that works, confirm the booking, and you're all set.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From request to booking in minutes — powered by AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-semibold text-primary mb-2">Step {i + 1}</div>
              <h3 className="font-display font-bold text-lg mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
