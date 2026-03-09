import { motion } from "framer-motion";

type FloatingPathsProps = {
  position: number;
  strokeClassName?: string;
};

function FloatingPaths({ position, strokeClassName = "text-primary" }: FloatingPathsProps) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.55 + i * 0.028,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none ${strokeClassName}`}>
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={Math.min(0.82, 0.16 + path.id * 0.016)}
            initial={{ pathLength: 0.3, opacity: 0.35 }}
            animate={{
              pathLength: 1,
              opacity: [0.32, 0.7, 0.32],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 46 + path.id * 0.85,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

type BackgroundPathsLayerProps = {
  className?: string;
};

export function BackgroundPathsLayer({ className = "" }: BackgroundPathsLayerProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <FloatingPaths position={1} strokeClassName="text-primary/95" />
      <FloatingPaths position={-1} strokeClassName="text-orange-500/90" />
    </div>
  );
}

