import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Store, ExternalLink } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const PartnersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { partners, loading } = useData();

  const activePartners = partners.filter((p) => p.isActive);

  // Only hide the section once loading is done and there are truly no active partners
  if (!loading && activePartners.length === 0) return null;

  return (
    <section className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Parcerias</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Marcas que <span className="text-gradient">apoiam</span>
          </h2>
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-4">
        {activePartners.map((partner, i) => (
          <motion.a
            key={partner.id}
            href={partner.website || "#"}
            target={partner.website ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="group w-[160px] bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center bg-muted overflow-hidden">
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Store className="h-6 w-6 text-primary" />
              )}
            </div>
            <p className="font-heading font-semibold text-xs text-foreground leading-tight">{partner.name}</p>
            {partner.discountPercent && (
              <span className="inline-block mt-2 text-[10px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                {partner.discountPercent} OFF
              </span>
            )}
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default PartnersCarousel;
