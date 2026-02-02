import { ArrowRight, Leaf, Heart, Users, Sparkles, Star, ChevronDown } from "lucide-react";
import { motion, type Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FloatingElements from "./FloatingElements";
import MarqueeStrip from "./MarqueeStrip";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const featureCards = [
  {
    icon: Leaf,
    title: "Prirodni Sastojci",
    description: "Bez hemikalija, samo čista priroda u svakom proizvodu.",
    color: "primary",
  },
  {
    icon: Heart,
    title: "Ručna Izrada",
    description: "Svaki proizvod je jedinstven i izrađen s ljubavlju.",
    color: "accent",
    offset: true,
  },
  {
    icon: Users,
    title: "Podržite Lokalno",
    description: "Direktna podrška domaćim proizvođačima.",
    color: "secondary",
  },
  {
    icon: Sparkles,
    title: "Kvalitet Zagarantovan",
    description: "Provereni proizvođači i vrhunski kvalitet.",
    color: "accent-brown",
    offset: true,
  },
];

const marqueeItems = [
  "Organski Proizvodi",
  "Ručna Izrada",
  "100% Domaće",
  "Podrška Ženama",
  "Održiva Proizvodnja",
  "Premium Kvalitet",
  "Lokalni Proizvođači",
  "Sa Ljubavlju",
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToProducts = () => {
    document.querySelector("#featured-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[calc(100vh-80px)] flex flex-col pt-28 sm:pt-32 md:pt-36 lg:pt-24 xl:pt-20">
      {/* Premium Background with Parallax */}
      <motion.div 
        className="absolute inset-0 gradient-mesh" 
        style={{ y: backgroundY }}
      />
      <div className="absolute inset-0 gradient-radial" />
      <div className="absolute inset-0 noise-overlay" />
      
      {/* Floating Elements */}
      <FloatingElements variant="default" />
      
      {/* Animated Gradient Blobs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-20 left-[10%] w-40 h-40 rounded-full blur-3xl blob-shape"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--accent) / 0.15))" }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-32 right-[15%] w-56 h-56 rounded-full blur-3xl blob-shape"
        style={{ 
          background: "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent-gold) / 0.15))",
          animationDelay: "4s"
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute top-1/2 right-[5%] w-32 h-32 rounded-full blur-2xl animate-pulse-soft"
        style={{ background: "hsl(var(--secondary) / 0.2)" }}
      />

      {/* Main Content */}
      <motion.div style={{ opacity }} className="flex-1 flex items-center">
        <div className="section-container py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-24 items-center">
            {/* Text Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 sm:space-y-8 md:space-y-10 text-center lg:text-left"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold glass-elevated"
              >
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-foreground">Organski • Handmade • Lokalno</span>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary"
                />
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display font-bold leading-[1.1] sm:leading-[1.05] tracking-tight"
              >
                Kupovina{" "}
                <span className="text-primary relative inline-block">
                  sa Dušom
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 md:h-4"
                    viewBox="0 0 200 12"
                  >
                    <motion.path
                      d="M0 6 Q50 0 100 6 T200 6"
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Otkrijte jedinstvene proizvode domaćih proizvođača i poljoprivrednica. 
                Svaki proizvod nosi priču, ljubav i pažnju onih koji ga stvaraju.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.a 
                  href="/proizvodi" 
                  className="btn-primary inline-flex items-center justify-center gap-2 sm:gap-3 group text-base sm:text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Pregledaj Proizvode</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </motion.a>
                <motion.a 
                  href="/o-nama" 
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-base sm:text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Saznaj Više
                </motion.a>
              </motion.div>

              {/* Stats with enhanced styling */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-8 sm:pt-10 md:pt-12 border-t border-border/50"
              >
                {[
                  { value: "50+", label: "Proizvođača" },
                  { value: "200+", label: "Proizvoda" },
                  { value: "100%", label: "Domaće" },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center lg:text-left group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1 sm:mt-2 font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Feature Cards with 3D effect */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
            >
              {featureCards.map((card) => (
                <motion.div
                  key={card.title}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -12,
                    rotateX: 2,
                    rotateY: -2,
                    transition: { duration: 0.3 }
                  }}
                  className={`card-product card-3d p-4 sm:p-5 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-5 group ${card.offset ? "mt-6 sm:mt-8 md:mt-10 lg:mt-14" : ""}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"
                    style={{
                      background: card.color === "primary" 
                        ? "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.08))"
                        : card.color === "accent"
                        ? "linear-gradient(135deg, hsl(var(--accent) / 0.25), hsl(var(--accent-gold) / 0.15))"
                        : card.color === "secondary"
                        ? "linear-gradient(135deg, hsl(var(--secondary) / 0.25), hsl(var(--secondary) / 0.12))"
                        : "linear-gradient(135deg, hsl(var(--accent-brown) / 0.2), hsl(var(--accent-brown) / 0.08))"
                    }}
                  >
                    <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${
                      card.color === "primary" ? "text-primary" :
                      card.color === "accent" ? "text-accent-gold" :
                      card.color === "secondary" ? "text-secondary" :
                      "text-accent-brown"
                    }`} />
                  </motion.div>
                  <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed hidden sm:block">
                    {card.description}
                  </p>
                  
                  {/* Subtle corner accent */}
                  <div className="absolute top-0 right-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator - positioned above marquee */}
      <motion.div 
        className="relative z-20 flex justify-center pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.button
          onClick={scrollToProducts}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-sm font-medium uppercase tracking-widest opacity-70 group-hover:opacity-100">
            Skrolujte
          </span>
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Marquee Strip */}
      <div className="relative z-10 py-6 border-y border-border/30 bg-muted/30 backdrop-blur-sm">
        <MarqueeStrip 
          items={marqueeItems} 
          className="text-muted-foreground"
          speed={40}
        />
      </div>

      {/* Bottom Gradient Fade - removed extra height */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
