import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home, UtensilsCrossed, Baby, Car, Briefcase, Paintbrush,
  Wrench, Dumbbell, GraduationCap, Heart, Dog, Camera,
} from "lucide-react";

const categories = [
  { icon: Home, label: "Home Services", query: "I need help around the house" },
  { icon: UtensilsCrossed, label: "Chefs & Cooking", query: "I need a personal chef" },
  { icon: Baby, label: "Childcare", query: "I need a nanny for my children" },
  { icon: Car, label: "Drivers", query: "I need a personal driver" },
  { icon: Briefcase, label: "Consultants", query: "I need a business consultant" },
  { icon: Paintbrush, label: "Creatives", query: "I need a designer or artist" },
  { icon: Wrench, label: "Repairs", query: "I need a handyman for repairs" },
  { icon: Dumbbell, label: "Fitness", query: "I need a personal trainer" },
  { icon: GraduationCap, label: "Tutoring", query: "I need a tutor for my kids" },
  { icon: Heart, label: "Healthcare", query: "I need a caregiver" },
  { icon: Dog, label: "Pet Care", query: "I need a pet sitter" },
  { icon: Camera, label: "Photography", query: "I need a photographer" },
];

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-primary font-semibold text-sm mb-3 tracking-wide uppercase">Categories</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-foreground tracking-tight">
            Or browse by category
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            Not sure how to describe it? Start with a category.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              whileHover={{ y: -3, boxShadow: "var(--shadow-card)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/results?q=${encodeURIComponent(cat.query)}`)}
              className="flex flex-col items-center justify-center gap-3 min-h-[100px] sm:min-h-[110px] p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-200 touch-manipulation group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/[0.06] flex items-center justify-center group-hover:bg-primary/[0.1] transition-colors duration-200">
                <cat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground/80 text-center leading-tight group-hover:text-foreground transition-colors">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
