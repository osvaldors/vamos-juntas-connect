import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ana Beatriz",
    role: "Membro desde 2021",
    text: "O Vamos Juntas mudou minha vida. Encontrei amizades verdadeiras e um espaço onde posso ser autêntica. Cada encontro é uma fonte de energia e inspiração.",
  },
  {
    name: "Carla Mendes",
    role: "Membro desde 2022",
    text: "O clube do livro me reconectou com a leitura e as discussões são incríveis. Amo fazer parte desse grupo de mulheres tão especiais e acolhedoras.",
  },
  {
    name: "Juliana Santos",
    role: "Membro desde 2020",
    text: "Entrei tímida e encontrei minha voz. As mulheres daqui te apoiam de verdade. É muito mais que um clube, é uma família que a gente escolhe ter.",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-28 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 bg-primary/5 px-4 py-2 rounded-full">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            O que elas <span className="text-gradient">dizem</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-10 md:p-14 border border-border relative shadow-sm">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mb-8">
              <Quote className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-foreground text-xl md:text-2xl leading-relaxed mb-10 font-accent italic">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                {testimonials[current].name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === current ? "bg-primary w-8" : "bg-border w-2"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
