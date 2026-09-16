import { motion } from "framer-motion";
import WhatsappButton from "../components/WhatsappButton";
import RegionMap from "../components/RegionMap";

/**
 * Hero
 * Abertura como prova social visual: em vez de afirmar resultado com uma
 * manchete, mostra um mapa do Brasil com pinos espalhados por regiões
 * distantes — presença nacional, puramente decorativa/ilustrativa (sem
 * clique). A logo já vive fixa no Header; aqui a hierarquia é frase de
 * impacto curta -> mapa (protagonista) -> CTA.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-14 pt-28 text-center"
    >
      {/* Fundo: grade sutil + glow roxo para sensação premium/tech */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/25 blur-[120px]" />

      {/* Frase curta de impacto, no lugar da manchete longa */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-md font-display text-[1.9rem] leading-[1.15] tracking-tight sm:max-w-xl sm:text-4xl md:text-5xl"
      >
        Negócios que já aparecem em{" "}
        <span className="text-gradient-accent">primeiro</span> no Google.
      </motion.h1>

      {/* Linha fina de apoio */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="relative z-10 mt-3 font-body text-sm text-white/50 sm:text-base"
      >
        Presença real, espalhada por todo o Brasil.
      </motion.p>

      {/* Mapa regional — protagonista da hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-8 w-full sm:mt-10"
      >
        <RegionMap />
      </motion.div>

      {/* CTAs — principal (WhatsApp) sempre em destaque; o secundário só
          rola a página, sem competir visualmente com o roxo cheio */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 mt-9 flex w-full max-w-xs flex-col items-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center"
      >
        <WhatsappButton size="lg" className="w-full sm:w-auto">
          Quero aparecer em primeiro
        </WhatsappButton>

        {/*
          Botão secundário "Ver exemplos": não leva a lugar nenhum externo,
          só rola suavemente até a seção do processo (onde ficam os 4
          passos com a prova de resultado de cada cliente) — é o que a
          palavra "exemplos" promete. Se preferir que ele pare antes, na
          seção de Problema (id="top" já é o Hero; a próxima seção não
          tem id ainda), me avise que eu adiciono o id lá e troco o alvo.
        */}
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("process")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-transparent px-6 py-3.5 font-body text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
        >
          Ver exemplos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 mt-8 animate-bounce-slow text-white/40"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
