import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { getPlaceholderForCategory, isValidImageUrl } from "@/lib/categoryPlaceholders";
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
                  className="aspect-square bg-muted animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const backgroundImage = isValidImageUrl(category.icon)
                  ? category.icon
                  : getPlaceholderForCategory(category.name) || getPlaceholderForCategory(category.icon);
                const iconIsImage = isValidImageUrl(category.icon);
                const iconText = (category.icon || "").trim();
                const showIconText = !iconIsImage && !!iconText && iconText.length <= 4 && !/[A-Za-z0-9]/.test(iconText);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/proizvodi?kategorija=${encodeURIComponent(category.name)}`}
                      className="group block relative overflow-hidden rounded-2xl aspect-square"
                    >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${backgroundImage})`,
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {(iconIsImage || showIconText) && (
                      <div className="absolute top-4 left-4 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/15 flex items-center justify-center overflow-hidden">
                        {iconIsImage ? (
                          <img
                            src={category.icon}
                            alt=""
                            loading="lazy"
                            className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain"
                          />
                        ) : (
                          <span className="text-4xl xs:text-5xl sm:text-6xl leading-none">{iconText}</span>
                        )}
                      </div>
                    )}
                    
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
