import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { banners } = useData();
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.length > 0 ? banners : [{ id: "fallback", title: "Juntas, somos\nimbatíveis.", subtitle: "Um clube por e para mulheres que querem crescer, conectar e viver com propósito.", imageUrl: heroBg, cta: "Quero Fazer Parte" }];

  const next = useCallback(() => setCurrent((c) => (c + 1) % activeBanners.length), [activeBanners.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length), [activeBanners.length]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    if (current >= activeBanners.length) setCurrent(0);
  }, [activeBanners.length, current]);

  const banner = activeBanners[current];

  return (
    <section id="inicio" className="relative h-[65vh] min-h-[420px] max-h-[600px] flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={banner.imageUrl || heroBg}
            alt={banner.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id + "-text"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl py-6 md:py-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span className="text-primary-foreground/90 text-xs font-medium tracking-wide uppercase">Clube Feminino • Desde 2020</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground mb-4 leading-[1.1] whitespace-pre-line tracking-tight">
              {banner.title}
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              {banner.subtitle}
            </p>
            {banner.cta && (
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base gradient-primary border-0 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {banner.cta} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base border-primary-foreground/30 text-primary-foreground bg-primary-foreground/5 backdrop-blur-sm hover:bg-primary-foreground/15 transition-all"
                >
                  Conhecer o Clube
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {activeBanners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-all">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-primary-foreground" : "w-3 bg-primary-foreground/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
