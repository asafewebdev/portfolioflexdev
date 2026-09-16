import { motion } from "framer-motion";
import CountUp from "./CountUp";

/**
 * MetricProof
 * Prova por número: barras comparativas + count-up, usadas nos passos
 * "Google Meu Negócio" e "Tráfego pago". Cresce da esquerda pra direita
 * mostrando evolução (ex: leads mês a mês).
 *
 * Props:
 * - items: [{ label: "Mês 1", value: 128 }, { label: "Mês 2", value: 241 }]
 * - unitLabel: texto pequeno acima do gráfico (ex: "Leads pelo WhatsApp")
 * - suffix: sufixo do número (ex: " leads")
 * - secondaryStat: { label, value, prefix, suffix } — estatística extra
 *   opcional abaixo do gráfico (ex: custo por lead).
 */
export default function MetricProof({
  items,
  unitLabel,
  suffix = "",
  secondaryStat,
}) {
  const maxValue = Math.max(...items.map((i) => i.value));
  const first = items[0]?.value ?? 0;
  const last = items[items.length - 1]?.value ?? 0;
  const growthPct = first > 0 ? Math.round(((last - first) / first) * 100) : null;

  // Resumo textual para leitor de tela — o "table view" da barra, já que
  // uma tabela visível seria peso visual desnecessário num gráfico de
  // 2–3 pontos numa landing page (ver dataviz skill: todo gráfico precisa
  // de um equivalente acessível além da cor/posição das barras).
  const srSummary = items.map((i) => `${i.label}: ${i.value}${suffix}`).join(", ");

  return (
    <div className="w-full max-w-sm">
      {unitLabel && (
        <p className="mb-6 text-center font-body text-xs uppercase tracking-[0.25em] text-white/40 sm:mb-8">
          {unitLabel}
        </p>
      )}

      <div className="flex items-end justify-center gap-6 sm:gap-10" aria-hidden="true">
        {items.map((item, i) => {
          const heightPct = Math.max(20, (item.value / maxValue) * 100);
          const isLast = i === items.length - 1;
          return (
            <div key={item.label} className="flex flex-col items-center">
              {/* Rótulo direto só tem peso total no último ponto (o que
                  fecha a história); os anteriores ficam menores/discretos
                  — "label selectively", nunca todo ponto do mesmo tamanho. */}
              <CountUp
                value={item.value}
                suffix={suffix}
                duration={1.6 + i * 0.25}
                className={`mb-3 font-display ${
                  isLast
                    ? "text-2xl text-white sm:text-3xl"
                    : "text-lg text-white/50 sm:text-xl"
                }`}
              />
              {/* Barra com espessura contida (<=24px) e topo levemente
                  arredondado (4px), reta na base — evita blocos grossos */}
              <div className="flex h-28 w-5 items-end overflow-hidden rounded-t bg-white/5 sm:h-36 sm:w-6">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${heightPct}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`w-full rounded-t ${
                    isLast ? "bg-accent shadow-glow" : "bg-white/15"
                  }`}
                />
              </div>
              <span className="mt-3 font-body text-xs uppercase tracking-widest text-white/40">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Equivalente textual pra leitor de tela (o gráfico acima é
          decorativo/visual, aria-hidden) */}
      <p className="sr-only">{srSummary}</p>

      {growthPct !== null && growthPct > 0 && (
        <div className="mt-8 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-body text-sm font-semibold text-accent-light">
            ▲ +{growthPct}% de crescimento
          </span>
        </div>
      )}

      {secondaryStat && (
        <div className="mt-8 flex flex-col items-center border-t border-white/10 pt-6">
          <span className="font-body text-xs uppercase tracking-widest text-white/40">
            {secondaryStat.label}
          </span>
          <CountUp
            value={secondaryStat.value}
            prefix={secondaryStat.prefix}
            suffix={secondaryStat.suffix}
            duration={1.4}
            className="mt-1 font-display text-2xl text-accent-light sm:text-3xl"
          />
        </div>
      )}
    </div>
  );
}
