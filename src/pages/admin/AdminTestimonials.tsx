import { useState } from "react";
import { Plus, Trash2, Edit2, Quote, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import type { Testimonial } from "@/contexts/DataContext";

const AdminTestimonials = () => {
  const { toast } = useToast();
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", text: "", isActive: true });
  const [isSaving, setIsSaving] = useState(false);

  const openNew = () => { 
    setEditingId(null); 
    setForm({ name: "", role: "", text: "", isActive: true }); 
    setOpen(true); 
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, role: t.role, text: t.text, isActive: t.isActive });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.text) {
      toast({ title: "Preencha nome e depoimento", variant: "destructive" });
      return;
    }
    try {
      setIsSaving(true);
      if (editingId) {
        await updateTestimonial(editingId, form);
        toast({ title: "Depoimento atualizado!" });
      } else {
        await addTestimonial(form);
        toast({ title: "Depoimento adicionado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Erro ao salvar depoimento", description: err?.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast({ title: "Depoimento removido!" });
    } catch (err: any) {
      toast({ title: "Erro ao remover depoimento", description: err?.message, variant: "destructive" });
    }
  };

  const toggleStatus = async (t: Testimonial) => {
    try {
      await updateTestimonial(t.id, { isActive: !t.isActive });
      toast({ title: `Depoimento ${!t.isActive ? 'ativado' : 'desativado'}!` });
    } catch (err: any) {
      toast({ title: "Erro ao alterar status", description: err?.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">Depoimentos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full">
              <Plus className="h-4 w-4 mr-2" /> Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Depoimento" : "Novo Depoimento"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Nome *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Cargo/Papel (ex: Membro desde 2021)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <Textarea placeholder="Depoimento *" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={5} />
              
              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-foreground">Depoimento Ativo (visível no site)</label>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card border border-border rounded-2xl">
            <Quote className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum depoimento cadastrado ainda.</p>
          </div>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-card border border-border rounded-xl p-5 shadow-sm transition-opacity ${!t.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-heading font-bold text-xs shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed line-clamp-4">"{t.text}"</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${t.isActive ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => toggleStatus(t)}>
                  {t.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover Depoimento?</AlertDialogTitle>
                      <AlertDialogDescription>Tem certeza que deseja remover o depoimento de {t.name}?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(t.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
