import { MouseEvent, useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.webp";

const navLinks = [
  { label: "Início", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Eventos", href: "/#eventos" },
  { label: "Clube do Livro", href: "/#livro" },
  { label: "Planos", href: "/#planos" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contato", href: "/contato" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const isScrollLink = href.startsWith("/#");
    const targetId = href.replace("/#", "");

    if (isScrollLink) {
      event.preventDefault();
      
      if (location.pathname !== "/") {
        navigate(href);
        return;
      }

      if (targetId === "inicio") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsOpen(false);
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        setIsOpen(false);
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      setIsOpen(false);
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || location.pathname !== "/" ? "glass border-b border-border shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link 
          to="/" 
          onClick={(e: any) => handleSmoothScroll(e, "/#inicio")}
          className="flex items-center gap-2 shrink-0"
        >
          <img src={logo} alt="Club Vamos Juntas" className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={(e: any) => handleSmoothScroll(e, link.href)}
              className="text-sm font-medium nav-link-elegant mx-3 py-2"
            >
              {link.label}
            </Link>
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
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={(e: any) => handleSmoothScroll(e, link.href)}
                  className="text-sm font-medium nav-link-elegant py-2.5 px-4"
                >
                  {link.label}
                </Link>
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
