import { useState } from "react";
import { Plus, Trash2, Edit2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminBanners = () => {
  const { toast } = useToast();
  const { banners, addBanner, updateBanner, deleteBanner } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", imageUrl: "", cta: "" });
  const [isSaving, setIsSaving] = useState(false);

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
    if (!form.title) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }
    try {
      setIsSaving(true);
      if (editingId) {
        await updateBanner(editingId, form);
        toast({ title: "Banner atualizado!" });
      } else {
        await addBanner(form);
        toast({ title: "Banner adicionado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Erro ao salvar banner", description: err?.message || "Verifique as permissões.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
      toast({ title: "Banner removido!" });
    } catch (err: any) {
      toast({ title: "Erro ao remover banner", description: err?.message, variant: "destructive" });
    }
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
              <Input placeholder="Título *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Subtítulo" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <Input placeholder="URL da imagem" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <Input placeholder="Texto do botão (CTA)" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
              <Button onClick={handleSave} disabled={isSaving} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {banners.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum banner cadastrado ainda.</p>
          </div>
        )}
        {banners.map((banner) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {banner.imageUrl && (
                <img src={banner.imageUrl} alt={banner.title} className="w-16 h-10 rounded-lg object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-heading font-semibold text-foreground truncate">{banner.title}</p>
                <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}><Edit2 className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover banner?</AlertDialogTitle>
                    <AlertDialogDescription>Tem certeza que deseja remover "{banner.title}"?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(banner.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
