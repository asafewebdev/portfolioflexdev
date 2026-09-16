import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

/**
 * Proof
 * Mostra resultado concreto. Os números abaixo são PLACEHOLDER —
 * troque por dados reais e, assim que tiver, inclua prints de
 * Google Business Profile / Analytics / WhatsApp Business no lugar
 * indicado mais abaixo.
 */

// ⚠️ PLACEHOLDER — troque pelos números reais do case antes de publicar.
const BEFORE_CALLS = 261;
const AFTER_CALLS = 451;
const PERIOD_LABEL = "em 2 meses"; // ⚠️ PLACEHOLDER — ajuste o período real

export default function Proof() {
  return (
    <section className="relative overflow-hidden bg-surface px-6 py-16 sm:py-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="mb-4 inline-block font-body text-sm font-bold uppercase tracking-[0.3em] text-accent-light">
            A prova
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            Resultado, não promessa.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          {/* ⚠️ Aviso de dado de exemplo — remova esta linha quando trocar pelos números reais */}
          <p className="mx-auto mt-4 max-w-md font-body text-sm text-white/40">
            Exemplo ilustrativo — substitua pelos dados e prints reais do
            cliente.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:mt-12 sm:flex-row sm:gap-4">
          {/* Antes */}
          <Reveal delay={0.25} className="flex flex-col items-center">
            <span className="font-body text-sm uppercase tracking-widest text-white/40">
              Antes
            </span>
            <CountUp
              value={BEFORE_CALLS}
              className="font-display text-5xl text-white/40 sm:text-6xl"
            />
          </Reveal>

          {/* Seta */}
          <Reveal delay={0.3} className="rotate-90 text-accent sm:rotate-0">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h16m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Reveal>

          {/* Depois */}
          <Reveal delay={0.35} className="flex flex-col items-center">
            <span className="font-body text-sm uppercase tracking-widest text-accent-light">
              Depois
            </span>
            <CountUp
              value={AFTER_CALLS}
              duration={2.4}
              className="font-display text-6xl text-white sm:text-7xl"
            />
          </Reveal>
        </div>

        <Reveal delay={0.45}>
          <p className="mt-8 font-display text-xl tracking-tight text-white/80 sm:text-2xl">
            De {BEFORE_CALLS} para {AFTER_CALLS} chamadas {PERIOD_LABEL}.
          </p>
        </Reveal>

        {/*
          ⚠️ PLACEHOLDER DE PRINT — quando tiver o print real do resultado
          (Google Business Profile, WhatsApp Business, Analytics etc.),
          troque o bloco abaixo por uma <img src="/prints/case-01.jpg" />.
        */}
        <Reveal delay={0.5}>
          <div className="mx-auto mt-10 flex aspect-video w-full max-w-lg items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.02] font-body text-sm text-white/30">
            [ Espaço reservado para print real do resultado ]
          </div>
        </Reveal>
      </div>
    </section>
  );
}
