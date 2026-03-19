import { useLocation, Navigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useEffect, useState } from "react";

const Maintenance = () => {
  const { siteSettings, loading, initialLoadDone } = useData();
  const location = useLocation();
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    // If admin uses ?admin=1 exactly on /manutencao
    if (location.search.includes("admin=1")) {
      sessionStorage.setItem("bypassMaintenance", "true");
      setBypassed(true);
    } else if (sessionStorage.getItem("bypassMaintenance") === "true") {
      setBypassed(true);
    }
  }, [location]);

  // Se não carregou ainda
  if (!initialLoadDone && loading) return null;

  // Se o administrador estiver ativado OU o modo manutenção estiver desligado, redireciona de volta para a Home
  if (bypassed || !siteSettings?.maintenanceMode) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
        <span className="text-primary-foreground font-heading font-bold text-2xl">VJ</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 text-center">Site em Manutenção</h1>
      <p className="text-muted-foreground text-center max-w-md leading-relaxed">
        Estamos preparando novidades incríveis para o Vamos Juntas Club. Voltaremos em breve!
      </p>
    </div>
  );
};

export default Maintenance;
