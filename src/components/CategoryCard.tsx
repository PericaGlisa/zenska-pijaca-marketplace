import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getPlaceholderForCategory, isValidImageUrl } from "@/lib/categoryPlaceholders";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string;
  productCount: number;
  imageUrl?: string;
}

const CategoryCard = ({ name, description, icon, productCount, imageUrl }: CategoryCardProps) => {
  const resolvedImage = isValidImageUrl(imageUrl) ? imageUrl : isValidImageUrl(icon) ? icon : "";
  const backgroundImage = resolvedImage || getPlaceholderForCategory(name) || getPlaceholderForCategory(icon);
  
  return (
    <motion.a
      href={`/proizvodi?kategorija=${encodeURIComponent(name)}`}
      className="group relative overflow-hidden rounded-2xl xs:rounded-3xl aspect-[16/10] xs:aspect-[4/3] sm:aspect-[3/2] md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-[3/2] block card-3d"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background Image */}
      <motion.img
        src={backgroundImage}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onError={(e) => {
          e.currentTarget.src = getPlaceholderForCategory(name);
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/50 to-foreground/5 group-hover:from-foreground/85 group-hover:via-foreground/35 transition-all duration-500" />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Content - Responsive padding and typography */}
      <div className="absolute inset-0 p-3 xs:p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-end">
        <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4">
          {/* Product Count Badge */}
          <div className="flex items-center gap-2 xs:gap-3">
            <motion.span 
              className="text-[10px] xs:text-xs font-semibold text-white/95 bg-white/25 backdrop-blur-sm px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {productCount} proizvoda
            </motion.span>
          </div>
          
          {/* Category Name */}
          <h3 className="font-display text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-accent transition-colors duration-300 drop-shadow-lg line-clamp-1">
            {name}
          </h3>
          
          {/* Description */}
          <p className="text-xs xs:text-sm text-white/80 line-clamp-2 leading-relaxed max-w-[95%] sm:max-w-[90%]">
            {description}
          </p>
          
          {/* CTA Button */}
          <motion.div 
            className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 bg-primary text-primary-foreground font-semibold py-1.5 xs:py-2 sm:py-2.5 px-3 xs:px-4 sm:px-5 rounded-lg xs:rounded-xl text-xs xs:text-sm shadow-lg w-fit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="hidden xs:inline">Istraži kategoriju</span>
            <span className="xs:hidden">Istraži</span>
            <ArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
          </motion.div>
        </div>
      </div>

      {/* Corner Accents - Enhanced */}
      <motion.div 
        className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-all duration-500"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
      >
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-white/30 rounded-tr-xl xs:rounded-tr-2xl" />
      </motion.div>
      <motion.div 
        className="absolute bottom-2 left-2 xs:bottom-3 xs:left-3 sm:bottom-4 sm:left-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-all duration-500"
        initial={{ scale: 0.8 }}
        whileHover={{ scale: 1 }}
      >
        <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-white/30 rounded-bl-xl xs:rounded-bl-2xl" />
      </motion.div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 100%, hsl(var(--accent) / 0.15), transparent 50%)"
          }}
        />
      </div>
    </motion.a>
  );
};

export default CategoryCard;
