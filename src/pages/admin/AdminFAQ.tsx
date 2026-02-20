import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminFAQ = () => {
  const { toast } = useToast();
  const { faqs, addFaq, updateFaq, deleteFaq } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });

  const openNew = () => { setEditingId(null); setForm({ question: "", answer: "" }); setOpen(true); };

  const openEdit = (f: typeof faqs[0]) => {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    try {
      if (editingId) {
        await updateFaq(editingId, form);
        toast({ title: "FAQ atualizada!" });
      } else {
        await addFaq(form);
        toast({ title: "FAQ adicionada!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Erro ao salvar FAQ",
        description: err?.message || "Verifique as permissões no Supabase.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq(id);
      toast({ title: "FAQ removida!" });
    } catch (err: any) {
      toast({
        title: "Erro ao remover FAQ",
        description: err?.message || "Verifique as permissões no Supabase.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">FAQ</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full"><Plus className="h-4 w-4 mr-2" /> Nova Pergunta</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Editar FAQ" : "Nova FAQ"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Pergunta" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              <Textarea placeholder="Resposta" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
              <Button onClick={handleSave} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-heading font-semibold text-foreground text-sm">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(faq)}><Edit2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(faq.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFAQ;
