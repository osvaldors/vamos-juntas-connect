import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Para viver o clube no dia a dia</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Benefícios <span className="text-gradient">exclusivos</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Nossa Lojinha</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Produtos oficiais do Vamos Juntas Club, pensados para te acompanhar nos encontros, leituras e momentos de autocuidado.
            </p>
            <Button
              size="sm"
              className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <a href="https://loja.infinitepay.io/sabrinaviiana" target="_blank" rel="noopener noreferrer">
                Visitar a Lojinha <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-4">
              <Dumbbell className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">Desafio GymRats</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Um desafio fitness para você se movimentar, compartilhar sua evolução e se motivar com outras mulheres da comunidade.
            </p>
            <Button
              size="sm"
              className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <a href="https://invoice.infinitepay.io/plans/sabrinaviiana/3bkeafYhSv" target="_blank" rel="noopener noreferrer">
                Participar do Desafio <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

