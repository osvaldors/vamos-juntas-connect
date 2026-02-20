import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send } from "lucide-react";
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
    <section id="contato" className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Fique conectada</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Receba nossas <span className="text-gradient">novidades</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Inscreva-se na nossa newsletter e fique por dentro de eventos, leituras e novidades do clube.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-full bg-card border-border flex-1"
            />
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground rounded-full px-6 shrink-0">
              <Send className="h-4 w-4 mr-2" />
              Inscrever
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
