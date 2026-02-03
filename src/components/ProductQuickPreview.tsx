import { ShoppingCart, Check, ExternalLink, Minus, Plus, X, Package, MapPin, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { getImageWithFallback } from "@/lib/categoryPlaceholders";
import { getOptimizedUnsplashUrl } from "@/lib/imageOptimization";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  price: number;
  imageUrl: string;
  available: boolean;
  manufacturerUrl?: string;
}

interface ProductQuickPreviewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_QUANTITY = 9999;

const ProductQuickPreview = memo(({ product, open, onOpenChange }: ProductQuickPreviewProps) => {
  const { addItem, isInCart, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [product]);

  // Clean text from file extensions
  const cleanText = useCallback((text: string | undefined) => {
    if (!text) return "";
    return text.replace(/\.(png|jpg|jpeg|gif|webp|svg|bmp)$/gi, "").trim();
  }, []);

  const cleanName = useMemo(() => cleanText(product?.name), [product?.name, cleanText]);
  const cleanCategory = useMemo(() => cleanText(product?.category), [product?.category, cleanText]);

  // Memoize computed values
  const inCart = useMemo(() => product ? isInCart(product.id) : false, [product, isInCart]);
  const cartItem = useMemo(() => product ? items.find(item => item.id === product.id) : null, [product, items]);
  const currentQuantity = cartItem?.quantity || 0;

  // Memoize image URLs
  const { displayImage, fallbackImage, placeholderImage } = useMemo(() => {
    if (!product) {
      return { displayImage: "", fallbackImage: "", placeholderImage: "" };
    }
    const raw = getImageWithFallback(product.imageUrl, product.category);
    return {
      displayImage: getOptimizedUnsplashUrl(raw, 800, 90),
      fallbackImage: getOptimizedUnsplashUrl(getImageWithFallback(null, product.category), 800, 90),
      placeholderImage: getOptimizedUnsplashUrl(raw, 30, 15),
    };
  }, [product]);

  const clampQuantity = useCallback((value: number) => {
    const parsed = Math.floor(Number(value));
    const safe = Number.isFinite(parsed) ? parsed : 1;
    return Math.min(MAX_QUANTITY, Math.max(1, safe));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product?.available) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        manufacturer: product.manufacturer,
        imageUrl: product.imageUrl,
        category: product.category,
      },
      clampQuantity(quantity)
    );
    setQuantity(1);
  }, [product, quantity, addItem, clampQuantity]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
    }
  }, [hasError]);

  // Early return after all hooks
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] xs:max-w-[90vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl p-0 overflow-hidden bg-card border-0 shadow-2xl rounded-2xl xs:rounded-3xl">
        {/* Custom close button */}
        <motion.button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 xs:top-4 xs:right-4 z-50 w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 xs:w-5 xs:h-5 text-foreground" />
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Image Section - Full height on desktop */}
          <div className="relative aspect-square xs:aspect-[4/3] md:aspect-auto md:h-[90vh] bg-muted overflow-hidden">
            {/* Blur placeholder */}
            <AnimatePresence>
              {!isLoaded && (
                <motion.div 
                  className="absolute inset-0 bg-muted"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    backgroundImage: `url(${placeholderImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(20px)",
                    transform: "scale(1.1)",
                  }}
                />
              )}
            </AnimatePresence>
            
            <motion.img
              src={hasError ? fallbackImage : displayImage}
              alt={product.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Availability Badge */}
            <motion.div 
              className="absolute top-3 right-12 xs:top-4 xs:right-16"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.available ? (
                <span className="badge-available flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs">
                  <motion.span 
                    className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Na stanju
                </span>
              ) : (
                <span className="badge-unavailable text-[10px] xs:text-xs">Nedostupno</span>
              )}
            </motion.div>

            {/* Image overlay gradient for mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-100 md:opacity-0 pointer-events-none" />
          </div>

          {/* Content Section */}
          <div className="p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col bg-card relative md:max-h-[90vh] md:overflow-y-auto">
            {/* Rating (decorative) */}
            <motion.div 
              className="flex items-center gap-1 mb-2 xs:mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-accent text-accent" />
              ))}
              <span className="text-[10px] xs:text-xs text-muted-foreground ml-1 xs:ml-2">(5.0)</span>
            </motion.div>

            {/* Product Name */}
            <motion.h2 
              className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-card-foreground mb-2 xs:mb-3 sm:mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {cleanName}
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-sm xs:text-base text-muted-foreground leading-relaxed mb-4 xs:mb-5 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {product.description}
            </motion.p>

            {/* Product Meta */}
            <motion.div 
              className="flex flex-wrap gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Manufacturer */}
              <div className="flex items-center gap-1.5 xs:gap-2 text-muted-foreground">
                <Package className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                {product.manufacturerUrl ? (
                  <a
                    href={product.manufacturerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover font-medium inline-flex items-center gap-1 group text-xs xs:text-sm"
                  >
                    {product.manufacturer}
                    <ExternalLink className="w-2.5 h-2.5 xs:w-3 xs:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="font-medium text-foreground text-xs xs:text-sm">{product.manufacturer}</span>
                )}
              </div>
              
              {/* Origin indicator */}
              <div className="flex items-center gap-1.5 xs:gap-2 text-muted-foreground text-xs xs:text-sm">
                <MapPin className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                <span>Domaći proizvod</span>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="h-px bg-border/50 mb-4 xs:mb-5 sm:mb-6" />

            {/* Price */}
            <motion.div 
              className="flex items-baseline gap-1.5 xs:gap-2 mb-4 xs:mb-5 sm:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <span className="text-3xl xs:text-4xl sm:text-5xl font-display font-bold text-primary">
                {product.price.toLocaleString("sr-RS")}
              </span>
              <span className="text-base xs:text-lg text-muted-foreground font-medium">RSD</span>
            </motion.div>

            {/* Quantity Selector */}
            {product.available && (
              <motion.div 
                className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-sm text-muted-foreground">Količina:</span>
                <div className="flex items-center gap-1 xs:gap-2 bg-muted/80 rounded-xl xs:rounded-2xl p-1 xs:p-1.5 w-fit">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Minus className="w-4 h-4 xs:w-5 xs:h-5" />
                  </motion.button>
                  <input
                    type="number"
                    min={1}
                    max={MAX_QUANTITY}
                    step={1}
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") return;
                      setQuantity(clampQuantity(Number(raw)));
                    }}
                    onBlur={() => setQuantity((q) => clampQuantity(q))}
                    className="w-14 xs:w-16 sm:w-20 h-9 xs:h-10 sm:h-12 text-center font-bold text-base xs:text-lg bg-transparent outline-none rounded-lg xs:rounded-xl border border-transparent focus:border-border focus:bg-background/70"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg xs:rounded-xl flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Plus className="w-4 h-4 xs:w-5 xs:h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Spacer for flex layout */}
            <div className="flex-1 min-h-2 xs:min-h-4" />

            {/* Add to Cart */}
            <motion.div 
              className="mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 xs:py-4 sm:py-5 text-base xs:text-lg font-semibold flex items-center justify-center gap-2 xs:gap-3 rounded-xl xs:rounded-2xl transition-all shadow-lg ${
                  !product.available 
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : inCart 
                      ? "bg-gradient-to-r from-accent to-accent-gold text-foreground" 
                      : "bg-gradient-to-r from-primary to-primary-dark text-primary-foreground hover:shadow-xl"
                }`}
                disabled={!product.available}
                onClick={handleAddToCart}
              >
                {!product.available ? (
                  "Nedostupno"
                ) : inCart ? (
                  <>
                    <Check className="w-5 h-5 xs:w-6 xs:h-6" />
                    <span>U korpi ({currentQuantity}) - Dodaj još {quantity}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 xs:w-6 xs:h-6" />
                    <span>Dodaj u Korpu</span>
                  </>
                )}
              </motion.button>

              {inCart && (
                <motion.p 
                  className="text-center text-xs xs:text-sm text-muted-foreground mt-2 xs:mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Već imate {currentQuantity} kom. u korpi
                </motion.p>
              )}
            </motion.div>

            {/* Trust badges */}
            <motion.div 
              className="flex items-center justify-center gap-3 xs:gap-4 sm:gap-6 mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-primary" />
                Domaći proizvod
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-accent" />
                Brza dostava
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-secondary" />
                Sigurna kupovina
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProductQuickPreview.displayName = "ProductQuickPreview";

export default ProductQuickPreview;
