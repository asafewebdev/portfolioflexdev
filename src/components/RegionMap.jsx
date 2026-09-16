import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAZIL_DOTS } from "../data/brazilDots";

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DO MAPA — troque aqui quando mudar de região (ex: Equador).
// ---------------------------------------------------------------------------
// O mapa é desenhado como uma nuvem de pontos (pointillist map) dentro de um
// viewBox 0 0 600 600 — é leve (só <circle> em SVG, ~700 pontos, sem lib de
// mapa) e estilizado, não cartograficamente preciso.
//
// Para trocar de região (ex: Brasil -> Equador):
// 1. Gere um novo arquivo de pontos como `src/data/brazilDots.js` (o script
//    que gerou esse arquivo está documentado no comentário do próprio
//    arquivo — basta trocar o polígono de contorno pelo do novo país).
// 2. Troque o import `BRAZIL_DOTS` abaixo pelo novo dataset.
// 3. Recalcule os `x`/`y` (em %) de cada pino no array PINS mais abaixo,
//    já que eles são posicionados relativos ao viewBox 600x600 do mapa.
const DOTS = BRAZIL_DOTS;

// Destaque suave (glow) sobre a região onde os clientes estão concentrados.
// Ajuste x/y (em % do viewBox) e o raio para apontar a região certa.
const REGION_HIGHLIGHT = { x: 84, y: 45, r: 26 };

// ---------------------------------------------------------------------------
// PINOS DE CLIENTES — PLACEHOLDER. Duplique este formato para cada cliente
// real. `x` e `y` são porcentagens (0–100) relativas ao mapa.
//
// Como posicionar um pino novo:
// - x: 0% = extremo oeste do mapa, 100% = extremo leste.
// - y: 0% = extremo norte do mapa, 100% = extremo sul.
// - `image`: screenshot do site do cliente (coloque o arquivo em
//   `public/proof/` e aponte o caminho aqui). Sem imagem, mostra um
//   placeholder tracejado.
// ---------------------------------------------------------------------------
const PINS = [
  {
    id: "cliente-1",
    name: "Clínica Exemplo 1", // TROCAR AQUI: nome real do cliente
    x: 85.5,
    y: 46,
    result: "No topo do Google em 45 dias", // TROCAR AQUI (opcional)
    image: undefined, // TROCAR AQUI: "/proof/cliente-1-site.jpg"
  },
  {
    id: "cliente-2",
    name: "Clínica Exemplo 2", // TROCAR AQUI
    x: 84,
    y: 44.2,
    result: "Primeiro lugar em buscas locais",
    image: undefined, // TROCAR AQUI: "/proof/cliente-2-site.jpg"
  },
  {
    id: "cliente-3",
    name: "Clínica Exemplo 3", // TROCAR AQUI
    x: 86.2,
    y: 44.9,
    result: "+180% de contatos pelo WhatsApp",
    image: undefined, // TROCAR AQUI: "/proof/cliente-3-site.jpg"
  },
  {
    id: "cliente-4",
    name: "Clínica Exemplo 4", // TROCAR AQUI
    x: 85,
    y: 47.3,
    result: "Perfil no Google 100% otimizado",
    image: undefined, // TROCAR AQUI: "/proof/cliente-4-site.jpg"
  },
];

/**
 * RegionMap
 * Mapa regional em SVG (nuvem de pontos, leve, sem lib externa) com pinos
 * clicáveis representando clientes reais — prova social visual. Ao tocar
 * um pino, abre um mini-card com o print do site do cliente (nunca um
 * iframe/site ao vivo, para manter a performance).
 *
 * Acessibilidade: o mapa e os pinos são markup normal (SVG + botões),
 * visíveis mesmo sem JS — só o popup depende de JS para abrir.
 */
export default function RegionMap() {
  const [activePin, setActivePin] = useState(null);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 600 600"
        className="w-full text-white/50"
        role="img"
        aria-label="Mapa com clientes da Flex.dev que já aparecem em primeiro no Google"
      >
        {/* Glow suave marcando a região de atuação */}
        <defs>
          <radialGradient id="regionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx={(REGION_HIGHLIGHT.x / 100) * 600}
          cy={(REGION_HIGHLIGHT.y / 100) * 600}
          r={REGION_HIGHLIGHT.r * 4}
          fill="url(#regionGlow)"
        />

        {/* Nuvem de pontos formando a silhueta do país/região */}
        {DOTS.map(([x, y, r, o], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={o} />
        ))}
      </svg>

      {/* Pinos — posicionados em % sobre o SVG, funcionam como botões
          reais (acessíveis via teclado, com área de toque confortável) */}
      {PINS.map((pin) => (
        <button
          key={pin.id}
          type="button"
          onClick={() => setActivePin(pin)}
          className="group absolute z-10 flex -translate-x-1/2 -translate-y-full items-center justify-center p-2.5"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          aria-label={`Ver resultado de ${pin.name}`}
        >
          {/* Anel pulsante */}
          <span className="absolute h-3.5 w-3.5 animate-pin-ping rounded-full bg-accent" />
          {/* Pino sólido */}
          <span className="relative h-3.5 w-3.5 rounded-full bg-accent shadow-glow ring-2 ring-white/80 transition-transform group-hover:scale-125 group-active:scale-95" />

          {/* Micro-CTA — some no hover (desktop); no touch, o toque já
              abre o card direto, então isso é só reforço visual */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-body text-[10px] font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100 sm:-top-9">
            Clique para ver
          </span>
        </button>
      ))}

      {/* Mini-card do cliente — overlay contido dentro do próprio mapa
          (position: absolute relativo ao container acima, nunca fixed),
          então não interfere no restante do layout da página. */}
      <AnimatePresence>
        {activePin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-ink/80 p-4 backdrop-blur-sm"
            onClick={() => setActivePin(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-glow"
            >
              {/* Botão fechar */}
              <button
                type="button"
                onClick={() => setActivePin(null)}
                aria-label="Fechar"
                className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Print do site do cliente — SEMPRE imagem estática (nunca
                  iframe/site ao vivo), lazy-loaded */}
              <div className="aspect-[4/3] w-full bg-ink">
                {activePin.image ? (
                  <img
                    src={activePin.image}
                    alt={`Site de ${activePin.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-white/[0.02] px-4 text-center">
                    <span className="font-body text-xs text-white/30">
                      Print do site
                      <br />
                      (placeholder)
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 text-left">
                <p className="font-display text-base text-white">
                  {activePin.name}
                </p>
                {activePin.result && (
                  <p className="mt-1 font-body text-sm text-accent-light">
                    {activePin.result}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
