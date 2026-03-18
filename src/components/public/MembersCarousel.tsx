import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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

const CARD_WIDTH = 156; // 140px card + 16px gap

const MembersCarousel = () => {
  const ref = useRef(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { members, loading } = useData();
  const [offset, setOffset] = useState(0);
  const animRef = useRef<number | null>(null);
  const isPaused = useRef(false);

  const activeMembers = members.filter((m) => m.status === "active");

  // Duplicate members for seamless infinite loop
  const displayMembers = activeMembers.length > 0
    ? [...activeMembers, ...activeMembers, ...activeMembers]
    : [];

  const totalWidth = activeMembers.length * CARD_WIDTH;

  // Slow continuous scroll animation
  useEffect(() => {
    if (activeMembers.length === 0) return;

    const speed = 0.3; // pixels per frame (~18px/sec at 60fps) — nice slow scroll
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isPaused.current) {
        setOffset((prev) => {
          const next = prev + speed * (delta / 16.67);
          // Reset when we've scrolled through one full set
          if (next >= totalWidth) {
            return next - totalWidth;
          }
          return next;
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [activeMembers.length, totalWidth]);

  if (!loading && activeMembers.length === 0) {
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

      {/* Infinite auto-scroll slider */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
      >
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-4 will-change-transform"
          style={{
            transform: `translateX(-${offset}px)`,
          }}
        >
          {displayMembers.map((member, i) => (
            <div
              key={`${member.id}-${i}`}
              className="w-[140px] flex-shrink-0 text-center group"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembersCarousel;
