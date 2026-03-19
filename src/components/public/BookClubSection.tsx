import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Calendar, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import bookClubImg from "@/assets/book-club.jpg";

const BookClubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { books, loading } = useData();

  const currentBook = books.find((b) => b.status === "current") || books[0];

  const formatMeetingDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
  };

  // Only hide section when we're done loading and have no books
  if (!loading && !currentBook) return null;

  return (
    <section id="livro" className="py-28 bg-card relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 gradient-primary rounded-3xl opacity-10 blur-2xl" />
              <img
                src={currentBook.coverUrl || bookClubImg}
                alt="Clube do Livro"
                className="rounded-2xl shadow-2xl w-full  object-cover relative z-10"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-border z-20"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-heading font-bold text-foreground">5+</p>
                  <p className="text-xs text-muted-foreground">livros lidos juntas</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Leitura do Mês</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 tracking-tight">
              Clube do <span className="text-gradient">Livro</span>
            </h2>
            <div className="bg-muted rounded-2xl p-6 mb-8">
              <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                "{currentBook.title}"
              </h3>
              <p className="text-primary font-medium text-sm mb-3">{currentBook.author}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {currentBook.synopsis}
              </p>
              {currentBook.meetingDate && (
                <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground bg-background rounded-xl px-4 py-2.5 w-fit">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Reunião: {formatMeetingDate(currentBook.meetingDate)}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="gradient-primary border-0 text-primary-foreground rounded-full px-7 shadow-md hover:shadow-lg transition-all hover:scale-105"
                asChild
              >
                <a href="https://invoice.infinitepay.io/plans/sabrinaviiana/1nsJkEdtfv" target="_blank" rel="noopener noreferrer">
                  Participar do Clube do Livro <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {currentBook.buyLink && (
                <Button
                  variant="outline"
                  className="rounded-full border-border text-foreground hover:bg-secondary px-7 transition-all"
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
