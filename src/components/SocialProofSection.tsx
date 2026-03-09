import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Zap } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Providers" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Zap, value: "< 2 min", label: "Avg Match Time" },
  { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" },
];

const testimonials = [
  {
    name: "Jessica M.",
    role: "Working Parent",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    text: "I typed 'I need a nanny who can also help with homework' and within minutes had 5 amazing matches. Sarah has been with us for 6 months now!",
    rating: 5,
  },
  {
    name: "Tom R.",
    role: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    text: "Found a business consultant who understood my niche perfectly. The AI matching is scarily accurate — it's like it read my mind.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "Event Planner",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
    text: "Needed a photographer, caterer, AND decorator for a last-minute event. Adriken found all three in under 10 minutes.",
    rating: 5,
  },
];

const SocialProofSection = () => {
  return (
    <>
      {/* Stats */}
      <section className="py-14 sm:py-20 bg-card border-y border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/[0.07] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-display text-2xl sm:text-3xl md:text-[2.25rem] font-extrabold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <p className="text-primary font-semibold text-sm mb-3 tracking-wide uppercase">Testimonials</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              Loved by thousands
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
              Real stories from people who found exactly what they needed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl bg-card border border-border/60 p-5 sm:p-6 shadow-soft hover:shadow-card transition-shadow duration-300 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6 text-[15px] flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-border/30" />
                  <div>
                    <div className="font-display font-bold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SocialProofSection;
