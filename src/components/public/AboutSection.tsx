import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Users, Sparkles, Crown } from "lucide-react";

const values = [
  { icon: Heart, title: "Acolhimento", description: "Um espaço seguro onde toda mulher é bem-vinda, escutada e valorizada." },
  { icon: Users, title: "Conexão", description: "Construímos laços genuínos que transcendem os encontros do clube." },
  { icon: Sparkles, title: "Empoderamento", description: "Incentivamos cada mulher a descobrir e viver seu potencial máximo." },
  { icon: Crown, title: "Liderança", description: "Formamos mulheres que lideram suas vidas, carreiras e comunidades." },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="py-28 bg-background relative overflow-hidden" ref={ref}>
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Quem Somos</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 tracking-tight">
            Mais que um clube.{" "}
            <span className="text-gradient">Um movimento.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Somos uma comunidade de mulheres modernas que acreditam no poder da união. 
            Desde 2020, criamos um espaço de crescimento, liberdade e sororidade.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group bg-card rounded-2xl p-7 text-center border border-border/60 hover:border-primary/30 hover:shadow-glow transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
