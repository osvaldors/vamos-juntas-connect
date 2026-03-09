import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { events } = useData();

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const categoryColors: Record<string, string> = {
    "Social": "bg-primary/10 text-primary",
    "Workshop": "bg-accent/10 text-accent",
    "Clube do Livro": "bg-gold/10 text-gold",
  };

  return (
    <section id="eventos" className="py-28 bg-muted relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Agenda</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Próximos <span className="text-gradient">Eventos</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6 pb-3">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || "bg-secondary text-secondary-foreground"}`}>
                  {event.category}
                </span>
              </div>
              <div className="px-6 pb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4 leading-snug">{event.title}</h3>
                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Button variant="ghost" className="mt-5 text-primary hover:text-primary p-0 h-auto font-semibold text-sm group-hover:gap-3 transition-all">
                  Ver detalhes <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">Novos eventos em breve! Fique ligada.</p>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
