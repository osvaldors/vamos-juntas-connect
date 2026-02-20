import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShopSection = () => {
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
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <p className="font-accent italic text-primary text-lg mb-2">Exclusivo para você</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Nossa <span className="text-gradient">Lojinha</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Produtos exclusivos do Vamos Juntas Club pensados para mulheres que se apoiam e celebram juntas. Confira nossas peças!
          </p>
          <Button
            size="lg"
            className="gradient-primary border-0 text-primary-foreground rounded-full px-8 shadow-lg"
            asChild
          >
            <a href="https://loja.infinitepay.io/sabrinaviiana" target="_blank" rel="noopener noreferrer">
              Visitar a Lojinha <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopSection;
