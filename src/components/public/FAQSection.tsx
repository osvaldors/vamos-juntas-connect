import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useData } from "@/contexts/DataContext";

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { faqs } = useData();

  const fallbackFaqs = [
    {
      id: "fallback-1",
      question: "Quem pode participar do Vamos Juntas Club?",
      answer: "Toda mulher que queira fazer parte de uma comunidade acolhedora, independente de idade, profissão ou cidade.",
    },
    {
      id: "fallback-2",
      question: "Como funcionam os encontros?",
      answer: "Realizamos encontros presenciais e/ou online, com temas variados como desenvolvimento pessoal, leitura e bem-estar.",
    },
    {
      id: "fallback-3",
      question: "A assinatura tem fidelidade?",
      answer: "Não. Você pode cancelar quando quiser diretamente pelo meio de pagamento utilizado na assinatura.",
    },
  ];

  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section id="faq" className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Tire suas dúvidas</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border rounded-xl px-5 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline text-sm md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
