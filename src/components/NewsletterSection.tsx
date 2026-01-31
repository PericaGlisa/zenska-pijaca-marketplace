import { Send, Gift, Sparkles, Check, Mail, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import FloatingElements from "./FloatingElements";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.sendEmail("newsletter", { email });

      setIsSubmitted(true);
      setEmail("");
      
      toast({
        title: "Uspešno ste se prijavili!",
        description: "Hvala vam što ste se pridružili našoj zajednici.",
      });

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      console.error("Newsletter signup error:", err);
      toast({
        title: "Greška",
        description: "Došlo je do greške. Pokušajte ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0" 
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 40%, hsl(var(--accent-brown)) 100%)"
        }}
      />
      
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[400px] sm:w-[500px] md:w-[700px] h-[400px] sm:h-[500px] md:h-[700px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.4), transparent)" }}
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 5, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[500px] sm:w-[700px] md:w-[900px] h-[500px] sm:h-[700px] md:h-[900px] rounded-full translate-x-1/2 translate-y-1/2"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.3), transparent)" }}
      />

      {/* Floating Elements - hide on very small screens */}
      <div className="hidden sm:block">
        <FloatingElements variant="festive" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-effect" />

      <div className="section-container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center px-4"
        >
          {/* Decorative stars */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 200 }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-accent text-accent" />
              </motion.div>
            ))}
          </div>

          {/* Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 md:mb-10 shadow-2xl relative"
            style={{
              background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-gold)) 100%)"
            }}
          >
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent-foreground" />
            <motion.div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 hsl(var(--accent) / 0.4)",
                  "0 0 0 20px hsl(var(--accent) / 0)",
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Content */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-primary-foreground mb-4 sm:mb-6"
          >
            Pridružite se Našoj{" "}
            <span className="text-accent">Zajednici</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-primary-foreground/80 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Prijavite se na newsletter i budite prvi koji će saznati za nove proizvode, 
            posebne ponude i priče naših proizvođača.
          </motion.p>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto"
          >
            <motion.div 
              className={`flex-1 relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}
            >
              <input
                type="email"
                placeholder="Vaša email adresa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                disabled={isSubmitting}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl text-foreground placeholder:text-muted-foreground bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all duration-300 outline-none text-base sm:text-lg shadow-xl disabled:opacity-50"
              />
              <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/70" />
              <motion.div
                animate={isFocused ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </motion.div>
            </motion.div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-accent px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap shadow-2xl min-w-[140px] sm:min-w-[180px] disabled:opacity-50"
            >
              {isSubmitted ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                  Prijavljeno!
                </>
              ) : isSubmitting ? (
                "Slanje..."
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Prijavi se
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Trust Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-primary-foreground/60 text-xs sm:text-sm mt-6 sm:mt-8 md:mt-10"
          >
            {[
              { icon: Check, text: "Bez spama" },
              { icon: Check, text: "Otkazivanje bilo kad" },
              { icon: Gift, text: "Ekskluzivne ponude" },
            ].map((item) => (
              <motion.span 
                key={item.text}
                className="flex items-center gap-1.5 sm:gap-2"
                whileHover={{ scale: 1.05, color: "hsl(var(--accent))" }}
              >
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                {item.text}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
