import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Calendar, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import bookClubImg from "@/assets/book-club.jpg";

const BookClubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { books } = useData();

  const currentBook = books.find((b) => b.status === "current") || books[0];

  const formatMeetingDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
  };

  if (!currentBook) return null;

  return (
    <section id="livro" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src={currentBook.coverUrl || bookClubImg}
                alt="Clube do Livro"
                className="rounded-2xl shadow-xl w-full aspect-square object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-foreground">45+ livros</p>
                  <p className="text-xs text-muted-foreground">lidos juntas</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-accent italic text-primary text-lg mb-2">Leitura do mês</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Clube do <span className="text-gradient">Livro</span>
            </h2>
            <div className="bg-card rounded-xl p-6 border border-border mb-6">
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                "{currentBook.title}"
              </h3>
              <p className="text-primary font-medium text-sm mb-3">{currentBook.author}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentBook.synopsis}
              </p>
              {currentBook.meetingDate && (
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Reunião: {formatMeetingDate(currentBook.meetingDate)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="gradient-primary border-0 text-primary-foreground rounded-full px-6">
                Participar do Clube <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {currentBook.buyLink && (
                <Button
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6"
                  asChild
                >
                  <a href={currentBook.buyLink} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Comprar o Livro
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookClubSection;
