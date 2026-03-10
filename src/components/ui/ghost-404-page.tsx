import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FlowButton } from "@/components/ui/flow-button";
import { useAuth } from "@/contexts/AuthContext";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

const numberVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
};

const ghostVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 15,
    rotate: -5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96] as const,
    },
  },
  hover: {
    scale: 1.08,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
      rotate: {
        duration: 2,
        ease: "linear" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
};

export function Ghost404Page() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-foreground opacity-70 font-display select-none"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>
            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={["visible", "floating"]}
            >
              <img
                src="https://xubohuah.github.io/xubohua.top/Group.png"
                alt="Ghost"
                width={120}
                height={120}
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain select-none"
                draggable={false}
                loading="eager"
              />
            </motion.div>
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-foreground opacity-70 font-display select-none"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 opacity-90 font-display select-none"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 font-body select-none"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost - it&apos;s not here.
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.3,
                ease: [0.43, 0.13, 0.23, 0.96],
              },
            }}
            className="flex items-center justify-center"
          >
            <Link to={user ? "/dashboard" : "/"}>
              <FlowButton text="Find shelter" />
            </Link>
          </motion.div>

          <motion.div className="mt-8" variants={itemVariants}>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground transition-colors underline font-body select-none"
            >
              Go back
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

