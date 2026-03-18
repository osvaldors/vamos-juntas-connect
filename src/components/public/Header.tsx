import { MouseEvent, useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.webp";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Eventos", href: "#eventos" },
  { label: "FAQ", href: "#faq" },
  { label: "Planos", href: "#planos" },
  { label: "Contato", href: "#contato" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const targetId = href.replace("#", "");
    
    if (targetId === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsOpen(false);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      
      // Close mobile menu
      if (isOpen) {
        setTimeout(() => setIsOpen(false), 150);
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="#inicio" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Club Vamos Juntas" className="h-9 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-full hover:bg-secondary transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" onClick={() => scrollToSection("planos")} className="ml-2 rounded-full px-5 gradient-primary border-0 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
            Faça Parte <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </nav>

        <button className="md:hidden text-foreground p-2 rounded-full hover:bg-secondary transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button onClick={() => scrollToSection("planos")} className="gradient-primary border-0 text-primary-foreground rounded-full mt-3 shadow-md">
                Faça Parte <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
