import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { BRAZIL_DOTS } from "../data/brazilDots";

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DO MAPA — troque aqui quando mudar de região (ex: Equador).
// ---------------------------------------------------------------------------
// O mapa é desenhado como uma nuvem de pontos (pointillist map) dentro de um
// viewBox 0 0 600 600 — é leve (só <circle> em SVG, ~800 pontos, sem lib de
// mapa) e estilizado, não cartograficamente preciso.
//
// Para trocar de região (ex: Brasil -> Equador):
// 1. Gere um novo arquivo de pontos como `src/data/brazilDots.js`. O script
//    que gerou esse arquivo faz um point-in-polygon sobre um contorno
//    aproximado do país (lista de vértices x/y já convertida pro viewBox
//    600x600) — troque só essa lista de vértices pelo contorno do Equador
//    e rode o script de novo.
// 2. Troque o import `BRAZIL_DOTS` abaixo pelo novo dataset.
// 3. Recalcule os `x`/`y` (em %) de cada pino no array PINS mais abaixo,
//    já que eles são posicionados relativos ao viewBox 600x600 do mapa.
const DOTS = BRAZIL_DOTS;

// ---------------------------------------------------------------------------
// PINOS DE CLIENTES — PLACEHOLDER. Duplique este formato para cada cliente
// real (o mapa conecta automaticamente todos os pinos da lista, então
// adicionar um 5º, 6º pino já entra na rede sem precisar mexer em mais
// nada). `x` e `y` são porcentagens (0–100) relativas ao mapa.
//
// Como posicionar um pino novo:
// - x: 0% = extremo oeste do mapa, 100% = extremo leste.
// - y: 0% = extremo norte do mapa, 100% = extremo sul.
// - `image`: screenshot do site do cliente (coloque o arquivo em
//   `public/proof/` e aponte o caminho aqui). Sem imagem, mostra um
//   placeholder tracejado.
// ---------------------------------------------------------------------------
// Espalhados de propósito em regiões bem distantes (Norte, Nordeste,
// Sudeste, Sul) — é isso que vende presença nacional. Evite agrupar
// pinos perto um do outro; quanto mais espalhados, mais forte o efeito
// de rede cobrindo o país.
const PINS = [
  {
    id: "cliente-1",
    name: "Clínica Exemplo — Manaus/AM", // TROCAR AQUI: nome + cidade real
    x: 35,
    y: 21,
    result: "Perfil no Google 100% otimizado", // TROCAR AQUI (opcional)
    image: undefined, // TROCAR AQUI: "/proof/cliente-1-site.jpg"
  },
  {
    id: "cliente-2",
    name: "Clínica Exemplo — Salvador/BA", // TROCAR AQUI
    x: 82,
    y: 46,
    result: "Primeiro lugar em buscas locais",
    image: undefined, // TROCAR AQUI: "/proof/cliente-2-site.jpg"
  },
  {
    id: "cliente-3",
    name: "Clínica Exemplo — São Paulo/SP", // TROCAR AQUI
    x: 64.5,
    y: 73,
    result: "No topo do Google em 45 dias",
    image: undefined, // TROCAR AQUI: "/proof/cliente-3-site.jpg"
  },
  {
    id: "cliente-4",
    name: "Clínica Exemplo — Porto Alegre/RS", // TROCAR AQUI
    x: 60,
    y: 85,
    result: "+180% de contatos pelo WhatsApp",
    image: undefined, // TROCAR AQUI: "/proof/cliente-4-site.jpg"
  },
];

// Converte a % (0–100) usada nos pinos pra coordenada do viewBox 600x600,
// pra desenhar as linhas de conexão no mesmo sistema de coordenadas do mapa.
const toSvg = (pct) => (pct / 100) * 600;

// Gera uma curva suave (bézier quadrática) entre dois pinos — nunca uma
// linha reta. O ponto de controle é deslocado perpendicularmente à reta
// que liga os dois pontos, proporcional à distância entre eles, criando
// um arco natural (efeito "rota de voo").
function buildCurvePath(a, b) {
  const x1 = toSvg(a.x), y1 = toSvg(a.y);
  const x2 = toSvg(b.x), y2 = toSvg(b.y);
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const [px, py] = [-dy / dist, dx / dist]; // vetor perpendicular unitário
  const bow = dist * 0.22;
  const cx = (x1 + x2) / 2 + px * bow;
  const cy = (y1 + y2) / 2 + py * bow;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

// Conecta os pinos em cadeia (1→2→3→4) e fecha o ciclo (último→primeiro),
// formando uma "rede" com poucas linhas, sem virar um emaranhado. Funciona
// para qualquer quantidade de pinos que você adicionar na lista acima.
function buildConnections(pins) {
  if (pins.length < 2) return [];
  const links = pins.map((pin, i) => [pin, pins[(i + 1) % pins.length]]);
  return links.map(([a, b], i) => ({ id: `conn-${i}`, d: buildCurvePath(a, b) }));
}

const CONNECTIONS = buildConnections(PINS);

/**
 * RegionMap
 * Mapa regional em SVG (nuvem de pontos, leve, sem lib externa) com pinos
 * clicáveis espalhados pelo país, conectados por curvas com um brilho que
 * percorre a linha (SVG SMIL nativo — roda sem depender de JS) e paralaxe
 * suave no mouse (só em telas com ponteiro fino, i.e. desktop).
 *
 * Acessibilidade: mapa, linhas e pinos são markup normal, visíveis mesmo
 * sem JS — só o popup do cliente e a paralaxe dependem de JS.
 */
export default function RegionMap() {
  const [activePin, setActivePin] = useState(null);
  const wrapperRef = useRef(null);

  // --- Paralaxe leve no mouse (desktop apenas) --------------------------
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 60, damping: 14, mass: 0.4 });
  const springY = useSpring(mvY, { stiffness: 60, damping: 14, mass: 0.4 });

  useEffect(() => {
    // Só ativa em dispositivos com mouse de verdade — no touch nem
    // registra o listener, pra não gastar ciclo nenhum no mobile.
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover) return;

    const el = wrapperRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const MAX_SHIFT = 10; // px — bem sutil, só dá profundidade
      mvX.set(relX * MAX_SHIFT * -2);
      mvY.set(relY * MAX_SHIFT * -2);
    };
    const handleLeave = () => {
      mvX.set(0);
      mvY.set(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [mvX, mvY]);

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-md">
      {/* Camada com paralaxe: mapa + linhas + pinos se movem juntos e
          sutilmente com o mouse; o popup (fora daqui) fica parado. */}
      <motion.div style={{ x: springX, y: springY }} className="relative">
        <svg
          viewBox="0 0 600 600"
          className="w-full text-white/90"
          role="img"
          aria-label="Mapa do Brasil com clientes da Flex.dev que já aparecem em primeiro no Google"
        >
          <defs>
            <radialGradient id="regionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
            <filter id="glowBlur" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
          </defs>

          {/* Glow ambiente suave, centralizado — sem apontar pra uma única
              região, já que os clientes estão espalhados pelo país */}
          <circle cx="300" cy="320" r="260" fill="url(#regionGlow)" />

          {/* Nuvem de pontos formando a silhueta do país/região */}
          {DOTS.map(([x, y, r, o], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={o} />
          ))}

          {/* Linhas de conexão entre clientes — curvas suaves (bézier),
              nunca retas, com um ponto de luz percorrendo cada uma via
              SMIL nativo do SVG (leve, não depende de JS pra animar). */}
          {CONNECTIONS.map((conn, i) => (
            <g key={conn.id}>
              <path
                id={conn.id}
                d={conn.d}
                fill="none"
                stroke="#7C3AED"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.3"
              />
              <circle r="3.2" fill="#C4B5FD" filter="url(#glowBlur)">
                <animateMotion
                  dur={`${5 + i * 1.3}s`}
                  begin={`${i * 0.6}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${conn.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${5 + i * 1.3}s`}
                  begin={`${i * 0.6}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
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
      </motion.div>

      {/* Mini-card do cliente — overlay contido dentro do próprio mapa
          (position: absolute relativo ao container acima, nunca fixed),
          então não interfere no restante do layout da página. Fica FORA
          da camada de paralaxe, pra não balançar junto com o mouse. */}
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
