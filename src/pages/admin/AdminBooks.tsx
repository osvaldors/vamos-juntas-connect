import { useState } from "react";
import { Plus, Trash2, Edit2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useData, Book } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

const AdminBooks = () => {
  const { toast } = useToast();
  const { books, addBook, updateBook, deleteBook } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", author: "", synopsis: "", meetingDate: "", buyLink: "", coverUrl: "", status: "current" as Book["status"] });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openNew = () => { setEditingId(null); setForm({ title: "", author: "", synopsis: "", meetingDate: "", buyLink: "", coverUrl: "", status: "current" }); setOpen(true); };

  const openEdit = (b: Book) => {
    setEditingId(b.id);
    setForm({ title: b.title, author: b.author, synopsis: b.synopsis, meetingDate: b.meetingDate, buyLink: b.buyLink, coverUrl: b.coverUrl, status: b.status });
    setOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `books/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('club-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('club-photos')
        .getPublicUrl(filePath);

      setForm({ ...form, coverUrl: publicUrl });
      toast({ title: "Capa carregada com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.author) {
      toast({ title: "Preencha título e autor", variant: "destructive" });
      return;
    }
    try {
      setIsSaving(true);
      if (editingId) {
        await updateBook(editingId, form);
        toast({ title: "Livro atualizado!" });
      } else {
        await addBook(form);
        toast({ title: "Livro adicionado!" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: "Erro ao salvar livro", description: err?.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      toast({ title: "Livro removido!" });
    } catch (err: any) {
      toast({ title: "Erro ao remover livro", description: err?.message, variant: "destructive" });
    }
  };

  const statusLabels: Record<string, string> = { current: "Livro do Mês", finished: "Lido", upcoming: "Próximo" };
  const statusColors: Record<string, string> = { current: "bg-primary/10 text-primary", finished: "bg-muted text-muted-foreground", upcoming: "bg-accent/20 text-accent-foreground" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">Clube do Livro</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full"><Plus className="h-4 w-4 mr-2" /> Novo Livro</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? "Editar Livro" : "Novo Livro"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Título do livro *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Autor(a) *" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              <Textarea placeholder="Sinopse" value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={3} />
              <Input type="date" value={form.meetingDate} onChange={(e) => setForm({ ...form, meetingDate: e.target.value })} />
              <Input placeholder="Link para compra" value={form.buyLink} onChange={(e) => setForm({ ...form, buyLink: e.target.value })} />
              <div className="space-y-2">
                <Label>Capa do Livro</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                    {form.coverUrl ? <img src={form.coverUrl} alt="Preview" className="w-full h-full object-cover" /> : <BookOpen className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="text-xs" />
                    <p className="text-[10px] text-muted-foreground mt-1">{isUploading ? "Enviando..." : "Upload de capa (PNG, JPG)"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Book["status"] })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="current">Livro do Mês</option>
                  <option value="upcoming">Próximo</option>
                  <option value="finished">Lido</option>
                </select>
              </div>
              <Button onClick={handleSave} disabled={isSaving || isUploading} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {books.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Nenhum livro cadastrado ainda.</p>
          </div>
        )}
        {books.map((book) => (
          <div key={book.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {book.coverUrl ? <img src={book.coverUrl} alt={book.title} className="w-10 h-10 rounded-lg object-cover" /> : <BookOpen className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">{book.title}</p>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusColors[book.status] || ""}`}>{statusLabels[book.status] || book.status}</span>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(book)}><Edit2 className="h-3.5 w-3.5" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover livro?</AlertDialogTitle>
                    <AlertDialogDescription>Tem certeza que deseja remover "{book.title}"?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(book.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
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

export default AdminBooks;
