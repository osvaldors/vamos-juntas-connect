import { useState } from "react";
import { Plus, Trash2, Edit2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

const AdminMembers = () => {
  const { toast } = useToast();
  const { members, addMember, updateMember, deleteMember } = useData();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", photoUrl: "" });

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditingId(null); setForm({ name: "", email: "", phone: "", role: "", photoUrl: "" }); setOpen(true); };

  const openEdit = (m: typeof members[0]) => {
    setEditingId(m.id);
    setForm({ name: m.name, email: m.email, phone: m.phone, role: m.role, photoUrl: m.photoUrl });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    if (editingId) {
      await updateMember(editingId, form);
      toast({ title: "Membro atualizado!" });
    } else {
      await addMember({ ...form, status: "active" });
      toast({ title: "Membro adicionado!" });
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => { await deleteMember(id); toast({ title: "Membro removido!" }); };

  const toggleStatus = async (m: typeof members[0]) => {
    await updateMember(m.id, { status: m.status === "active" ? "inactive" : "active" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold text-foreground">Membros</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gradient-primary border-0 text-primary-foreground rounded-full">
              <Plus className="h-4 w-4 mr-2" /> Novo Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Editar Membro" : "Novo Membro"}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Profissão / Papel" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <Input placeholder="URL da foto" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
              <Button onClick={handleSave} className="w-full gradient-primary border-0 text-primary-foreground rounded-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-heading font-semibold text-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-heading font-semibold text-foreground hidden md:table-cell">E-mail</th>
                <th className="text-left px-4 py-3 font-heading font-semibold text-foreground">Status</th>
                <th className="text-right px-4 py-3 font-heading font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.email}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(m)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${m.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {m.status === "active" ? "Ativa" : "Inativa"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum membro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMembers;
