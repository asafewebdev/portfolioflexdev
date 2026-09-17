import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { BRAZIL_DOTS } from "../data/brazilDots";
import { BRAZIL_OUTLINE } from "../data/brazilOutline";
import { roundedPolygonPath } from "../utils/roundedPolygonPath";

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DO MAPA — troque aqui quando mudar de região (ex: Equador).
// ---------------------------------------------------------------------------
// O mapa combina duas camadas dentro de um viewBox 0 0 600 600 — leve (só
// <path>/<circle> em SVG, sem lib de mapa):
// 1. Uma LINHA de contorno (BRAZIL_OUTLINE), que carrega o reconhecimento
//    da forma do país — nítida, com um glow roxo discreto atrás.
// 2. Uma nuvem de pontos (BRAZIL_DOTS) por dentro, como textura discreta,
//    sem competir com a linha.
// As duas vêm do MESMO polígono de vértices, então ficam sempre alinhadas.
//
// Para trocar de região (ex: Brasil -> Equador):
// 1. Troque os vértices em `src/data/brazilOutline.js` pelo contorno
//    aproximado do novo país (mesma escala 600x600).
// 2. Regenere `src/data/brazilDots.js` com esse mesmo polígono (o script
//    que gerou o arquivo faz um point-in-polygon sobre a lista de vértices
//    — está documentado no comentário do próprio arquivo).
// 3. Recalcule os `x`/`y` (em %) de cada pino no array PINS mais abaixo.
const DOTS = BRAZIL_DOTS;
const OUTLINE_PATH = roundedPolygonPath(BRAZIL_OUTLINE, 20);

// ---------------------------------------------------------------------------
// PINOS — puramente decorativos (o mapa não abre mais nada ao tocar, e não
// há linhas conectando um pino a outro). São 16 pinos de propósito — o
// número remete aos "+16 clientes" já usados na marca — espalhados pelas
// 5 regiões do país (Norte, Nordeste, Centro-Oeste, Sudeste, Sul), sem
// amontoar em nenhum ponto. `x`/`y` são porcentagens (0–100) relativas ao
// mapa.
//
// Como posicionar um pino novo:
// - x: 0% = extremo oeste do mapa, 100% = extremo leste.
// - y: 0% = extremo norte do mapa, 100% = extremo sul.
// - Ao adicionar/mover um pino, mantenha uma distância mínima de ~9% dos
//   vizinhos (num mapa de ~450px no mobile, ícones de 28px encostam antes
//   disso).
// ---------------------------------------------------------------------------
const PINS = [
  // Norte
  { id: "pin-manaus", x: 33, y: 20 },
  { id: "pin-belem", x: 51, y: 11 },
  { id: "pin-porto-velho", x: 24, y: 36 },
  { id: "pin-boa-vista", x: 30, y: 6 },
  // Nordeste
  { id: "pin-salvador", x: 83, y: 47 },
  { id: "pin-recife", x: 92, y: 29 },
  { id: "pin-fortaleza", x: 75, y: 18 },
  { id: "pin-sao-luis", x: 63, y: 18 },
  // Centro-Oeste
  { id: "pin-brasilia", x: 58, y: 49 },
  { id: "pin-cuiaba", x: 40, y: 49 },
  // Sudeste
  { id: "pin-sao-paulo", x: 62, y: 76 },
  { id: "pin-rio-de-janeiro", x: 76, y: 67 },
  { id: "pin-belo-horizonte", x: 67, y: 57 },
  { id: "pin-vitoria", x: 84, y: 58 },
  // Sul
  { id: "pin-porto-alegre", x: 52, y: 92 },
  { id: "pin-curitiba", x: 51, y: 81 },
];

/**
 * RegionMap
 * Mapa do Brasil em SVG (contorno em linha + nuvem de pontos como textura,
 * leve, sem lib externa) com 16 pinos decorativos espalhados pelas 5
 * regiões do país e paralaxe suave no mouse (só em telas com ponteiro
 * fino, i.e. desktop). Sem linhas conectando os pinos — só os ícones.
 *
 * Puramente visual/ilustrativo: os pinos não são clicáveis e não abrem
 * nenhum popup — sem estado, sem dados de cliente.
 *
 * Acessibilidade: mapa e pinos são markup normal (SVG + decoração
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
          className="w-full text-white/80"
          role="img"
          aria-label="Mapa do Brasil com pinos representando a presença da Flex.dev em clínicas espalhadas pelo país"
        >
          <defs>
            <radialGradient id="regionGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
            {/* Glow mais largo, só para o traço do contorno — dá
                profundidade sem borrar a linha nítida por cima */}
            <filter id="outlineGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {/* Glow ambiente suave e baixo, centralizado — sem apontar pra
              uma única região (os pinos estão espalhados pelo país) e
              sutil o bastante pra não comprometer a legibilidade da linha */}
          <circle cx="300" cy="320" r="260" fill="url(#regionGlow)" />

          {/* Contorno do Brasil — glow roxo discreto atrás da linha, pra
              dar profundidade sem borrar o traço nítido por cima */}
          <path
            d={OUTLINE_PATH}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="6"
            opacity="0.35"
            filter="url(#outlineGlow)"
          />

          {/* Nuvem de pontos — textura discreta por dentro do contorno,
              não é mais o que carrega o reconhecimento da forma */}
          {DOTS.map(([x, y, r, o], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="currentColor" opacity={o} />
          ))}

          {/* Linha de contorno nítida — por cima dos dots, é ela que
              garante o formato do Brasil reconhecível de cara */}
          <path
            d={OUTLINE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            opacity="0.85"
          />

        </svg>

        {/* Pinos decorativos — ícone no estilo do marcador do Google Perfil
            de Empresa (badge azul, toldo listrado, "G" branco central),
            centralizados na coordenada (é assim que o Google mostra esse
            ícone no mapa — sem "rabinho" de pino). Glow pulsante atrás.
            Sem interação: aria-hidden, sem onClick. */}
        {PINS.map((pin) => (
          <div
            key={pin.id}
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            {/* Glow pulsante atrás do ícone */}
            <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-pin-ping rounded-full bg-accent" />

            {/* Ícone "casinha" do Google Perfil de Empresa: badge azul,
                toldo com listras brancas, G branco no centro */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              className="relative drop-shadow-[0_0_6px_rgba(124,58,237,0.6)]"
            >
              {/* Corpo do badge */}
              <rect x="3" y="3" width="26" height="26" rx="7" fill="#4285F4" />
              {/* Toldo listrado */}
              <rect x="3" y="6.5" width="26" height="2.8" fill="#FFFFFF" />
              <rect x="3" y="11.3" width="26" height="2.8" fill="#FFFFFF" opacity="0.9" />
              {/* "G" do Google, branco, centralizado no corpo */}
              <text
                x="16"
                y="25.5"
                textAnchor="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="700"
                fontSize="12"
                fill="#FFFFFF"
              >
                G
              </text>
            </svg>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
