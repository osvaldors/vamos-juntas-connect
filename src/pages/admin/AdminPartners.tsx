import { useState } from "react";
import { Plus, Trash2, Edit2, Store, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AdminPartners = () => {
  const { toast } = useToast();
  const { partners, addPartner, updatePartner, deletePartner } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", category: "", description: "", website: "", discountCode: "", discountPercent: "", logoUrl: "", isActive: true });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openNew = () => { setEditingId(null); setForm({ name: "", category: "", description: "", website: "", discountCode: "", discountPercent: "", logoUrl: "", isActive: true }); setOpen(true); };

  const openEdit = (p: typeof partners[0]) => {
    setEditingId(p.id);
    setForm({ name: p.name, category: p.category, description: p.description, website: p.website, discountCode: p.discountCode, discountPercent: p.discountPercent, logoUrl: p.logoUrl, isActive: p.isActive });
    setOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `partners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-photos')
        .getPublicUrl(filePath);

      setForm({ ...form, logoUrl: publicUrl });
      toast({ title: "Logo carregado com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    try {
      setIsSaving(true);
      if (editingId) {
        await updatePartner(editingId, form);
        toast({ title: "Parceiro atualizado!" });
      } else {
        await addPartner(form);
        toast({ title: "Parceiro adicionado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Erro ao salvar parceiro", description: err?.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePartner(id);
      toast({ title: "Parceiro removido!" });
    } catch (err: any) {
      toast({ title: "Erro ao remover parceiro", description: err?.message, variant: "destructive" });
    }
  };

  const toggleActive = async (p: typeof partners[0]) => {
    try {
      await updatePartner(p.id, { isActive: !p.isActive });
      toast({ title: `Parceiro ${p.isActive ? "desativado" : "ativado"}!` });
    } catch (err: any) {
      toast({ title: "Erro ao alterar status", description: err?.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">Lojas Parceiras</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full"><Plus className="h-4 w-4 mr-2" /> Novo Parceiro</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Nome da loja *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <Textarea placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Código de desconto" value={form.discountCode} onChange={(e) => setForm({ ...form, discountCode: e.target.value })} />
                <Input placeholder="% desconto" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Logo da Loja</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {form.logoUrl ? <img src={form.logoUrl} alt="Preview" className="w-full h-full object-contain" /> : <Store className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="text-xs" />
                    <p className="text-[10px] text-muted-foreground mt-1">{isUploading ? "Enviando..." : "Upload de arquivo (PNG, JPG)"}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Checkbox id="isActive" checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked === true })} />
                <Label htmlFor="isActive" className="text-sm font-medium leading-none cursor-pointer">Parceria Ativa (exibir no site)</Label>
              </div>

              <Button onClick={handleSave} disabled={isSaving || isUploading} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Store className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum parceiro cadastrado ainda.</p>
          </div>
        )}
        {partners.map((partner) => (
          <div key={partner.id} className={`bg-card border rounded-xl p-5 transition-all ${partner.isActive ? "border-border" : "border-border opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} className="w-10 h-10 rounded-lg object-contain" /> : <Store className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(partner)}><Edit2 className="h-3.5 w-3.5" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover parceiro?</AlertDialogTitle>
                      <AlertDialogDescription>Tem certeza que deseja remover "{partner.name}"?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(partner.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1">{partner.name}</h3>
            {partner.category && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{partner.category}</span>}
            {partner.description && <p className="text-sm text-muted-foreground mt-2 mb-3">{partner.description}</p>}
            {partner.discountCode && (
              <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2 text-sm mt-2">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono font-semibold text-primary">{partner.discountCode}</span>
                <span className="text-muted-foreground">— {partner.discountPercent}</span>
              </div>
            )}
            <button onClick={() => toggleActive(partner)} className={`mt-3 text-xs px-2.5 py-1 rounded-full font-medium ${partner.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {partner.isActive ? "Ativo" : "Inativo"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPartners;
