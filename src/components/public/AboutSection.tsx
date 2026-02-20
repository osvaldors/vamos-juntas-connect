import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Users, Sparkles } from "lucide-react";

const values = [
  { icon: Heart, title: "Acolhimento", description: "Um espaço seguro onde toda mulher é bem-vinda e valorizada." },
  { icon: Users, title: "Conexão", description: "Construímos laços genuínos que vão além dos encontros." },
  { icon: Sparkles, title: "Empoderamento", description: "Incentivamos cada mulher a alcançar seu potencial pleno." },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sobre" className="py-24 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-accent italic text-primary text-lg mb-2">Quem somos</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Sobre o <span className="text-gradient">Vamos Juntas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Somos um clube criado por mulheres, para mulheres. Acreditamos que juntas
            podemos ir mais longe, aprender mais e viver melhor. Desde 2020, construímos
            uma comunidade vibrante de apoio mútuo, crescimento pessoal e muitas risadas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="bg-card rounded-2xl p-8 text-center border border-border/60 hover:border-border transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5">
                <item.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
