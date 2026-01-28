import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const GlowingCard = ({ 
  children, 
  className = "",
  glowColor = "hsl(var(--primary))" 
}: GlowingCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(ref.current?.offsetWidth ? ref.current.offsetWidth / 2 : 0);
    mouseY.set(ref.current?.offsetHeight ? ref.current.offsetHeight / 2 : 0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([x, y]) => 
              `radial-gradient(600px circle at ${x}px ${y}px, ${glowColor.replace(")", " / 0.15)")}, transparent 40%)`
          ),
        }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([x, y]) => 
              `radial-gradient(400px circle at ${x}px ${y}px, ${glowColor.replace(")", " / 0.3)")}, transparent 40%)`
          ),
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          padding: "1px",
          borderRadius: "inherit",
        }}
      />
      
      {children}
    </motion.div>
  );
};

export default GlowingCard;
