import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminEvents = () => {
  const { toast } = useToast();
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", category: "", description: "" });

  const openNew = () => { setEditingId(null); setForm({ title: "", date: "", time: "", location: "", category: "", description: "" }); setOpen(true); };

  const openEdit = (e: typeof events[0]) => {
    setEditingId(e.id);
    setForm({ title: e.title, date: e.date, time: e.time, location: e.location, category: e.category, description: e.description });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        toast({ title: "Evento atualizado!" });
      } else {
        await addEvent(form);
        toast({ title: "Evento adicionado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Erro ao salvar evento",
        description: err?.message || "Verifique as permissões no Supabase.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      toast({ title: "Evento removido!" });
    } catch (err: any) {
      toast({
        title: "Erro ao remover evento",
        description: err?.message || "Verifique as permissões no Supabase.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">Eventos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full"><Plus className="h-4 w-4 mr-2" /> Novo Evento</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Editar Evento" : "Novo Evento"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Título do evento" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <Input placeholder="Local" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Textarea placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <Button onClick={handleSave} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">{event.category}</span>
              </div>
              <p className="font-heading font-semibold text-foreground">{event.title}</p>
              <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(event.date)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(event)}><Edit2 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(event.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
