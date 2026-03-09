import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-warm" />

          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white blur-[120px] -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-white blur-[80px] translate-y-1/3 -translate-x-1/4" />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4 sm:mb-5 tracking-tight leading-[1.1]">
              Ready to find the perfect match?
            </h2>
            <p className="text-primary-foreground/75 text-base sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands who've already ditched the old way of searching. Just say what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto h-12 sm:h-13 rounded-xl bg-white text-foreground border-none hover:bg-white/90 font-bold shadow-lg px-8 text-base">
                  <Sparkles className="w-4 h-4 mr-2" /> Find Help Now
                </Button>
              </Link>
              <Link to="/become-provider">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 sm:h-13 rounded-xl text-primary-foreground border-2 border-primary-foreground/25 hover:bg-primary-foreground/10 font-bold px-8 text-base">
                  Become a Provider <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
