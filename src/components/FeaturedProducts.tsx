import { ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductQuickPreview from "./ProductQuickPreview";
import { useProducts, type Product } from "@/hooks/useProducts";
import { preloadCriticalImages } from "@/lib/imageOptimization";
import { getImageWithFallback } from "@/lib/categoryPlaceholders";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FeaturedProducts = () => {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Show first 9 products as featured (prioritize available ones)
  const featuredProducts = [...products]
    .sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0))
    .slice(0, 9);

  // Preload featured product images
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const criticalImages = featuredProducts.map(p => 
        getImageWithFallback(p.imageUrl, p.category)
      );
      preloadCriticalImages(criticalImages);
    }
  }, [featuredProducts]);

  const handleProductPreview = (product: Product) => {
    setSelectedProduct(product);
    setPreviewOpen(true);
  };

  return (
    <section id="featured-products" className="py-20 relative overflow-hidden spotlight">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-0 gradient-radial opacity-40" />
      
      {/* Floating accent */}
      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent-gold)))" }}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-5"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-elevated text-sm font-semibold"
            >
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Najpopularnije</span>
            </motion.div>
            <h2 className="section-title">
              Istaknuti{" "}
              <span className="text-primary">Proizvodi</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Otkrijte naše najpopularnije proizvode od lokalnih proizvođača
            </p>
          </motion.div>
          
          <motion.a
            href="/proizvodi"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary inline-flex items-center gap-3 group shrink-0 text-lg"
          >
            Svi Proizvodi
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </motion.a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Učitavanje proizvoda...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Greška pri učitavanju: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && featuredProducts.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {featuredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                custom={index}
              >
                <ProductCard 
                  {...product} 
                  onPreview={() => handleProductPreview(product)}
                  priority={index < 4}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* QuickPreview Modal */}
        <ProductQuickPreview 
          product={selectedProduct}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />

        {/* No Products State */}
        {!loading && featuredProducts.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Trenutno nema dostupnih proizvoda.</p>
          </div>
        )}
        
        {/* Bottom CTA */}
        {!loading && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-10"
          >
            <p className="text-muted-foreground mb-4 text-sm">
              Prikazano <span className="font-semibold text-foreground">{featuredProducts.length}</span> od 
              <span className="font-semibold text-foreground"> {products.length}</span> proizvoda
            </p>
            <a 
              href="/proizvodi" 
              className="btn-primary inline-flex items-center gap-3 group"
            >
              <span>Pogledaj Sve Proizvode</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;