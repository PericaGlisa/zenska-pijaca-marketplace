import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductQuickPreview from "@/components/ProductQuickPreview";
import { useProducts, type Product } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { preloadCriticalImages } from "@/lib/imageOptimization";
import { getImageWithFallback } from "@/lib/categoryPlaceholders";
import SEOHead from "@/components/SEOHead";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Products = () => {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Read category and search from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get("kategorija");
    const searchParam = searchParams.get("pretraga");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Preload first 8 product images for faster initial render
  useEffect(() => {
    if (products.length > 0) {
      const criticalImages = products
        .slice(0, 8)
        .map(p => getImageWithFallback(p.imageUrl, p.category));
      preloadCriticalImages(criticalImages);
    }
  }, [products]);

  // Update URL when category changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("kategorija");
    } else {
      searchParams.set("kategorija", value);
    }
    setSearchParams(searchParams);
  };

  const handleProductPreview = (product: Product) => {
    setSelectedProduct(product);
    setPreviewOpen(true);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.manufacturer.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by availability
    if (showAvailableOnly) {
      result = result.filter((p) => p.available);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, showAvailableOnly, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    handleCategoryChange("all");
    setShowAvailableOnly(false);
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || showAvailableOnly;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Proizvodi"
        description="Pregledajte sve domaće proizvode na Ženskoj Pijaci. Organska hrana, prirodna kozmetika, med, džemovi, sapuni i unikatne rukotvorine od lokalnih proizvođača."
        url="https://zenskapijaca.rs/proizvodi"
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
              Svi Proizvodi
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pregledajte našu kompletnu ponudu domaćih proizvoda od lokalnih
              proizvođača
            </p>
          </motion.div>

          {/* Search and Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Pretraži proizvode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px] h-12">
                    <SelectValue placeholder="Kategorija" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve kategorije</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-12">
                    <SelectValue placeholder="Sortiraj" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Po imenu</SelectItem>
                    <SelectItem value="price-asc">Cena ↑</SelectItem>
                    <SelectItem value="price-desc">Cena ↓</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="available"
                    checked={showAvailableOnly}
                    onCheckedChange={(checked) =>
                      setShowAvailableOnly(checked as boolean)
                    }
                  />
                  <Label htmlFor="available" className="text-sm cursor-pointer">
                    Samo dostupno
                  </Label>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Očisti
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filteri
                {hasActiveFilters && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Kategorija" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Sve kategorije</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="Sortiraj" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Po imenu</SelectItem>
                        <SelectItem value="price-asc">Cena ↑</SelectItem>
                        <SelectItem value="price-desc">Cena ↓</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="available-mobile"
                          checked={showAvailableOnly}
                          onCheckedChange={(checked) =>
                            setShowAvailableOnly(checked as boolean)
                          }
                        />
                        <Label htmlFor="available-mobile" className="text-sm cursor-pointer">
                          Samo dostupno
                        </Label>
                      </div>

                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-muted-foreground"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Očisti filtere
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground mb-6"
          >
            Prikazano {filteredProducts.length} od {products.length} proizvoda
          </motion.p>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <p className="text-xl text-muted-foreground mb-4">
                Nema proizvoda koji odgovaraju pretrazi
              </p>
              <Button onClick={clearFilters} variant="outline">
                Očisti filtere
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    category={product.category}
                    manufacturer={product.manufacturer}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    available={product.available}
                    manufacturerUrl={product.manufacturerUrl}
                    onPreview={() => handleProductPreview(product)}
                    priority={index < 8}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* QuickPreview Modal */}
      <ProductQuickPreview 
        product={selectedProduct}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <Footer />
    </div>
  );
};

export default Products;
