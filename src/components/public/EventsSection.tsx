import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, X, Share2, CalendarPlus, Map } from "lucide-react";
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

  const pad = (n: number) => n.toString().padStart(2, '0');

  const addToGoogleCalendar = () => {
    try {
      const isAllDay = !event.time;
      // Tratar a data como local (ignorando fuso ao criar)
      const parts = event.date.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      let hours = 0;
      let minutes = 0;
      if (!isAllDay) {
        const timeParts = event.time.split(':');
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
      }
      
      const d = new Date(year, month, day, hours, minutes, 0);
      
      let startStr = "";
      let endStr = "";
      
      if (isAllDay) {
        startStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
        const endD = new Date(d);
        endD.setDate(endD.getDate() + 1);
        endStr = `${endD.getFullYear()}${pad(endD.getMonth() + 1)}${pad(endD.getDate())}`;
      } else {
        startStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
        const endD = new Date(d);
        endD.setHours(endD.getHours() + 1);
        endStr = `${endD.getFullYear()}${pad(endD.getMonth() + 1)}${pad(endD.getDate())}T${pad(endD.getHours())}${pad(endD.getMinutes())}00`;
      }

      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: event.title,
        details: event.description || "",
        location: event.mapsLink || event.location || "",
        dates: `${startStr}/${endStr}`,
      });

      window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank");
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível gerar o link da agenda.", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const text = `📅 ${event.title}\n🗓 ${formatDate(event.date)}${event.time ? ` às ${event.time}` : ""}\n📍 ${event.location || "Online"}\n\nConheça o Vamos Juntas Club!`;
    const urlText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${urlText}`, '_blank');
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
          <div className="flex flex-col gap-3">
            <Button
              onClick={addToGoogleCalendar}
              className="w-full gradient-primary border-0 text-primary-foreground rounded-full h-11 font-semibold shadow-md shadow-primary/20 text-sm"
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Adicionar à Agenda
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={() => handleShare()}
                variant="outline"
                className="w-full rounded-full h-11 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              >
                <Share2 className="h-4 w-4 mr-2" /> Compartilhar no WhatsApp
              </Button>
            </div>
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
  const [filterMonth, setFilterMonth] = useState<string>("Todos");

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const getDay = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr + "T00:00:00").getDate().toString().padStart(2, "0");
  };

  const getMonthShort = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", { month: "short" }).substring(0, 3);
  };

  const categoryColors: Record<string, string> = {
    "Social": "text-primary bg-primary/10",
    "Workshop": "text-accent bg-accent/10",
    "Clube do Livro": "text-yellow-600 bg-yellow-500/10",
  };

  const upcomingEvents = events.filter(e => new Date(e.date + "T00:00:00") >= new Date(new Date().setHours(0,0,0,0)));
  
  const uniqueMonths = Array.from(
    new Set(upcomingEvents.map(e => getMonthYear(e.date)).filter(Boolean))
  );

  const filteredEvents = filterMonth === "Todos" 
    ? upcomingEvents 
    : upcomingEvents.filter(e => getMonthYear(e.date) === filterMonth);

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

        {uniqueMonths.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <Button 
              variant={filterMonth === "Todos" ? "default" : "outline"} 
              onClick={() => setFilterMonth("Todos")}
              className={`rounded-full h-9 px-5 text-xs font-semibold transition-all ${filterMonth === 'Todos' ? 'gradient-primary border-0 text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Todos
            </Button>
            {uniqueMonths.map(m => (
              <Button 
                key={m} 
                variant={filterMonth === m ? "default" : "outline"} 
                onClick={() => setFilterMonth(m)}
                className={`rounded-full h-9 px-5 text-xs font-semibold capitalize transition-all ${filterMonth === m ? 'gradient-primary border-0 text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m}
              </Button>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
              onClick={() => setSelectedEvent(event)}
              className="group bg-card rounded-2xl border border-border/60 p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer flex items-center gap-4 relative overflow-hidden"
            >
              {/* Left calendar block */}
              <div className="flex flex-col items-center justify-center bg-muted/50 rounded-xl w-[3.5rem] h-[3.5rem] shrink-0 border border-border/50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                <span className="text-[9px] font-bold text-primary uppercase leading-none mb-1 tracking-wider">{getMonthShort(event.date)}</span>
                <span className="text-xl font-heading font-black text-foreground leading-none">{getDay(event.date)}</span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 py-0.5">
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${categoryColors[event.category] ? categoryColors[event.category].split(' ')[0] : "text-muted-foreground"}`}>
                  {event.category}
                </p>
                <h3 className="text-sm font-heading font-bold text-foreground truncate mb-1.5 leading-tight">{event.title}</h3>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {event.time && <span className="flex items-center gap-1 shrink-0"><Clock className="h-3 w-3" /> {event.time}</span>}
                  {event.location && <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{event.location}</span></span>}
                </div>
              </div>

              {/* Action */}
              {event.mapsLink && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0 z-10 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.mapsLink, "_blank");
                  }}
                  title="Como Chegar"
                >
                  <Map className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
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
