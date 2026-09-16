import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { BRAZIL_DOTS } from "../data/brazilDots";

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DO MAPA — troque aqui quando mudar de região (ex: Equador).
// ---------------------------------------------------------------------------
// O mapa é desenhado como uma nuvem de pontos (pointillist map) dentro de um
// viewBox 0 0 600 600 — é leve (só <circle> em SVG, ~1100 pontos, sem lib de
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
// PINOS — puramente decorativos (o mapa não abre mais nada ao tocar). Só
// marcam presença espalhada pelo país; `x`/`y` são porcentagens (0–100)
// relativas ao mapa. Espalhe por regiões DISTANTES pra reforçar a leitura
// de rede nacional — evite agrupar pinos perto um do outro.
//
// Como posicionar um pino novo:
// - x: 0% = extremo oeste do mapa, 100% = extremo leste.
// - y: 0% = extremo norte do mapa, 100% = extremo sul.
// ---------------------------------------------------------------------------
const PINS = [
  { id: "pin-1", x: 35, y: 21 }, // Norte (região de Manaus/AM)
  { id: "pin-2", x: 82, y: 46 }, // Nordeste (região de Salvador/BA)
  { id: "pin-3", x: 64.5, y: 73 }, // Sudeste (região de São Paulo/SP)
  { id: "pin-4", x: 60, y: 85 }, // Sul (região de Porto Alegre/RS)
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
 * decorativos espalhados pelo país, conectados por curvas com um brilho
 * que percorre a linha (SVG SMIL nativo — roda sem depender de JS) e
 * paralaxe suave no mouse (só em telas com ponteiro fino, i.e. desktop).
 *
 * Puramente visual/ilustrativo: os pinos não são clicáveis e não abrem
 * nenhum popup — sem estado, sem dados de cliente.
 *
 * Acessibilidade: mapa, linhas e pinos são markup normal (SVG + decoração
 * `aria-hidden`), visíveis mesmo sem JS — só a paralaxe depende de JS.
 */
export default function RegionMap() {
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
          sutilmente com o mouse. */}
      <motion.div style={{ x: springX, y: springY }} className="relative">
        <svg
          viewBox="0 0 600 600"
          className="w-full text-white/90"
          role="img"
          aria-label="Mapa do Brasil com pinos representando a presença da Flex.dev em clínicas espalhadas pelo país"
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
              região, já que os pinos estão espalhados pelo país */}
          <circle cx="300" cy="320" r="260" fill="url(#regionGlow)" />

          {/* Nuvem de pontos formando a silhueta do país/região */}
          {DOTS.map(([x, y, r, o], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={o} />
          ))}

          {/* Linhas de conexão entre os pinos — curvas suaves (bézier),
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

        {/* Pinos decorativos — ícone clássico de marcador de mapa (gota
            com ponta pra baixo), com um glow pulsante saindo da ponta que
            toca o mapa. Sem interação: aria-hidden, sem onClick. */}
        {PINS.map((pin) => (
          <div
            key={pin.id}
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            {/* Glow pulsante na base do pino (onde ele "toca" o mapa) */}
            <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 animate-pin-ping rounded-full bg-accent" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/80 blur-[1px]" />

            {/* Ícone de marcador (gota) */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#7C3AED"
              className="relative drop-shadow-[0_0_6px_rgba(124,58,237,0.65)]"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
