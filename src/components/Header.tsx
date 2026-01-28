import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, Sparkles, Command } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import logo from "@/assets/logo-zenska-pijaca.png";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import MobileCategoriesMenu from "./MobileCategoriesMenu";

// Links without Kategorije - it will be handled separately with MegaMenu
const navLinks = [
  { name: "Početna", href: "/" },
  { name: "Proizvodi", href: "/proizvodi" },
  { name: "O nama", href: "/o-nama" },
  { name: "Kontakt", href: "/kontakt" },
];

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/proizvodi?pretraga=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const { scrollY } = useScroll();

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 20);
  });

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "glass-elevated shadow-elevated py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center gap-3 shrink-0 group"
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="Ženska Pijaca" 
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <motion.div 
                className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              >
                <Sparkles className="w-3 h-3 text-accent-foreground" />
              </motion.div>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* First links before Kategorije */}
            {navLinks.slice(0, 2).map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="relative px-5 py-2.5 text-foreground font-medium transition-all duration-300 group rounded-xl hover:bg-primary/5"
              >
                <span className="relative z-10">{link.name}</span>
                <motion.span 
                  className="absolute bottom-1 left-5 right-5 h-0.5 bg-gradient-to-r from-primary via-accent to-accent-gold rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.a>
            ))}
            
            {/* Kategorije MegaMenu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CategoriesMegaMenu isScrolled={isScrolled} />
            </motion.div>
            
            {/* Remaining links after Kategorije */}
            {navLinks.slice(2).map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 3), duration: 0.5 }}
                className="relative px-5 py-2.5 text-foreground font-medium transition-all duration-300 group rounded-xl hover:bg-primary/5"
              >
                <span className="relative z-10">{link.name}</span>
                <motion.span 
                  className="absolute bottom-1 left-5 right-5 h-0.5 bg-gradient-to-r from-primary via-accent to-accent-gold rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isSearchOpen 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "hover:bg-muted"
              }`}
              aria-label="Pretraga"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:flex absolute -bottom-1 -right-1 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded text-muted-foreground">
                <Command className="w-2.5 h-2.5" />K
              </span>
            </motion.button>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-xl hover:bg-muted transition-all duration-300 group"
              aria-label="Korpa"
            >
              <ShoppingBag className="w-5 h-5 text-foreground transition-colors group-hover:text-primary" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center text-xs font-bold rounded-full shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-gold)) 100%)",
                      color: "hsl(var(--accent-foreground))"
                    }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl hover:bg-muted transition-all duration-300"
              aria-label={isMenuOpen ? "Zatvori meni" : "Otvori meni"}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-4 border-t border-border/50">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pretražite proizvode..."
                    className="input-field w-full pl-14 pr-20 py-4 text-lg"
                    autoFocus
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md border border-border">
                      Enter
                    </kbd>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden glass-elevated border-t border-border/50 overflow-hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <nav className="section-container py-6 space-y-2">
              {/* Welcome Banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/5 to-accent-gold/10 border border-primary/20"
              >
                <p className="text-sm font-medium text-foreground">
                  👋 Dobrodošli na <span className="text-primary font-semibold">Žensku Pijacu</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Otkrijte jedinstvene proizvode domaćih proizvođača
                </p>
              </motion.div>

              {/* First links with icons */}
              {navLinks.slice(0, 2).map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  className="flex items-center gap-3 py-4 px-5 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {link.name === "Početna" && <span className="text-lg">🏠</span>}
                    {link.name === "Proizvodi" && <span className="text-lg">🛍️</span>}
                  </div>
                  <span>{link.name}</span>
                </motion.a>
              ))}
              
              {/* Mobile Categories Menu */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <MobileCategoriesMenu onLinkClick={() => setIsMenuOpen(false)} />
              </motion.div>
              
              {/* Remaining links with icons */}
              {navLinks.slice(2).map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * (index + 3), duration: 0.3 }}
                  className="flex items-center gap-3 py-4 px-5 text-lg font-medium text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-300 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {link.name === "O nama" && <span className="text-lg">ℹ️</span>}
                    {link.name === "Kontakt" && <span className="text-lg">✉️</span>}
                  </div>
                  <span>{link.name}</span>
                </motion.a>
              ))}

              {/* Divider */}
              <div className="border-t border-border/50 my-4" />

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-2 px-2">
                <motion.a
                  href="/faq"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <span>❓</span>
                  <span>FAQ</span>
                </motion.a>
                <motion.a
                  href="/proizvodi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:bg-primary/90"
                >
                  <span>🛒</span>
                  <span>Kupovina</span>
                </motion.a>
              </div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4 pt-4 border-t border-border/30 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  🌿 Organski • Handmade • Lokalno
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.header>
  );
};

export default Header;