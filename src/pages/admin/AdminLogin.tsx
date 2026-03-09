import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.webp";
import { Lock, Mail, ArrowRight } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        toast({ title: "Erro ao entrar", description: signInError.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { error: setupError } = await supabase.functions.invoke("setup-admin");
      if (setupError) {
        toast({ title: "Erro ao configurar admin", description: setupError.message, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      toast({ title: "Admin configurado com sucesso!" });
      window.location.href = "/admin";
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      } else {
        navigate("/admin");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl shadow-2xl p-10 w-full max-w-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        
        <div className="text-center mb-10">
          <img src={logo} alt="Logo" className="h-12 mx-auto mb-5" />
          <h1 className="text-xl font-heading font-bold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Crie sua conta de administrador" : "Faça login para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 rounded-xl" required minLength={6} />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full gradient-primary border-0 text-primary-foreground rounded-xl h-11 font-semibold shadow-md">
            {isLoading ? "Aguarde..." : isSignUp ? "Criar conta admin" : "Entrar"} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-5 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary hover:underline font-medium">
            {isSignUp ? "Já tenho conta → Entrar" : "Primeiro acesso? Criar conta admin"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Voltar ao site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
