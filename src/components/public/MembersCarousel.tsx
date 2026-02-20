import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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
  const [offset, setOffset] = useState(0);
  const { members } = useData();

  const activeMembers = members.filter((m) => m.status === "active");
  const displayMembers = [...activeMembers, ...activeMembers];

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const translateX = -(offset % (activeMembers.length * 200));

  return (
    <section className="py-20 bg-cream overflow-hidden" ref={ref}>
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

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream to-transparent z-10" />

        <div
          className="flex gap-6 will-change-transform"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {displayMembers.map((member, i) => (
            <div
              key={`${member.id}-${i}`}
              className="shrink-0 w-[170px] text-center group"
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
      </div>
    </section>
  );
};

export default MembersCarousel;
