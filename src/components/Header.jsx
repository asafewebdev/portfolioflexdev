import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Header
 * Cabeçalho fixo no topo, presente durante todo o scroll. Mostra a logo
 * da Flex.dev em tamanho discreto e ganha um fundo com blur assim que o
 * usuário sai do topo (mantendo legibilidade sobre qualquer seção,
 * sem perder o clima premium/transparente na primeira dobra).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center px-6 py-4 sm:px-8">
        {/* Logo — troque public/logo-flexdev.png caso o arquivo tenha
            outro nome. Altura contida propositalmente (sem exagero),
            nítida em telas retina por ser PNG em boa resolução. */}
        <a href="#top" className="shrink-0" aria-label="Flex.dev — início">
          <img
            src="/logo-flexdev.png"
            alt="Flex.dev"
            className="h-7 w-auto sm:h-8"
          />
        </a>
      </div>
    </motion.header>
  );
}
