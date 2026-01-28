import { motion } from "framer-motion";
import { Leaf, Star, Sparkles, Heart } from "lucide-react";

interface FloatingElementsProps {
  variant?: "default" | "minimal" | "festive";
  className?: string;
}

const FloatingElements = ({ variant = "default", className = "" }: FloatingElementsProps) => {
  const elements = {
    default: [
      { Icon: Leaf, size: 20, x: "10%", y: "20%", delay: 0, duration: 6, color: "text-primary/20" },
      { Icon: Star, size: 16, x: "85%", y: "15%", delay: 1, duration: 8, color: "text-accent/30" },
      { Icon: Sparkles, size: 14, x: "75%", y: "70%", delay: 2, duration: 7, color: "text-secondary/25" },
      { Icon: Leaf, size: 18, x: "15%", y: "75%", delay: 0.5, duration: 9, color: "text-primary/15" },
      { Icon: Heart, size: 12, x: "90%", y: "45%", delay: 1.5, duration: 6.5, color: "text-accent-gold/25" },
      { Icon: Star, size: 10, x: "5%", y: "50%", delay: 3, duration: 7.5, color: "text-accent/20" },
    ],
    minimal: [
      { Icon: Sparkles, size: 14, x: "90%", y: "20%", delay: 0, duration: 8, color: "text-primary/15" },
      { Icon: Star, size: 12, x: "10%", y: "80%", delay: 2, duration: 9, color: "text-accent/20" },
    ],
    festive: [
      { Icon: Star, size: 20, x: "5%", y: "10%", delay: 0, duration: 5, color: "text-accent/40" },
      { Icon: Sparkles, size: 18, x: "95%", y: "20%", delay: 0.5, duration: 6, color: "text-accent-gold/50" },
      { Icon: Heart, size: 16, x: "80%", y: "80%", delay: 1, duration: 5.5, color: "text-primary/30" },
      { Icon: Star, size: 14, x: "20%", y: "70%", delay: 1.5, duration: 7, color: "text-accent/35" },
      { Icon: Sparkles, size: 22, x: "50%", y: "5%", delay: 2, duration: 6.5, color: "text-accent-gold/40" },
      { Icon: Leaf, size: 20, x: "30%", y: "90%", delay: 0.8, duration: 8, color: "text-secondary/30" },
      { Icon: Heart, size: 12, x: "70%", y: "40%", delay: 2.5, duration: 5, color: "text-accent/25" },
    ],
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements[variant].map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: element.x, top: element.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -30, -60, -90],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.Icon 
            className={element.color} 
            size={element.size}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
