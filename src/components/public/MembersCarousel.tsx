import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useData } from "@/contexts/DataContext";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const pastelColors = [
  "hsl(276, 50%, 75%)",
  "hsl(340, 45%, 75%)",
  "hsl(38, 55%, 70%)",
  "hsl(270, 30%, 75%)",
  "hsl(340, 50%, 70%)",
  "hsl(276, 40%, 65%)",
  "hsl(38, 60%, 65%)",
  "hsl(300, 30%, 70%)",
];

const MembersCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { members } = useData();

  const activeMembers = members.filter((m) => m.status === "active");

  // Se ainda não há membros cadastrados, mostra apenas o título com uma mensagem suave
  if (activeMembers.length === 0) {
    return (
      <section className="py-20 bg-background" ref={ref}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="font-accent italic text-primary text-lg mb-2">Nossa comunidade</p>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              Nossas <span className="text-gradient">Membros</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              Em breve você verá aqui as mulheres que fazem parte do clube.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Nossa comunidade</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Nossas <span className="text-gradient">Membros</span>
          </h2>
        </motion.div>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {activeMembers.map((member, i) => (
          <div
            key={member.id}
            className="w-[170px] text-center group"
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-primary-foreground font-heading font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300 overflow-hidden"
              style={{ background: pastelColors[i % pastelColors.length] }}
            >
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(member.name)
              )}
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MembersCarousel;
