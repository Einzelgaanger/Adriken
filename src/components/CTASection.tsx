import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-warm p-6 sm:p-8 md:p-14 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-background blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-background blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
                Ready to find the perfect person for any job?
              </h2>
              <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                Join thousands of people who&apos;ve already ditched the old way of searching. Just say what you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 rounded-xl bg-primary-foreground text-foreground border-none hover:bg-primary-foreground/90 font-semibold shadow-lg touch-manipulation">
                    <Sparkles className="w-4 h-4 mr-2" /> Find Help Now
                  </Button>
                </Link>
                <Link to="/become-provider" className="w-full sm:w-auto">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 rounded-xl text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10 font-semibold touch-manipulation">
                    Become a Provider <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <img
                src={heroIllustration}
                alt="Diverse service providers connected by AI"
                className="w-full rounded-2xl shadow-lg"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
