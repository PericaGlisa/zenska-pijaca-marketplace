import { motion } from "framer-motion";

interface MarqueeStripProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
  separator?: string;
}

const MarqueeStrip = ({ 
  items, 
  direction = "left", 
  speed = 30,
  className = "",
  separator = "•"
}: MarqueeStripProps) => {
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? [0, "-50%"] : ["-50%", 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span key={index} className="flex items-center">
            <span className="px-8 text-lg font-display font-semibold">
              {item}
            </span>
            <span className="text-primary/50">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeStrip;
