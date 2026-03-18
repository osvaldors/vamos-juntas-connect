import { Heart, Instagram, ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.webp";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <img src={logo} alt="Vamos Juntas" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Um clube de mulheres modernas que acreditam no poder da união, do acolhimento e do crescimento coletivo.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-5 text-sm tracking-wide uppercase">Navegação</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><a href="#sobre" className="hover:text-primary-foreground transition-colors flex items-center gap-1">Sobre Nós <ArrowUpRight className="h-3 w-3" /></a></li>
              <li><a href="#eventos" className="hover:text-primary-foreground transition-colors flex items-center gap-1">Eventos <ArrowUpRight className="h-3 w-3" /></a></li>
              <li><a href="#livro" className="hover:text-primary-foreground transition-colors flex items-center gap-1">Clube do Livro <ArrowUpRight className="h-3 w-3" /></a></li>
              <li><a href="#planos" className="hover:text-primary-foreground transition-colors flex items-center gap-1">Planos <ArrowUpRight className="h-3 w-3" /></a></li>
              <li className="pt-2 border-t border-primary-foreground/5 mt-2">
                <a href="/admin/login" className="text-primary hover:text-primary-foreground transition-colors flex items-center gap-1 font-medium">
                  Área Restrita <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-5 text-sm tracking-wide uppercase">Conecte-se</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40">
            © 2026 Vamos Juntas Club. Todos os direitos reservados. Feito com <Heart className="h-3 w-3 inline text-primary" /> por mulheres incríveis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
