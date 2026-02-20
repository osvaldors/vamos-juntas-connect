import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
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
  const savings = isAnnual ? "Economize 22% — equivale a R$ 23,32/mês" : null;

  return (
    <section id="planos" className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Faça parte</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Nossos <span className="text-gradient">Planos</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Escolha o plano ideal para você e comece a fazer parte da nossa comunidade.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-2 mb-10"
        >
          <div className="inline-flex items-center rounded-full bg-muted p-1 shadow-sm border border-border/60">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                !isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Anual
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
            <span>
              {isAnnual
                ? "Plano anual selecionado — melhor custo-benefício"
                : "Pague mês a mês ou economize escolhendo o plano anual"}
            </span>
            {isAnnual && (
              <span className="text-[10px] sm:text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                -22% OFF
              </span>
            )}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-8 text-center"
        >
          <div className="mb-6">
            <span className="text-5xl font-heading font-extrabold text-foreground">{price}</span>
            <span className="text-muted-foreground text-sm">{period}</span>
          </div>
          {savings && (
            <p className="text-xs text-primary font-medium mb-6">{savings}</p>
          )}

          <ul className="space-y-3 mb-8 text-left max-w-xs mx-auto">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary shrink-0" />
                {f}
              </li>
            ))}
            {isAnnual &&
              annualExtras.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
          </ul>

          <Button
            size="lg"
            className="w-full rounded-full gradient-primary border-0 text-primary-foreground shadow-lg"
          >
            Assinar Agora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
