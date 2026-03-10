import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Store, Image, Menu, X, LogOut, CalendarDays, BookOpen, HelpCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.webp";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Membros", href: "/admin/membros", icon: Users },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarDays },
  { label: "Clube do Livro", href: "/admin/livros", icon: BookOpen },
  { label: "Lojas Parceiras", href: "/admin/parceiros", icon: Store },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:static md:block`}>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-9" />
          <button className="md:hidden p-1 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-3 space-y-0.5">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <ExternalLink className="h-4 w-4" /> Ver Site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b border-border px-4 h-14 flex items-center gap-4 md:px-6">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-heading font-semibold text-foreground">Painel Administrativo</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
