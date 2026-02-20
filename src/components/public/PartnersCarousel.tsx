import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Store } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const PartnersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { partners } = useData();

  const activePartners = partners.filter((p) => p.isActive);

  if (activePartners.length === 0) return null;

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Quem apoia a gente</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Lojas <span className="text-gradient">Parceiras</span>
          </h2>
        </motion.div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {activePartners.map((partner) => (
          <div
            key={partner.id}
            className="w-[150px] text-center group"
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
    </section>
  );
};

export default PartnersCarousel;
