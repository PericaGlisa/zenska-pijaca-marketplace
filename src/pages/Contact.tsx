import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/SEOHead";
const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@zenskapijaca.rs",
    href: "mailto:info@zenskapijaca.rs",
  },
  {
    icon: Phone,
    title: "Telefon",
    value: "+381 60 123 4567",
    href: "tel:+381601234567",
  },
  {
    icon: MapPin,
    title: "Lokacija",
    value: "Beograd, Srbija",
    href: "#",
  },
  {
    icon: Clock,
    title: "Radno Vreme",
    value: "Pon - Pet: 9:00 - 17:00",
    href: "#",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-contact", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Poruka poslata!",
        description: "Hvala vam na poruci. Odgovorićemo vam u najkraćem roku.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom slanja poruke. Pokušajte ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Kontakt"
        description="Kontaktirajte Žensku Pijacu. Imate pitanje, sugestiju ili želite postati deo naše zajednice proizvođača? Javite nam se!"
        url="https://zenska-pijaca.rs/kontakt"
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
              Kontaktirajte Nas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Imate pitanje, sugestiju ili želite postati deo naše zajednice?
              Rado ćemo vam pomoći!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="card-product p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold text-foreground">
                      Pošaljite Poruku
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Odgovaramo u roku od 24 sata
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ime i Prezime</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Vaše ime"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vasa@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tema</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="O čemu se radi?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Poruka</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Vaša poruka..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Slanje..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Pošalji Poruku
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="card-product p-6">
                <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                  Kontakt Informacije
                </h2>
                <div className="space-y-5">
                  {contactInfo.map((info) => (
                    <a
                      key={info.title}
                      href={info.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {info.title}
                        </p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* For Producers */}
              <div className="card-product p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                  Za Proizvođače
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Želite prodavati svoje proizvode na našoj platformi? Javite nam
                  se i saznajte više o uslovima saradnje.
                </p>
                <a
                  href="mailto:info@zenskapijaca.rs"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  info@zenskapijaca.rs
                </a>
              </div>

              {/* FAQ Link */}
              <div className="card-product p-6">
                <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                  Često Postavljana Pitanja
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Možda odgovor na vaše pitanje već postoji u našoj FAQ sekciji.
                </p>
                <a href="/faq" className="btn-secondary inline-block">
                  Pogledaj FAQ
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
