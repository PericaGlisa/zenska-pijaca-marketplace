import { motion } from "framer-motion";
import { Heart, Leaf, Users, Award, Target, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logoImage from "@/assets/logo-zenska-pijaca.png";
import SEOHead from "@/components/SEOHead";

const values = [
  {
    icon: Heart,
    title: "Sa Ljubavlju",
    description:
      "Svaki proizvod koji nudimo izrađen je sa ljubavlju i posvećenošću. Verujemo da se ta energija prenosi na krajnjeg kupca.",
  },
  {
    icon: Leaf,
    title: "Prirodni Sastojci",
    description:
      "Podržavamo proizvođače koji koriste prirodne, organske sastojke bez štetnih hemikalija i aditiva.",
  },
  {
    icon: Users,
    title: "Podrška Zajednici",
    description:
      "Naša misija je osnažiti žene preduzetnice i lokalne proizvođače kroz direktan pristup tržištu.",
  },
  {
    icon: Award,
    title: "Garantovan Kvalitet",
    description:
      "Svi naši proizvođači prolaze kroz rigoroznu proveru kvaliteta pre nego što postanu deo naše platforme.",
  },
];

const stats = [
  { value: "50+", label: "Proizvođača" },
  { value: "100+", label: "Proizvoda" },
  { value: "10", label: "Kategorija" },
  { value: "100%", label: "Domaće" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="O Nama"
        description="Ženska Pijaca je platforma koja povezuje talentovane žene preduzetnice i lokalne proizvođače sa kupcima koji cene autentičnost, kvalitet i tradiciju."
        url="https://zenskapijaca.rs/o-nama"
      />
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="section-container mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                O Nama
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                <strong>Ženska Pijaca</strong> je platforma koja povezuje talentovane
                žene preduzetnice i lokalne proizvođače sa kupcima koji cene
                autentičnost, kvalitet i tradiciju.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nastali smo iz želje da stvorimo prostor gde domaći proizvodi
                dobijaju zasluženu pažnju, a žene preduzetnice priliku da svoje
                talente pretvore u održiv posao.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Svaki proizvod na našoj platformi nosi priču o tradiciji, ljubavi
                i posvećenosti. Mi smo tu da tu priču podelimo sa vama.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
                <img
                  src={logoImage}
                  alt="Ženska Pijaca Logo"
                  className="relative w-80 h-80 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/50 py-16 mb-20">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-container mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Naša Misija</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Osnažujemo Žene Preduzetnice
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Verujemo da svaka žena ima potencijal da pretvori svoju strast u
              uspešan posao. Naša platforma pruža alate, podršku i pristup
              tržištu koji su potrebni za taj put. Zajedno gradimo zajednicu
              koja ceni tradiciju, kvalitet i autentičnost.
            </p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="section-container mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold">Naše Vrednosti</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Šta Nas Pokreće
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-product p-6 text-center group hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Želite postati deo naše priče?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Bilo da ste proizvođač koji traži novi kanal prodaje ili kupac koji
              ceni kvalitet - dobrodošli ste!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/kontakt" className="btn-primary">
                Kontaktirajte Nas
              </a>
              <a href="/proizvodi" className="btn-secondary">
                Pregledaj Proizvode
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
