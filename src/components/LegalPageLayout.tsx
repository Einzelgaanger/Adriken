import { motion } from "framer-motion";
import { BackgroundPathsLayer } from "@/components/ui/background-paths";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero-style background */}
      <div className="absolute inset-0 bg-[linear-gradient(175deg,hsl(32_30%_98.5%)_0%,hsl(28_28%_97.5%)_50%,hsl(24_35%_97%)_100%)]" />
      <BackgroundPathsLayer className="opacity-[0.5]" />
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,hsl(18_88%_58%_/_0.18)_0%,hsl(22_80%_62%_/_0.08)_45%,transparent_70%)] blur-[120px] pointer-events-none animate-hero-glow" />
      <div className="absolute left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,hsl(28_70%_65%_/_0.12)_0%,transparent_55%)] blur-[80px] pointer-events-none animate-hero-glow" />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,transparent_0%,hsl(14_60%_55%_/_0.03)_25%,transparent_55%,hsl(28_75%_60%_/_0.04)_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 0.5px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_0%,hsl(220_20%_8%_/_0.04)_100%)] pointer-events-none" />

      <div className="relative z-10 pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="container mx-auto max-w-3xl text-center mb-12 sm:mb-16"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Last updated: {lastUpdated}
          </p>
        </motion.div>

        <motion.article
          variants={container}
          initial="hidden"
          animate="show"
          className="container mx-auto max-w-3xl legal-prose"
        >
          {children}
        </motion.article>
      </div>
    </div>
  );
}

export const legalSectionVariants = item;
