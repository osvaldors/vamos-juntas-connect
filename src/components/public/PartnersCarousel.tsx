import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Store } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const PartnersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [offset, setOffset] = useState(0);
  const { partners } = useData();

  const activePartners = partners.filter((p) => p.isActive);
  const displayPartners = [...activePartners, ...activePartners];

  useEffect(() => {
    if (activePartners.length === 0) return;
    const timer = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 40);
    return () => clearInterval(timer);
  }, [activePartners.length]);

  if (activePartners.length === 0) return null;

  const translateX = -(offset % (activePartners.length * 180));

  return (
    <section className="py-16 bg-background overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Quem apoia a gente</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Nossos <span className="text-gradient">Parceiros</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className="flex gap-8 will-change-transform items-center"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {displayPartners.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="shrink-0 w-[150px] text-center group"
            >
              <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center bg-card border border-border shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 overflow-hidden">
                {partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <Store className="h-6 w-6 text-primary" />
                )}
              </div>
              <p className="font-heading font-semibold text-xs text-foreground leading-tight">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
