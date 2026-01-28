import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "organic" | "minimal";
  inverted?: boolean;
  className?: string;
}

const SectionDivider = ({ 
  variant = "wave", 
  inverted = false,
  className = "" 
}: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const pathProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const paths = {
    wave: "M0,96 C320,160 640,32 960,96 C1280,160 1440,64 1440,64 L1440,0 L0,0 Z",
    curve: "M0,64 Q720,128 1440,64 L1440,0 L0,0 Z",
    organic: "M0,80 C200,120 400,40 600,80 C800,120 1000,40 1200,80 C1320,100 1440,64 1440,64 L1440,0 L0,0 Z",
    minimal: "M0,32 L1440,96 L1440,0 L0,0 Z",
  };

  return (
    <div 
      ref={ref}
      className={`relative w-full overflow-hidden ${inverted ? "rotate-180" : ""} ${className}`}
      style={{ height: "clamp(60px, 8vw, 120px)" }}
    >
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={paths[variant]}
          fill="hsl(var(--background))"
          style={{ opacity: pathProgress }}
        />
        <path
          d={paths[variant]}
          fill="hsl(var(--background))"
        />
      </svg>
      
      {/* Decorative gradient line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)",
        }}
      />
    </div>
  );
};

export default SectionDivider;
