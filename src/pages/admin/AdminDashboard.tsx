import { Users, Image, Store, CalendarDays, BookOpen, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const AdminDashboard = () => {
  const { banners, members, events, books, partners, faqs } = useData();

  const cards = [
    { label: "Banners", icon: Image, count: banners.length, href: "/admin/banners", color: "bg-primary" },
    { label: "Membros", icon: Users, count: members.length, href: "/admin/membros", color: "bg-secondary" },
    { label: "Eventos", icon: CalendarDays, count: events.length, href: "/admin/eventos", color: "bg-accent" },
    { label: "Livros", icon: BookOpen, count: books.length, href: "/admin/livros", color: "bg-primary" },
    { label: "Parceiros", icon: Store, count: partners.length, href: "/admin/parceiros", color: "bg-secondary" },
    { label: "FAQ", icon: HelpCircle, count: faqs.length, href: "/admin/faq", color: "bg-accent" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{card.count}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
