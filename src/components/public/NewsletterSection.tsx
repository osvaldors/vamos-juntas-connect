import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "Inscrição realizada! 💌", description: "Você receberá nossas novidades em breve." });
      setEmail("");
    }
  };

  return (
    <section id="contato" className="py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4 tracking-tight">
            Fique conectada
          </h2>
          <p className="text-primary-foreground/80 mb-10 text-lg">
            Inscreva-se na nossa newsletter e fique por dentro de eventos, leituras e novidades do clube.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1 h-12 px-5 backdrop-blur-sm focus-visible:ring-primary-foreground/50"
            />
            <Button type="submit" size="lg" className="rounded-full px-8 bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shadow-lg shrink-0 h-12 font-semibold">
              Inscrever <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
