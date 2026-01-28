import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import TextReveal from "./TextReveal";

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleHighlight?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeader = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleHighlight,
  description,
  centered = true,
  className = "",
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`${centered ? "text-center" : ""} mb-16 ${className}`}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-elevated text-sm font-semibold mb-6"
        >
          {BadgeIcon && <BadgeIcon className="w-4 h-4 text-accent" />}
          <span>{badge}</span>
        </motion.div>
      )}
      
      <h2 className="section-title text-foreground mb-5">
        {title}{" "}
        {titleHighlight && (
          <span className="text-gradient animated-underline">{titleHighlight}</span>
        )}
      </h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
