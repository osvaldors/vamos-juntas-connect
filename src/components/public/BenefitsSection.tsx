import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, Dumbbell, ArrowRight, Ticket, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: ShoppingBag,
    title: "Nossa Lojinha",
    description: "Produtos exclusivos do Vamos Juntas Club para te acompanhar nos encontros e momentos de autocuidado.",
    link: "https://loja.infinitepay.io/sabrinaviiana",
    cta: "Visitar a Lojinha",
  },
  {
    icon: Dumbbell,
    title: "Desafio GymRats",
    description: "Um desafio fitness para você se movimentar, compartilhar evolução e se motivar com outras mulheres.",
    link: "https://invoice.infinitepay.io/plans/sabrinaviiana/3bkeafYhSv",
    cta: "Participar do Desafio",
  },
  {
    icon: Ticket,
    title: "Descontos Exclusivos",
    description: "Acesso a descontos especiais em lojas parceiras selecionadas só para membros do clube.",
    link: "#planos",
    cta: "Ver Descontos",
  },
  {
    icon: Gift,
    title: "Brindes & Surpresas",
    description: "Presentes especiais em datas comemorativas e sorteios exclusivos para membros ativas.",
    link: "#planos",
    cta: "Saiba Mais",
  },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-28 bg-muted relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-accent/5 blur-3xl translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Exclusivo</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Benefícios <span className="text-gradient">de ser membro</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">{item.description}</p>
              <Button
                size="sm"
                variant="ghost"
                className="self-start text-primary hover:text-primary p-0 h-auto font-semibold text-sm group-hover:gap-3 transition-all"
                asChild
              >
                <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
