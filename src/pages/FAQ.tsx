import { motion } from "framer-motion";
import { HelpCircle, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Opšta Pitanja",
    questions: [
      {
        question: "Šta je Ženska Pijaca?",
        answer:
          "Ženska Pijaca je online platforma koja povezuje kupce sa lokalnim proizvođačima i poljoprivrednicama. Nudimo autentične, ručno izrađene i domaće proizvode direktno od proizvođača. Žensko udruženje Kolubarskog okruga pokrenulo je platformu koja povezuje poljoprivrednice i kupce i omogućava prodaju domaćih proizvoda. Udruženje u okviru platforme pruža isključivo posredničke usluge koje su u potpunosti besplatne i ne naplaćuje korišćenje platforme niti učestvuje u zaradi od prodaje proizvoda.",
      },
      {
        question: "Kako funkcioniše naručivanje?",
        answer:
          "Naručivanje je jednostavno: izaberite proizvode koje želite, dodajte ih u korpu, unesite podatke za dostavu i potvrdite narudžbinu. Primićete email potvrdu sa svim detaljima.",
      },
      {
        question: "Da li su svi proizvodi zaista domaći?",
        answer:
          "Da! Svi proizvodi na našoj platformi dolaze od proverenih lokalnih proizvođača. Svaki proizvođač prolazi kroz proces verifikacije pre nego što postane deo naše zajednice.",
      },
    ],
  },
  {
    title: "Dostava i Plaćanje",
    questions: [
      {
        question: "Koje su opcije dostave?",
        answer:
          "Nudimo ličnu dostavu na teritoriji celog Beograda, koja se realizuje vikendom u organizaciji Ženske pijace. Kupci u petak ili subotu dobijaju poruku na ostavljeni broj telefona sa okvirnim vremenom isporuke. Ova vrsta dostave predstavlja direktnu podršku radu zajednice, jer se njenim plaćanjem podržava dalji razvoj i rad Ženske pijace. Za zimnice i proizvode koji nisu brzo kvarljivi dostupna je i dostava putem brzih pošta, kao i drugih vidova isporuke, u dogovoru sa kupcima.",
      },
      {
        question: "Koliko košta dostava?",
        answer:
          "Cena dostave iznosi 300/350/400 dinara u zavisnosti od destinacije, odnosno lokacije na kojoj se vrši isporuka. Cena dostave je fiksna i ne povećava se u slučaju veće količine ili kilaže poručene robe.",
      },
      {
        question: "Koje načine plaćanja prihvatate?",
        answer:
          "Plaćanje je moguće gotovinom pri preuzimanju ili karticama putem POS terminala.",
      },
    ],
  },
  {
    title: "Proizvodi i Kvalitet",
    questions: [
      {
        question: "Kako garantujete kvalitet proizvoda?",
        answer:
          "Svi naši proizvođači prolaze kroz rigoroznu proveru pre nego što postanu deo platforme. Takođe, pratimo povratne informacije kupaca i redovno komuniciramo sa proizvođačima.",
      },
      {
        question: "Šta ako nisam zadovoljan/na proizvodom?",
        answer:
          "Vaše zadovoljstvo nam je prioritet. Ako niste zadovoljni proizvodom, kontaktirajte nas u roku od 7 dana od prijema i zajedno ćemo pronaći rešenje - zamenu ili povrat novca.",
      },
    ],
  },
  {
    title: "Za Proizvođače",
    questions: [
      {
        question: "Kako mogu postati proizvođač na platformi?",
        answer:
          "Kontaktirajte nas putem email-a info@zenskapijaca.rs sa informacijama o vašim proizvodima. Nakon pregleda, zakazaćemo razgovor i objasniti vam uslove saradnje.",
      },
      {
        question: "Da li mogu sam/a određivati cene?",
        answer:
          "Da, vi kao proizvođač određujete maloprodajnu cenu svojih proizvoda. Mi ćemo vam pomoći sa savetima o optimalnom pozicioniranju na tržištu.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Često Postavljana Pitanja"
        description="Pronađite odgovore na najčešća pitanja o Ženskoj Pijaci: naručivanje, dostava, plaćanje, proizvodi, povrat i kako postati deo naše zajednice proizvođača."
        url="https://zenskapijaca.rs/faq"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Pomoć i Podrška</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Često Postavljana Pitanja
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pronađite odgovore na najčešća pitanja o našoj platformi,
              proizvodima i naručivanju
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <div className="max-w-3xl mx-auto space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="card-product p-6"
              >
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, questionIndex) => (
                    <AccordionItem
                      key={questionIndex}
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border-border/50"
                    >
                      <AccordionTrigger className="text-left hover:text-primary transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12"
          >
            <div className="card-product p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                Niste pronašli odgovor?
              </h3>
              <p className="text-muted-foreground mb-6">
                Naš tim za podršku je tu da vam pomogne. Slobodno nas
                kontaktirajte sa bilo kojim pitanjem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/kontakt"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Kontaktirajte Nas
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="mailto:info@zenskapijaca.rs"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  info@zenskapijaca.rs
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
