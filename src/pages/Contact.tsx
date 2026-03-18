import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Mensagem enviada! 🚀",
        description: "Agradecemos o contato. Responderemos o mais breve possível.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Fale Conosco</span>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 tracking-tight">
                Estamos aqui para <span className="text-gradient">te ouvir.</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Dúvidas, sugestões ou apenas quer dizer um oi? Preencha o formulário abaixo ou utilize um de nossos canais oficiais.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-8"
              >
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-6">Informações</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">E-mail</p>
                        <a href="mailto:contato@vamosjuntasclub.com.br" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          contato@vamosjuntasclub.com.br
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                        <a href="https://wa.me/5579991234567" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          (79) 99123-4567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Instagram className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Instagram</p>
                        <a href="https://instagram.com/vamosjuntasclub" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          @vamosjuntasclub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-primary-foreground">
                  <h3 className="text-xl font-heading font-bold mb-4">Faça parte agora!</h3>
                  <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                    Não perca a chance de transformar sua vida e expandir seu networking em um ambiente acolhedor.
                  </p>
                  <Button variant="secondary" className="w-full rounded-full h-12 font-bold shadow-lg" asChild>
                    <a href="/#planos">Ver Planos <ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground ml-1">Nome Completo</label>
                      <Input 
                        id="name" 
                        placeholder="Como podemos te chamar?" 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        required
                        className="rounded-2xl h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground ml-1">E-mail</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="exemplo@email.com" 
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                        className="rounded-2xl h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-foreground ml-1">Assunto</label>
                    <Input 
                      id="subject" 
                      placeholder="Sobre o que você quer falar?" 
                      value={form.subject}
                      onChange={e => setForm({...form, subject: e.target.value})}
                      required
                      className="rounded-2xl h-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground ml-1">Mensagem</label>
                    <Textarea 
                      id="message" 
                      placeholder="Escreva sua mensagem aqui..." 
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      required
                      className="rounded-3xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 transition-all resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 h-14 rounded-full gradient-primary border-0 text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg"
                  >
                    {isSubmitting ? "Enviando..." : (
                      <>Enviar Mensagem <Send className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
