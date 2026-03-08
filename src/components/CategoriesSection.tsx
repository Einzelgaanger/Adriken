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
    <section className="py-16 sm:py-20 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
            Or browse by category
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Not sure what to say? Start with a category.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.label}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/results?q=${encodeURIComponent(cat.query)}`)}
              className="flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[88px] sm:min-h-[100px] p-3 sm:p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card active:bg-card/80 transition-all duration-200 touch-manipulation"
            >
              <cat.icon className="w-6 h-6 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground text-center leading-tight">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
