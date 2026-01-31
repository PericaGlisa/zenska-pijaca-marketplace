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
          "Ženska Pijaca je online platforma koja povezuje kupce sa lokalnim proizvođačima i ženama preduzetnicama. Nudimo autentične, ručno izrađene i domaće proizvode direktno od proizvođača.",
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
          "Nudimo dostavu na teritoriji cele Srbije putem kurirske službe. Dostava obično traje 2-5 radnih dana, zavisno od lokacije. Za Beograd je moguća i lična dostava.",
      },
      {
        question: "Koliko košta dostava?",
        answer:
          "Cena dostave zavisi od težine paketa i destinacije. Za narudžbine preko 5000 RSD, dostava je besplatna. Tačnu cenu dostave možete videti prilikom naručivanja.",
      },
      {
        question: "Koje načine plaćanja prihvatate?",
        answer:
          "Trenutno prihvatamo plaćanje pouzećem (gotovina pri preuzimanju). Uskoro ćemo omogućiti i online plaćanje karticama.",
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
      {
        question: "Da li proizvodi imaju rok trajanja?",
        answer:
          "Da, svi prehrambeni proizvodi imaju jasno istaknut rok trajanja. Preporučujemo da proverite rok trajanja prilikom prijema i da proizvode čuvate prema uputstvima proizvođača.",
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
        question: "Koje su naknade za proizvođače?",
        answer:
          "Uzimamo malu proviziju od svake prodaje koja pokriva troškove platforme, marketinga i podrške. Tačni uslovi se dogovaraju individualno sa svakim proizvođačem.",
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
