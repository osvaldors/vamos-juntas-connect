import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <div className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Acesso Negado</h2>
          <p className="text-sm text-muted-foreground mb-4">Você não tem permissão de administrador.</p>
          <a href="/" className="text-sm text-primary hover:underline">Voltar ao site</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
