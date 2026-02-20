import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GymRatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="h-7 w-7 text-primary" />
          </div>
          <p className="font-accent italic text-primary text-lg mb-2">Mexa-se com a gente</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Desafio <span className="text-gradient">GymRats</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Participe do nosso desafio fitness! Treine, compartilhe sua evolução e conquiste resultados incríveis juntas com a comunidade.
          </p>
          <Button
            size="lg"
            className="gradient-warm border-0 text-primary-foreground rounded-full px-8 shadow-lg"
            asChild
          >
            <a href="https://invoice.infinitepay.io/plans/sabrinaviiana/3bkeafYhSv" target="_blank" rel="noopener noreferrer">
              Participar do Desafio <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GymRatsSection;
