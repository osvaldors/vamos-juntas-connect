import { Users, Image, Store, CalendarDays, BookOpen, HelpCircle, TrendingUp, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { banners, members, events, books, partners, faqs, testimonials, siteSettings, updateSettings } = useData();
  const { toast } = useToast();

  const handleToggleMaintenance = async (checked: boolean) => {
    try {
      await updateSettings(checked);
      toast({ title: checked ? "Modo manutenção ativado" : "Modo manutenção desativado" });
    } catch (error) {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    }
  };

  const cards = [
    { label: "Banners", icon: Image, count: banners.length, href: "/admin/banners", gradient: "from-primary to-accent" },
    { label: "Membros", icon: Users, count: members.length, href: "/admin/membros", gradient: "from-primary to-rosa-light" },
    { label: "Eventos", icon: CalendarDays, count: events.length, href: "/admin/eventos", gradient: "from-accent to-gold" },
    { label: "Livros", icon: BookOpen, count: books.length, href: "/admin/livros", gradient: "from-primary to-accent" },
    { label: "Parceiros", icon: Store, count: partners.length, href: "/admin/parceiros", gradient: "from-rosa-light to-primary" },
    { label: "FAQ", icon: HelpCircle, count: faqs.length, href: "/admin/faq", gradient: "from-accent to-primary" },
    { label: "Depoimentos", icon: Quote, count: testimonials.length, href: "/admin/depoimentos", gradient: "from-primary to-accent" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do conteúdo do seu clube.</p>
        </div>
        
        <div className="bg-card border border-border px-4 py-3 rounded-xl flex items-center justify-between shadow-sm min-w-[280px]">
          <div>
            <p className="font-semibold text-sm">Modo Manutenção</p>
            <p className="text-xs text-muted-foreground">Ocultar o site do público (use ?admin=1 na url da home para visualizar)</p>
          </div>
          <Switch 
            checked={!!siteSettings?.maintenanceMode}
            onCheckedChange={handleToggleMaintenance}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={card.href}
              className="block bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-3xl font-heading font-bold text-foreground">{card.count}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
