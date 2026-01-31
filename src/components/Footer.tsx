import { Mail, Phone, MapPin, Facebook, Instagram, Heart, ArrowUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-zenska-pijaca.png";
import SectionDivider from "./SectionDivider";
import { useProducts } from "@/hooks/useProducts";

const quickLinks = [
  { label: "Proizvodi", href: "/proizvodi" },
  { label: "Kategorije", href: "/kategorije" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "FAQ", href: "/faq" },
];

const Footer = () => {
  const { categories } = useProducts();
  
  // Generate dynamic category links from loaded categories (all categories)
  const categoryLinks = categories
    .sort((a, b) => a.sort - b.sort)
    .map(cat => ({
      label: cat.name,
      href: `/proizvodi?kategorija=${encodeURIComponent(cat.name)}`,
    }));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Section Divider at top */}
      <SectionDivider variant="wave" inverted className="absolute top-0 left-0 right-0 -translate-y-full z-10" />
      
      {/* Premium Gradient Background */}
      <div className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)"
        }}
      />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-effect opacity-50" />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "hsl(var(--secondary) / 0.5)" }}
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="section-container py-12 sm:py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <Link to="/">
                <img 
                  src={logo} 
                  alt="Ženska Pijaca" 
                  className="h-28 sm:h-32 md:h-40 lg:h-48 w-auto object-contain cursor-pointer"
                />
              </Link>
            </motion.div>
            <p className="text-primary-foreground/80 leading-relaxed text-base sm:text-lg">
              Online pijaca za domaće proizvođače i ženske preduzetnice. 
              Kupovina sa dušom! 💚
            </p>
            <motion.div 
              className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-full bg-white/10 backdrop-blur-sm w-fit"
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              <span className="text-xs sm:text-sm font-semibold text-primary-foreground">100% Domaći Proizvodi</span>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6 md:mb-8 text-primary-foreground">Brzi Linkovi</h3>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {quickLinks.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <motion.div whileHover={{ x: 8 }}>
                    <Link
                      to={item.href}
                      className="text-primary-foreground/70 hover:text-white transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 group text-sm sm:text-base md:text-lg"
                    >
                      <motion.span
                        className="w-2 h-2 rounded-full bg-accent/50 group-hover:bg-accent group-hover:scale-125 transition-all"
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6 md:mb-8 text-primary-foreground">Kategorije</h3>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              {categoryLinks.length > 0 ? categoryLinks.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <motion.div whileHover={{ x: 8 }}>
                    <Link
                      to={item.href}
                      className="text-primary-foreground/70 hover:text-white transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 group text-sm sm:text-base md:text-lg"
                    >
                      <motion.span
                        className="w-2 h-2 rounded-full bg-accent/50 group-hover:bg-accent group-hover:scale-125 transition-all"
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                </motion.li>
              )) : (
                <li className="text-primary-foreground/50 text-sm">Učitavanje...</li>
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-display text-lg sm:text-xl font-bold mb-4 sm:mb-6 md:mb-8 text-primary-foreground">Kontakt</h3>
            <ul className="space-y-3 sm:space-y-4 md:space-y-5">
              <li>
                <motion.a
                  href="mailto:info@zenskapijaca.rs"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 sm:gap-4 text-primary-foreground/70 hover:text-white transition-all duration-300 group"
                >
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all"
                    whileHover={{ rotate: 5 }}
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </motion.div>
                  <span className="text-sm sm:text-base md:text-lg break-all">info@zenskapijaca.rs</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="tel:+381111234567"
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 sm:gap-4 text-primary-foreground/70 hover:text-white transition-all duration-300 group"
                >
                  <motion.div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all"
                    whileHover={{ rotate: 5 }}
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </motion.div>
                  <span className="text-sm sm:text-base md:text-lg">+381 11 123 4567</span>
                </motion.a>
              </li>
              <li className="flex items-center gap-3 sm:gap-4 text-primary-foreground/70">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <span className="text-sm sm:text-base md:text-lg">Beograd, Srbija</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/10 hover:bg-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground group-hover:text-accent transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <motion.p 
              className="text-primary-foreground/60 text-xs sm:text-sm md:text-base text-center sm:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2026 Ženska Pijaca. Sva prava zadržana.
            </motion.p>
            <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
              <motion.p 
                className="flex items-center gap-1.5 sm:gap-2 text-primary-foreground/60 text-xs sm:text-sm md:text-base"
                whileHover={{ scale: 1.02 }}
              >
                Napravljeno sa <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-accent fill-accent animate-pulse" /> u Srbiji
              </motion.p>
              <motion.button
                onClick={scrollToTop}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground group-hover:text-accent transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;