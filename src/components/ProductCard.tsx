import { Eye, ExternalLink, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { forwardRef, memo, useState, useCallback } from "react";
import { useCart } from "@/hooks/useCart";
import { getImageWithFallback } from "@/lib/categoryPlaceholders";
import { getOptimizedUnsplashUrl, getLowQualityPlaceholder } from "@/lib/imageOptimization";

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
  available: boolean;
  manufacturerUrl?: string;
  onPreview?: () => void;
  priority?: boolean;
}

const ProductCard = memo(forwardRef<HTMLElement, ProductCardProps>(({
  id,
  name,
  description,
  category,
  manufacturer,
  price,
  imageUrl,
  available,
  manufacturerUrl,
  onPreview,
  priority = false,
}, ref) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const rawImage = getImageWithFallback(imageUrl, category);
  const displayImage = getOptimizedUnsplashUrl(rawImage, 400, 80);
  const fallbackImage = getOptimizedUnsplashUrl(getImageWithFallback(null, category), 400, 80);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!available) return;
    addItem({ id, name, price, manufacturer, imageUrl, category });
  }, [available, addItem, id, name, price, manufacturer, imageUrl, category]);

  const handlePreview = useCallback(() => {
    onPreview?.();
  }, [onPreview]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
    }
  }, [hasError]);

  return (
    <motion.article 
      ref={ref}
      className="card-product card-3d group relative cursor-pointer h-full flex flex-col"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
      onClick={handlePreview}
    >
      {/* Image Container - Responsive aspect ratio */}
      <div className="relative overflow-hidden aspect-[4/3] xs:aspect-square sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3] xl:aspect-square bg-muted">
        {/* Blur placeholder */}
        {!isLoaded && (
          <div 
            className="absolute inset-0 bg-muted animate-pulse"
            style={{
              backgroundImage: `url(${getLowQualityPlaceholder(rawImage)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
            }}
          />
        )}
        
        <motion.img
          src={hasError ? fallbackImage : displayImage}
          alt={name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Overlay Actions - Responsive button */}
        <div className="absolute inset-0 flex items-end p-2 xs:p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-2 xs:py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-1.5 sm:gap-2 text-xs xs:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handlePreview();
            }}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Pregled
          </motion.button>
        </div>

        {/* Availability Badge - Responsive sizing */}
        <motion.div 
          className="absolute top-2 right-2 xs:top-2.5 xs:right-2.5 sm:top-3 sm:right-3"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {available ? (
            <span className="badge-available flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs px-2 py-1 xs:px-2.5 xs:py-1.5">
              <motion.span 
                className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Na stanju
            </span>
          ) : (
            <span className="badge-unavailable text-[10px] xs:text-xs px-2 py-1 xs:px-2.5 xs:py-1.5">Nedostupno</span>
          )}
        </motion.div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Content - Responsive padding and typography */}
      <div className="p-3 xs:p-4 sm:p-5 space-y-2 xs:space-y-3 sm:space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-base xs:text-lg sm:text-xl text-card-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2 mt-1 xs:mt-1.5 sm:mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Manufacturer - Responsive */}
        <div className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm">
          <span className="text-muted-foreground hidden xs:inline">Proizvođač:</span>
          <span className="text-muted-foreground xs:hidden">Od:</span>
          {manufacturerUrl ? (
            <a
              href={manufacturerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover font-medium inline-flex items-center gap-1 xs:gap-1.5 group/link truncate"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{manufacturer}</span>
              <ExternalLink className="w-2.5 h-2.5 xs:w-3 xs:h-3 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          ) : (
            <span className="font-medium text-foreground truncate">{manufacturer}</span>
          )}
        </div>

        {/* Price and Action - Responsive */}
        <div className="flex items-center justify-between pt-2 xs:pt-3 sm:pt-4 border-t border-border/50 gap-2">
          <div className="flex items-baseline gap-0.5 xs:gap-1 min-w-0">
            <motion.span 
              className="text-xl xs:text-2xl sm:text-3xl font-display font-bold text-primary truncate"
              whileHover={{ scale: 1.05 }}
            >
              {price.toLocaleString("sr-RS")}
            </motion.span>
            <span className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">RSD</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`btn-primary py-1.5 xs:py-2 sm:py-2.5 px-2.5 xs:px-3 sm:px-5 text-[10px] xs:text-xs sm:text-sm flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0 ${
              inCart 
                ? "!bg-accent !from-accent !to-accent-gold" 
                : ""
            }`}
            disabled={!available}
            onClick={handleAddToCart}
          >
            {!available ? (
              <span className="hidden xs:inline">Nedostupno</span>
            ) : inCart ? (
              <>
                <Check className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">U korpi</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Dodaj</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Premium Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-tr-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/15 to-transparent" />
      </div>
      
      {/* Bottom glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.article>
  );
}));

ProductCard.displayName = "ProductCard";

export default ProductCard;