import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, DollarSign, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const providerBenefits = [
  { icon: DollarSign, text: "Set your own rates" },
  { icon: Users, text: "Customers find you" },
  { icon: TrendingUp, text: "Grow your business" },
  { icon: Shield, text: "Verified profiles" },
];

const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Provider CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

          <div className="relative z-10 px-6 sm:px-10 md:px-16 py-10 sm:py-14 md:py-16">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-primary font-semibold text-sm mb-3 tracking-wide uppercase">For Service Providers</p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-[1.1]">
                  Turn your skills into income
                </h2>
                <p className="text-white/60 text-[15px] sm:text-base mb-6 leading-relaxed">
                  Whether you're a plumber, nanny, photographer, or consultant — list your services and let customers come to you. No hustle, just quality work.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {providerBenefits.map((b) => (
                    <div key={b.text} className="flex items-center gap-2.5 text-white/80 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <b.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{b.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/become-provider">
                  <Button size="lg" className="h-12 sm:h-13 rounded-xl bg-white text-foreground border-none hover:bg-white/90 font-bold shadow-lg px-8 text-base w-full sm:w-auto">
                    Start Earning Today <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:flex flex-col gap-3">
                {[
                  { emoji: "🔧", title: "Plumber in Nairobi", earnings: "KSh 45,000/mo" },
                  { emoji: "📸", title: "Event Photographer", earnings: "KSh 80,000/mo" },
                  { emoji: "👶", title: "Nanny & Childcare", earnings: "KSh 35,000/mo" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.06] border border-white/10">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/50 text-xs">Avg. earnings</p>
                    </div>
                    <span className="text-primary font-bold text-sm">{item.earnings}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seeker CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-warm" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white blur-[120px] -translate-y-1/3 translate-x-1/4" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 md:px-16 py-10 sm:py-14 md:py-16 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4 tracking-tight leading-[1.1]">
              Need something done? Just ask.
            </h2>
            <p className="text-primary-foreground/75 text-[15px] sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Describe what you need in plain language. Our AI finds the perfect match in seconds.
            </p>
            <Link to="/">
              <Button size="lg" className="h-12 sm:h-13 rounded-xl bg-white text-foreground border-none hover:bg-white/90 font-bold shadow-lg px-8 text-base w-full sm:w-auto">
                <Sparkles className="w-4 h-4 mr-2" /> Find Help Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
