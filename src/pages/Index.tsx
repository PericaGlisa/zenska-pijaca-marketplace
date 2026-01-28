import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Početna"
        description="Ženska Pijaca - online tržnica ručno izrađenih proizvoda od srpskih preduzetnica. Organska hrana, prirodna kozmetika, med, džemovi i rukotvorine."
        url="https://zenska-pijaca.rs/"
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
