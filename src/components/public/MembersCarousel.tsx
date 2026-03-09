import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useData } from "@/contexts/DataContext";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const gradients = [
  "linear-gradient(135deg, hsl(346,65%,47%), hsl(346,50%,60%))",
  "linear-gradient(135deg, hsl(22,80%,55%), hsl(38,70%,50%))",
  "linear-gradient(135deg, hsl(346,50%,60%), hsl(22,80%,55%))",
  "linear-gradient(135deg, hsl(38,70%,50%), hsl(346,65%,47%))",
  "linear-gradient(135deg, hsl(346,65%,47%), hsl(22,70%,60%))",
  "linear-gradient(135deg, hsl(22,80%,55%), hsl(346,50%,65%))",
];

const MembersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { members } = useData();

  const activeMembers = members.filter((m) => m.status === "active");

  if (activeMembers.length === 0) {
    return (
      <section className="py-24 bg-muted" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Comunidade</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
              Nossas <span className="text-gradient">Membros</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              Em breve você verá aqui as mulheres incríveis que fazem parte do clube.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Comunidade</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Nossas <span className="text-gradient">Membros</span>
          </h2>
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {activeMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="w-[140px] text-center group"
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-primary-foreground font-heading font-bold text-lg shadow-md group-hover:scale-110 group-hover:rounded-xl transition-all duration-300 overflow-hidden"
              style={{ background: gradients[i % gradients.length] }}
            >
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(member.name)
              )}
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MembersCarousel;
