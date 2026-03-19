import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, X, Share2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData, AppEvent } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

const EventModal = ({ event, onClose }: { event: AppEvent; onClose: () => void }) => {
  const { toast } = useToast();

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  };

  const formatDateForGoogle = (date: string, time: string) => {
    const d = new Date(`${date}T${time || "00:00"}:00`);
    return d.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const addToGoogleCalendar = () => {
    const startDate = formatDateForGoogle(event.date, event.time);
    // Add 1 hour as default duration
    const endD = new Date(`${event.date}T${event.time || "00:00"}:00`);
    endD.setHours(endD.getHours() + 1);
    const endDate = endD.toISOString().replace(/-|:|\.\d{3}/g, "");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      details: event.description || "",
      location: event.location || "",
      dates: `${startDate}/${endDate}`,
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank");
  };

  const handleShare = async () => {
    const text = `📅 ${event.title}\n🗓 ${formatDate(event.date)}${event.time ? ` às ${event.time}` : ""}\n📍 ${event.location || ""}\n\nVamos Juntas Club`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Evento copiado!", description: "Informações copiadas para a área de transferência." });
    }
  };

  const categoryColors: Record<string, string> = {
    "Social": "bg-primary/10 text-primary",
    "Workshop": "bg-accent/10 text-accent",
    "Clube do Livro": "bg-yellow-500/10 text-yellow-700",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-md overflow-hidden z-10"
      >
        {/* Header strip */}
        <div className="gradient-primary h-2 w-full" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-muted hover:bg-border transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7">
          {/* Category badge */}
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || "bg-secondary text-secondary-foreground"}`}>
            {event.category}
          </span>

          {/* Title */}
          <h3 className="text-2xl font-heading font-bold text-foreground mt-4 mb-6 leading-snug pr-8">
            {event.title}
          </h3>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Data</p>
                <p className="text-sm font-medium text-foreground capitalize">{formatDate(event.date)}</p>
              </div>
            </div>

            {event.time && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Horário</p>
                  <p className="text-sm font-medium text-foreground">{event.time}</p>
                </div>
              </div>
            )}

            {event.location && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">Local</p>
                  <p className="text-sm font-medium text-foreground">{event.location}</p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="bg-muted rounded-2xl p-4 mt-2">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1.5">Sobre o Evento</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={addToGoogleCalendar}
              className="flex-1 gradient-primary border-0 text-primary-foreground rounded-full h-11 font-semibold shadow-md shadow-primary/20 text-sm"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Agenda Google
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="rounded-full h-11 px-4"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { events } = useData();
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const categoryColors: Record<string, string> = {
    "Social": "bg-primary/10 text-primary",
    "Workshop": "bg-accent/10 text-accent",
    "Clube do Livro": "bg-yellow-500/10 text-yellow-700",
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
              onClick={() => setSelectedEvent(event)}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
                <Button variant="ghost" className="mt-5 text-primary hover:text-primary p-0 h-auto font-semibold text-sm group-hover:gap-3 transition-all pointer-events-none">
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

      <AnimatePresence>
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
