import { ReactNode, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  splitBy?: "words" | "chars" | "lines";
}

const TextReveal = ({ 
  children, 
  className = "", 
  delay = 0,
  splitBy = "words" 
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  if (typeof children !== "string") {
    return <div className={className}>{children}</div>;
  }

  const splitText = (): string[] => {
    switch (splitBy) {
      case "chars":
        return children.split("");
      case "lines":
        return children.split("\n");
      case "words":
      default:
        return children.split(" ");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: splitBy === "chars" ? 0.02 : 0.08,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const items = splitText();

  return (
    <motion.div
      ref={ref}
      className={`${className} perspective-1000`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block origin-bottom"
          style={{ transformStyle: "preserve-3d" }}
        >
          {item}
          {splitBy === "words" && index < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
