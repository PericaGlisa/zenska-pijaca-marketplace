import { motion, type Variants } from "framer-motion";
import { Tag, ArrowRight, Loader2 } from "lucide-react";
import CategoryCard from "./CategoryCard";
import FloatingElements from "./FloatingElements";
import { useProducts } from "@/hooks/useProducts";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

const CategoriesSection = () => {
  const { categories, products, loading, error } = useProducts();
  
  // Calculate product count per category
  const categoriesWithCount = categories.map(cat => {
    const productCount = products.filter(p => p.category === cat.icon).length;
    return {
      ...cat,
      productCount,
    };
  });

  return (
    <section className="py-20 relative overflow-hidden grain-effect">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-muted/40" />
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      
      {/* Floating Elements */}
      <FloatingElements variant="minimal" />
      
      {/* Decorative blobs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
        animate={{ 
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-elevated text-sm font-semibold mb-6"
          >
            <Tag className="w-4 h-4 text-accent" />
            <span>Kategorije</span>
          </motion.div>
          <h2 className="section-title mb-5">
            Istražite{" "}
            <span className="text-primary">Kategorije</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Pronađite savršen proizvod iz naše bogate ponude domaćih i ručno izrađenih artikala
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Učitavanje kategorija...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Greška pri učitavanju: {error}</p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categoriesWithCount.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {categoriesWithCount.map((category, index) => (
              <motion.div 
                key={category.id} 
                variants={itemVariants}
                custom={index}
              >
                <CategoryCard 
                  name={category.name}
                  description={category.description}
                  icon={category.icon}
                  productCount={category.productCount}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Categories State */}
        {!loading && categoriesWithCount.length === 0 && !error && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Trenutno nema kategorija.</p>
          </div>
        )}
        
        {/* View All Categories CTA */}
        {!loading && categoriesWithCount.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-14"
          >
            <a 
              href="/kategorije" 
              className="btn-secondary inline-flex items-center gap-3 group text-lg"
            >
              <span>Sve Kategorije</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;