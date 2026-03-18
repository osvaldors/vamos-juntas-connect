import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Store, X, ExternalLink, Tag } from "lucide-react";
import { useData, Partner } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";

const PartnerModal = ({ partner, onClose }: { partner: Partner; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-card border border-border shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors opacity-60 hover:opacity-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted mx-auto mb-6 flex items-center justify-center overflow-hidden border border-border">
            {partner.logoUrl ? (
              <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-2" />
            ) : (
              <Store className="h-10 w-10 text-primary" />
            )}
          </div>
          
          <h3 className="text-2xl font-heading font-bold text-foreground mb-1">{partner.name}</h3>
          {partner.category && (
            <span className="text-xs font-semibold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">
              {partner.category}
            </span>
          )}
          
          <div className="my-6">
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              {partner.description || "Parceria especial voltada para o bem-estar e crescimento das nossas membras."}
            </p>
          </div>

          {partner.discountCode && (
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6">
              <p className="text-[10px] uppercase font-bold text-primary mb-1 tracking-widest">Cupom Exclusivo</p>
              <div className="flex items-center justify-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-mono text-lg font-bold text-foreground tracking-tighter uppercase">{partner.discountCode}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{partner.discountPercent} de desconto</p>
            </div>
          )}

          <Button className="w-full gradient-primary border-0 text-primary-foreground rounded-full h-12 shadow-lg shadow-primary/20" asChild>
            <a href={partner.website || "#"} target="_blank" rel="noopener noreferrer">
              Visitar Loja <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const PartnersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { partners, loading } = useData();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const activePartners = partners.filter((p) => p.isActive);

  if (!loading && activePartners.length === 0) return null;

  return (
    <section className="py-24 bg-muted relative" ref={ref}>
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
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            onClick={() => setSelectedPartner(partner)}
            className="group w-[160px] bg-card rounded-2xl border border-border p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPartner && (
          <PartnerModal 
            partner={selectedPartner} 
            onClose={() => setSelectedPartner(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default PartnersCarousel;
