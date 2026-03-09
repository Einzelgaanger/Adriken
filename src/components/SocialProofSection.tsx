import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Zap, Briefcase } from "lucide-react";

const stats = [
  { icon: Users, value: "50,000+", label: "Active Users" },
  { icon: Briefcase, value: "12,000+", label: "Service Providers" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Zap, value: "< 2 min", label: "Avg Match Time" },
];

const testimonials = [
  {
    name: "Jessica M.",
    role: "Found a Nanny",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    text: "I typed 'I need a nanny who can also help with homework' and within minutes had 5 amazing matches. Sarah has been with us for 6 months now!",
    rating: 5,
    type: "seeker",
  },
  {
    name: "James K.",
    role: "Plumber · Provider",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    text: "Since listing on Adriken, I get 3-4 new clients every week without any marketing. The platform brings quality customers directly to me.",
    rating: 5,
    type: "provider",
  },
  {
    name: "Priya S.",
    role: "Event Planner",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
    text: "Needed a photographer, caterer, AND decorator for a last-minute event. Adriken found all three in under 10 minutes.",
    rating: 5,
    type: "seeker",
  },
  {
    name: "Amina W.",
    role: "Chef · Provider",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    text: "I started as a home cook listing my services. Now I have 20+ regular clients and earn more than my previous full-time job!",
    rating: 5,
    type: "provider",
  },
];

const SocialProofSection = () => {
  return (
    <>
      {/* Stats */}
      <section className="py-12 sm:py-16 bg-card border-y border-border/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/[0.07] flex items-center justify-center mx-auto mb-2.5">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <p className="text-primary font-semibold text-sm mb-2.5 tracking-wide uppercase">Testimonials</p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-2.5 tracking-tight">
              Trusted by seekers & providers
            </h2>
            <p className="text-muted-foreground text-[15px] sm:text-lg max-w-md mx-auto">
              Real stories from both sides of the marketplace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-2xl bg-card border border-border/60 p-4 sm:p-5 shadow-soft hover:shadow-card transition-shadow duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    t.type === "provider"
                      ? "bg-accent/10 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {t.type === "provider" ? "Provider" : "Seeker"}
                  </span>
                </div>
                <p className="text-foreground/90 leading-relaxed mb-4 text-[13px] sm:text-sm flex-1">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/40">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-border/30" />
                  <div>
                    <div className="font-display font-bold text-[13px] text-foreground">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.role}</div>
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
