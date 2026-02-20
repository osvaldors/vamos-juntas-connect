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
    <section className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-accent italic text-primary text-lg mb-2">O que dizem</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Nossas <span className="text-gradient">Vozes</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border relative">
            <Quote className="h-10 w-10 text-rosa-light mb-6" />
            <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 font-body">
              "{testimonials[current].text}"
            </p>
            <div>
              <p className="font-heading font-semibold text-foreground">{testimonials[current].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-primary w-8" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
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
