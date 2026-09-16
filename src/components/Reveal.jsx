import { motion } from "framer-motion";

/**
 * Reveal
 * Wrapper de animação de "descoberta no scroll": fade-in + leve slide-up
 * quando o elemento entra na viewport. Usa `whileInView` do framer-motion,
 * que por baixo dos panos usa IntersectionObserver — leve, não trava a
 * rolagem, e não depende de nenhuma lib extra além da que o site já usa.
 *
 * Curta e rápida por padrão (420ms) para dar sensação de descoberta sem
 * atrasar a leitura; combine com `delay` para escalonar vários elementos
 * dentro da mesma seção (ex: delay={0.08 * i} em uma lista).
 *
 * Acessibilidade/robustez: o conteúdo faz parte do documento normalmente
 * (não é injetado só após a animação) — se o JS falhar, a própria página
 * React não renderiza nada de qualquer forma, já que é uma SPA; dentro
 * desse cenário, o `initial` aqui não é o fator limitante.
 *
 * Uso: <Reveal><h2>Título</h2></Reveal>
 *      <Reveal delay={0.15} y={16}><p>Texto</p></Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  duration = 0.42,
  className = "",
  once = true,
  amount = 0.25,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
