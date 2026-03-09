import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Acesso a todos os eventos",
  "Clube do livro mensal",
  "Descontos exclusivos em parceiros",
  "Comunidade de membros",
  "Newsletter exclusiva",
];

const annualExtras = [
  "2 meses grátis",
  "Acesso prioritário a eventos",
  "Brindes exclusivos",
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isAnnual, setIsAnnual] = useState(false);

  const price = isAnnual ? "R$ 279,90" : "R$ 29,90";
  const period = isAnnual ? "/ano" : "/mês";

  return (
    <section id="planos" className="py-28 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 gradient-soft opacity-50" />
      
      <div className="container mx-auto px-4 max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Investimento</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight">
            Escolha seu <span className="text-gradient">plano</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Invista em você e faça parte da comunidade que mais cresce.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="inline-flex items-center rounded-full bg-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                !isAnnual
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                isAnnual
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
            </button>
          </div>
          {isAnnual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full"
            >
              <Sparkles className="h-3 w-3" /> Economize 22%
            </motion.span>
          )}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-3xl border border-border bg-card p-10 text-center relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
          
          <div className="mb-8">
            <span className="text-5xl md:text-6xl font-heading font-extrabold text-foreground tracking-tight">{price}</span>
            <span className="text-muted-foreground text-base ml-1">{period}</span>
          </div>
          {isAnnual && (
            <p className="text-xs text-primary font-medium mb-8">Equivale a R$ 23,32/mês</p>
          )}

          <ul className="space-y-4 mb-10 text-left max-w-xs mx-auto">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                {f}
              </li>
            ))}
            {isAnnual &&
              annualExtras.map((f) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <span className="font-medium">{f}</span>
                </motion.li>
              ))}
          </ul>

          <Button
            size="lg"
            className="w-full rounded-full gradient-primary border-0 text-primary-foreground shadow-lg text-base hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            Assinar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
