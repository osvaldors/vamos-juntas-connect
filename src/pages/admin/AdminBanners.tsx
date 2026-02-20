import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminBanners = () => {
  const { toast } = useToast();
  const { banners, addBanner, updateBanner, deleteBanner } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", cta: "" });

  const openNew = () => {
    setEditingId(null);
    setForm({ title: "", subtitle: "", imageUrl: "", cta: "" });
    setOpen(true);
  };

  const openEdit = (b: typeof banners[0]) => {
    setEditingId(b.id);
    setForm({ title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl, cta: b.cta });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) return;
    if (editingId) {
      await updateBanner(editingId, form);
      toast({ title: "Banner atualizado!" });
    } else {
      await addBanner(form);
      toast({ title: "Banner adicionado!" });
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteBanner(id);
    toast({ title: "Banner removido!" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground">Banners do Hero</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full">
              <Plus className="h-4 w-4 mr-2" /> Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Banner" : "Novo Banner"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Subtítulo" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <Input placeholder="URL da imagem" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <Input placeholder="Texto do botão (CTA)" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
              <Button onClick={handleSave} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-heading font-semibold text-foreground">{banner.title}</p>
              <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}><Edit2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
