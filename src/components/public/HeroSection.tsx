import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { banners } = useData();
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.length > 0 ? banners : [{ id: "fallback", title: "Vamos Juntas", subtitle: "Um clube de mulheres.", imageUrl: heroBg, cta: "Faça Parte" }];

  const next = useCallback(() => setCurrent((c) => (c + 1) % activeBanners.length), [activeBanners.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length), [activeBanners.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    if (current >= activeBanners.length) setCurrent(0);
  }, [activeBanners.length, current]);

  const banner = activeBanners[current];

  return (
    <section id="inicio" className="relative pt-16 md:pt-20 pb-10 overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={banner.imageUrl || heroBg}
            alt={banner.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/70 md:bg-gradient-to-r md:from-background md:via-background/90 md:to-background/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id + "-text"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl py-10 md:py-16"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-foreground mb-4 leading-tight whitespace-pre-line">
              {banner.title}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-md">
              {banner.subtitle}
            </p>
            {banner.cta && (
              <Button
                size="lg"
                className="rounded-full px-8 text-base shadow-sm hover:shadow-md transition-all bg-foreground text-background"
              >
                {banner.cta} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {activeBanners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
