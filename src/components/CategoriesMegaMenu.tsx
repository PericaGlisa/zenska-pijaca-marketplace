import { useState } from "react";
import { ChevronDown, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";

interface CategoriesMegaMenuProps {
  isScrolled?: boolean;
}

const CategoriesMegaMenu = ({ isScrolled }: CategoriesMegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, loading } = useProducts();

  // Sort categories by sort order
  const sortedCategories = [...categories].sort((a, b) => a.sort - b.sort);

  // Split categories into columns (3 columns max)
  const columnCount = 3;
  const itemsPerColumn = Math.ceil(sortedCategories.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    sortedCategories.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
  ).filter(col => col.length > 0);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        className="relative px-5 py-2.5 text-foreground font-medium transition-all duration-300 group rounded-xl hover:bg-primary/5 flex items-center gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="relative z-10">Kategorije</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
        <motion.span 
          className="absolute bottom-1 left-5 right-5 h-0.5 bg-gradient-to-r from-primary via-accent to-accent-gold rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        />
      </button>

      {/* MegaMenu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 bg-background/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* MegaMenu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 right-0 top-20 z-50 mx-auto max-w-7xl px-4"
            >
              <div className="bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-8 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Kategorije Proizvoda</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {loading ? "Učitavanje..." : `${categories.length} kategorija dostupno`}
                      </p>
                    </div>
                    <a 
                      href="/kategorije" 
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-200"
                    >
                      Sve kategorije
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="p-8">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-3 text-muted-foreground">Učitavanje kategorija...</span>
                    </div>
                  ) : columns.length > 0 ? (
                    <div className="grid grid-cols-3 gap-8">
                      {columns.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-1">
                          {column.map((category, index) => (
                            <motion.a
                              key={category.id}
                              href={`/proizvodi?kategorija=${encodeURIComponent(category.name)}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (colIndex * itemsPerColumn + index) * 0.02, duration: 0.2 }}
                              className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                            >
                              <span className="font-medium">{category.name}</span>
                              {category.description && (
                                <p className="text-sm text-muted-foreground group-hover:text-primary/70 mt-0.5 line-clamp-1">
                                  {category.description}
                                </p>
                              )}
                            </motion.a>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Nema dostupnih kategorija
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Pronađi proizvode po kategorijama</span>
                    <a 
                      href="/proizvodi" 
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Pregledaj sve proizvode →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesMegaMenu;
