import { Heart, Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-coral fill-coral" />
              <span className="font-heading font-bold text-lg text-primary-foreground">Vamos Juntas</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Um clube de mulheres que acreditam no poder da união, do acolhimento e do crescimento coletivo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#sobre" className="hover:text-coral transition-colors">Sobre Nós</a></li>
              <li><a href="#eventos" className="hover:text-coral transition-colors">Eventos</a></li>
              <li><a href="#livro" className="hover:text-coral transition-colors">Clube do Livro</a></li>
              <li><a href="#contato" className="hover:text-coral transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Redes Sociais</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-coral hover:text-primary-foreground transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-coral hover:text-primary-foreground transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:bg-coral hover:text-primary-foreground transition-all">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-sm text-primary-foreground/40">
            © 2026 Vamos Juntas Club. Todos os direitos reservados. Feito com <Heart className="h-3 w-3 inline text-coral fill-coral" /> por mulheres incríveis.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
