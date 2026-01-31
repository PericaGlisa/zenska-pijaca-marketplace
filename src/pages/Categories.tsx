import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { getPlaceholderForCategory } from "@/lib/categoryPlaceholders";
import SEOHead from "@/components/SEOHead";

const Categories = () => {
  const { categories, products, loading } = useProducts();

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Kategorije"
        description="Istražite kategorije domaćih proizvoda na Ženskoj Pijaci: organska hrana, prirodna kozmetika, med, džemovi, sapuni, rukotvorine i još mnogo toga."
        url="https://zenskapijaca.rs/kategorije"
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="section-container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Kategorije
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Istražite naše kategorije domaćih proizvoda od proverenih lokalnih
              proizvođača
            </p>
          </motion.div>

          {/* Categories Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/2] bg-muted animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/proizvodi?kategorija=${encodeURIComponent(category.name)}`}
                    className="group block relative overflow-hidden rounded-2xl aspect-[3/2]"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getPlaceholderForCategory(category.name)})`,
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-display font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">
                          {getProductCount(category.name)} proizvoda
                        </span>
                        <span className="flex items-center gap-1 text-white font-medium text-sm group-hover:gap-2 transition-all">
                          Pogledaj
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
