import { Star, Quote, Sparkles, MessageCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import GlowingCard from "./GlowingCard";

const testimonials = [
  {
    id: 1,
    name: "Marko S.",
    location: "Beograd, Palilula",
    text: "Probao sam med od maslačka i zaista sam zadovoljan kvalitetom. Vidi se da je domaći proizvod, bez industrijskog šmeka, i sigurno bih ga ponovo kupio.",
    rating: 5,
    product: "Med od maslačka",
    avatar: "MS",
    color: "primary",
  },
  {
    id: 2,
    name: "Porodica J.",
    location: "Beograd, Novi Beograd",
    text: "Ovde naručujemo još od 2021. godine, obično naručim veću količinu u četvrtak i već u nedelju stiže sveže, pa cela porodica jede pravu, zdravu hranu sa sela.",
    rating: 5,
    product: "Paket sveže hrane",
    avatar: "PJ",
    color: "accent",
  },
  {
    id: 3,
    name: "Milan P.",
    location: "Beograd, Žarkovo",
    text: "Imate zimnice kakve nisam jeo još od kada sam se preselio u Beograd, kvalitet i ukus podsećaju na domaće iz detinjstva. Podrška ženama iz Mionice i samo napred.",
    rating: 5,
    product: "Domaća zimnica",
    avatar: "MP",
    color: "secondary",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const TestimonialsSection = () => {
  return (
    <section className="py-12 xs:py-16 sm:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-radial opacity-50" />
      <div className="absolute inset-0 spotlight" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-[10%] w-40 h-40 xs:w-52 xs:h-52 sm:w-64 sm:h-64 rounded-full blur-3xl opacity-15"
        style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent-gold)))" }}
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full glass-elevated text-xs xs:text-sm font-semibold mb-4 xs:mb-5 sm:mb-6"
          >
            <MessageCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-accent" />
            <span>Recenzije</span>
          </motion.div>
          <h2 className="section-title mb-3 xs:mb-4 sm:mb-5 text-2xl xs:text-3xl sm:text-4xl md:text-5xl">
            Šta Kažu{" "}
            <span className="text-primary">Naši Kupci</span>
          </h2>
          <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Pročitajte iskustva zadovoljnih kupaca koji su otkrili čari domaćih proizvoda
          </p>
        </motion.div>

        {/* Testimonials Grid - Responsive layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8"
          style={{ perspective: "1000px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              className="relative group"
              style={{ transformStyle: "preserve-3d" }}
            >
              <GlowingCard 
                className="card-product p-4 xs:p-5 sm:p-6 md:p-8 h-full relative overflow-hidden group"
                glowColor={`hsl(var(--${testimonial.color}))`}
              >
                {/* Quote Icon - Responsive */}
                <motion.div 
                  className="absolute -top-2 -left-2 xs:-top-2.5 xs:-left-2.5 sm:-top-3 sm:-left-3"
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <div 
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)"
                    }}
                  >
                    <Quote className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
                  </div>
                </motion.div>

                {/* Rating - Responsive */}
                <div className="flex gap-1 xs:gap-1.5 mb-4 xs:mb-5 sm:mb-6 pt-6 xs:pt-7 sm:pt-8">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300 }}
                    >
                      <Star className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 fill-accent text-accent" />
                    </motion.div>
                  ))}
                </div>

                {/* Text - Responsive */}
                <p className="text-foreground/90 text-sm xs:text-base sm:text-lg leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-8 font-medium italic">
                  "{testimonial.text}"
                </p>

                {/* Product Tag - Responsive */}
                <div className="mb-4 xs:mb-5 sm:mb-6">
                  <span className="text-[10px] xs:text-xs font-semibold text-muted-foreground bg-muted/80 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                    Kupila: {testimonial.product}
                  </span>
                </div>

                {/* Author - Responsive */}
                <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 pt-4 xs:pt-5 sm:pt-6 border-t border-border/50">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl xs:rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-sm xs:text-base sm:text-lg shadow-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--${testimonial.color}) / 0.9) 0%, hsl(var(--${testimonial.color === 'primary' ? 'secondary' : testimonial.color === 'accent' ? 'accent-gold' : 'primary'})) 100%)`
                    }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm xs:text-base sm:text-lg truncate">{testimonial.name}</p>
                    <p className="text-xs xs:text-sm text-muted-foreground flex items-center gap-1 xs:gap-1.5">
                      <span className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      <span className="truncate">{testimonial.location}</span>
                    </p>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute bottom-3 right-3 xs:bottom-4 xs:right-4 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 border-b-2 border-r-2 border-primary/30 rounded-br-xl xs:rounded-br-2xl" />
                </div>
              </GlowingCard>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Trust Indicators - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 xs:gap-5 sm:gap-6 md:gap-8 mt-10 xs:mt-12 sm:mt-14 md:mt-16 text-muted-foreground"
        >
          {[
            { value: "4.9/5", label: "Prosečna ocena" },
            { value: "500+", label: "Zadovoljnih kupaca" },
            { value: "98%", label: "Bi preporučilo" },
          ].map((stat) => (
            <motion.div 
              key={stat.label}
              className="text-center px-3 xs:px-4 sm:px-5 md:px-6"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-xl xs:text-2xl sm:text-3xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] xs:text-xs sm:text-sm mt-0.5 xs:mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
