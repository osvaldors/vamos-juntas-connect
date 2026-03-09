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
    { id: "f1", question: "Quem pode participar do Vamos Juntas Club?", answer: "Toda mulher que queira fazer parte de uma comunidade acolhedora, independente de idade, profissão ou cidade." },
    { id: "f2", question: "Como funcionam os encontros?", answer: "Realizamos encontros presenciais e/ou online, com temas variados como desenvolvimento pessoal, leitura e bem-estar." },
    { id: "f3", question: "A assinatura tem fidelidade?", answer: "Não. Você pode cancelar quando quiser diretamente pelo meio de pagamento utilizado na assinatura." },
  ];

  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section id="faq" className="py-28 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Dúvidas</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
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
                className="border border-border rounded-2xl px-6 bg-card data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-5 text-[15px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
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
