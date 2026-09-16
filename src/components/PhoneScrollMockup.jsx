import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * PhoneScrollMockup
 * Simula o site "rolando" dentro de um mockup de celular usando UMA
 * imagem vertical comprida (screenshot da página inteira) — nada de
 * vídeo. O efeito de rolagem é feito deslocando a imagem verticalmente
 * com uma animação CSS/JS leve (framer-motion transform), então o
 * custo real é o de carregar uma imagem só.
 *
 * Performance:
 * - A imagem só é buscada quando entra perto da viewport (loading="lazy").
 * - A animação de scroll só roda enquanto o mockup está visível na tela
 *   (useInView) — fora da viewport ela para, economizando CPU/bateria.
 *
 * Props:
 * - src: caminho da imagem vertical (screenshot completo do site).
 * - scrollDepth: quanto da imagem "percorrer" verticalmente (0–1, em %
 *   da altura da própria imagem). 0.72 costuma dar um efeito natural.
 * - duration: duração de um ciclo completo de rolagem (segundos).
 */
export default function PhoneScrollMockup({
  src,
  alt = "Prévia do site rolando",
  scrollDepth = 0.72,
  duration = 16,
  className = "",
}) {
  const wrapperRef = useRef(null);
  const isInView = useInView(wrapperRef, { amount: 0.4, once: false });

  return (
    <div ref={wrapperRef} className={`mx-auto w-[210px] sm:w-[248px] ${className}`}>
      {/* Moldura do celular — feita só em CSS, sem imagem extra */}
      <div className="relative rounded-[2.2rem] border-[6px] border-white/10 bg-black p-1.5 shadow-glow">
        {/* Notch */}
        <div className="absolute left-1/2 top-2.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-black/80" />

        {/* "Tela" do celular: janela com overflow escondido onde a
            imagem comprida desliza pra cima e pra baixo */}
        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.7rem] bg-surface">
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 top-0 w-full"
            style={{ height: "auto" }}
            animate={
              isInView
                ? { y: [`0%`, `-${scrollDepth * 100}%`, `0%`] }
                : { y: "0%" }
            }
            transition={
              isInView
                ? {
                    duration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.6,
                  }
                : { duration: 0.3 }
            }
          />

          {/* Sombra sutil no topo/fundo da tela pra reforçar a leitura
              de "janela" com conteúdo passando por dentro */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      {/* Barra home indicator */}
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-white/15" />
    </div>
  );
}
