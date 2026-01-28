import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, type Category } from "@/hooks/useProducts";

interface MobileCategoriesMenuProps {
  onLinkClick: () => void;
}

const MobileCategoriesMenu = ({ onLinkClick }: MobileCategoriesMenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { categories, loading } = useProducts();

  // Sort categories by sort order
  const sortedCategories = [...categories].sort((a, b) => a.sort - b.sort);

  return (
    <div className="w-full">
      {/* Toggle Button - Enhanced */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-4 px-5 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <span>Kategorije</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expandable Categories List - Enhanced */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-4 pr-2 pb-4 space-y-3">
              {/* Categories List */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
                  Sve kategorije
                </p>
                
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Učitavanje...</span>
                  </div>
                ) : sortedCategories.length > 0 ? (
                  <div className="space-y-1">
                    {sortedCategories.map((category, index) => (
                      <motion.a
                        key={category.id}
                        href={`/proizvodi?kategorija=${encodeURIComponent(category.name)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={onLinkClick}
                        className="flex items-center justify-between py-3.5 px-4 text-base text-foreground bg-background hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-125 transition-all" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 px-4 text-sm text-muted-foreground text-center">
                    Nema dostupnih kategorija
                  </p>
                )}
              </div>

              {/* View All Categories Button */}
              <motion.a
                href="/kategorije"
                onClick={onLinkClick}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 py-4 px-5 text-base font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group mt-2"
              >
                <span>Pogledaj sve kategorije</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              {/* Promo Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative overflow-hidden rounded-xl p-4 mt-3"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--accent) / 0.15), hsl(var(--accent-gold) / 0.1))"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Podržite lokalne proizvođače</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Kupujte domaće, kupujte kvalitetno</p>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-accent-gold/10 blur-xl" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileCategoriesMenu;
