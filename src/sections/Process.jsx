import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Reveal from "../components/Reveal";
import PhoneScrollMockup from "../components/PhoneScrollMockup";
import MetricProof from "../components/MetricProof";
import BeforeAfter from "../components/BeforeAfter";

// ---------------------------------------------------------------------------
// PLACEHOLDERS DE DADOS — troque pelos números e mídias reais de cada
// cliente antes de publicar. Cada bloco abaixo alimenta um passo do
// processo (ver comentários "TROCAR AQUI" também dentro do JSX mais abaixo).
// ---------------------------------------------------------------------------

// Passo 2 — Google Meu Negócio: evolução de leads mês a mês.
// TROCAR AQUI: substitua pelos valores reais de leads do cliente.
const GMB_LEADS = [
  { label: "Mês 1", value: 34 },
  { label: "Mês 2", value: 61 },
  { label: "Mês 3", value: 98 },
];

// Passo 4 — Tráfego pago: volume de leads qualificados por período.
// TROCAR AQUI: substitua pelos valores reais da campanha.
const PAID_LEADS = [
  { label: "Semana 1", value: 12 },
  { label: "Semana 2", value: 27 },
  { label: "Semana 3", value: 45 },
];
// TROCAR AQUI: custo por lead real da campanha (R$).
const COST_PER_LEAD = 18;

export default function Process() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(STEPS_COUNT - 1, Math.floor(latest * STEPS_COUNT));
    setActiveStep(index);
  });

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative bg-ink px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="mb-4 inline-block font-body text-sm font-bold uppercase tracking-[0.3em] text-accent-light">
            O processo
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            4 passos. Um único objetivo:{" "}
            <span className="text-gradient-accent">te achar primeiro.</span>
          </h2>
        </Reveal>

        <div className="mt-12 flex gap-4 sm:mt-14 sm:gap-10">
          {/* Barra de progresso lateral — offset fixo a partir do topo da
              viewport, visível em todas as larguras de tela. */}
          <div className="sticky top-28 flex h-fit flex-col items-center gap-6 pt-2 sm:top-32 sm:gap-10">
            {STEP_MARKERS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-display text-xs transition-all duration-500 sm:h-10 sm:w-10 sm:text-sm ${
                    i <= activeStep
                      ? "border-accent bg-accent text-white shadow-glow"
                      : "border-white/15 bg-transparent text-white/30"
                  }`}
                >
                  {step}
                </div>
                {i < STEP_MARKERS.length - 1 && (
                  <div className="h-6 w-0.5 overflow-hidden rounded-full bg-white/10 sm:h-10">
                    <motion.div
                      className="w-full bg-accent"
                      initial={{ height: "0%" }}
                      animate={{ height: i < activeStep ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Blocos dos passos — cada um com sua narrativa de prova */}
          <div className="flex flex-1 flex-col gap-16 sm:gap-24">
            {/* ---------------------------------------------------------
                PASSO 01 — Site otimizado
                Prova visual: mockup de celular com screenshot vertical
                do site rolando (animação leve, sem vídeo).
            --------------------------------------------------------- */}
            <Reveal amount={0.4}>
              <StepHeader
                number="01"
                title="Site otimizado"
                icon={<IconGlobe />}
                text="Site configurado para dominar a busca orgânica: otimizado para o Google, para o Google Meu Negócio e para as IAs."
                result="Sua clínica encontrada em todo lugar que o cliente procura."
              />

              <div className="mt-10 flex justify-center">
                {/*
                  TROCAR AQUI: troque o `src` abaixo pelo screenshot
                  vertical COMPLETO do site do cliente (a página inteira,
                  de cima a baixo, em um único PNG/JPG comprido). Salve o
                  arquivo em `public/proof/` e aponte o caminho aqui.
                  Ex: src="/proof/site-cliente-x.jpg"
                  A imagem atual é só uma demonstração do efeito.
                */}
                <PhoneScrollMockup
                  src="/proof/site-scroll-placeholder.svg"
                  alt="Prévia do site do cliente rolando"
                />
              </div>
            </Reveal>

            {/* ---------------------------------------------------------
                PASSO 02 — Google Meu Negócio
                Prova por número: leads mês a mês, com count-up.
            --------------------------------------------------------- */}
            <Reveal amount={0.4}>
              <StepHeader
                number="02"
                title="Google Meu Negócio"
                icon={<IconPin />}
                text="Configuro e otimizo o seu Perfil de Empresa no Google para ganhar ranqueamento orgânico e aparecer em primeiro na sua cidade."
                result="Onde as empresas procuram, você está no topo."
              />

              <div className="mt-10 flex flex-col items-center">
                {/*
                  TROCAR AQUI: troque os valores em GMB_LEADS (topo deste
                  arquivo) pelos números reais de leads do cliente, e
                  inclua o print real do painel do Google Meu Negócio
                  logo abaixo (troque o bloco tracejado por uma <img />).
                */}
                <MetricProof
                  items={GMB_LEADS}
                  unitLabel="Leads pelo Google Meu Negócio"
                  suffix=" leads"
                />

                {/* TROCAR AQUI: print real do painel do Google Meu Negócio */}
                <div className="mx-auto mt-10 flex aspect-video w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 text-center font-body text-xs text-white/30">
                  Print do painel do Google Meu Negócio
                </div>
              </div>
            </Reveal>

            {/* ---------------------------------------------------------
                PASSO 03 — Instagram vitrine
                Prova visual: antes e depois do perfil, lado a lado.
            --------------------------------------------------------- */}
            <Reveal amount={0.4}>
              <StepHeader
                number="03"
                title="Instagram vitrine"
                icon={<IconCamera />}
                text="Transformo seu Instagram numa vitrine que vende. Fotos reais da operação que transmitem credibilidade no meio empresarial, e artes que constroem uma identidade forte na internet."
                result="Credibilidade que se vê antes mesmo do primeiro contato."
              />

              <div className="mt-10 flex justify-center">
                {/*
                  TROCAR AQUI: passe `beforeSrc` e `afterSrc` com os
                  caminhos dos prints reais do perfil (ex: "/proof/ig-antes.jpg"
                  e "/proof/ig-depois.jpg"). Sem esses props, aparece o
                  placeholder tracejado abaixo.
                */}
                <BeforeAfter
                  beforeSrc={undefined}
                  afterSrc={undefined}
                />
              </div>
            </Reveal>

            {/* ---------------------------------------------------------
                PASSO 04 — Tráfego pago
                Prova por número: volume de leads qualificados + custo
                por lead, com count-up (mesmo formato do Passo 02).
            --------------------------------------------------------- */}
            <Reveal amount={0.4}>
              <StepHeader
                number="04"
                title="Tráfego pago"
                icon={<IconTarget />}
                text="Acelero a chegada de clientes com volume diário de leads qualificados. Ao mesmo tempo, aumento seu poder orgânico levando o conhecimento regional do seu serviço."
                result="Seja o primeiro a aparecer na mente do seu cliente."
              />

              <div className="mt-10 flex flex-col items-center">
                {/*
                  TROCAR AQUI: troque os valores em PAID_LEADS e
                  COST_PER_LEAD (topo deste arquivo) pelos números reais
                  da campanha, e inclua o print real da campanha abaixo.
                */}
                <MetricProof
                  items={PAID_LEADS}
                  unitLabel="Leads qualificados por semana"
                  suffix=""
                  secondaryStat={{
                    label: "Custo médio por lead",
                    value: COST_PER_LEAD,
                    prefix: "R$ ",
                  }}
                />

                {/* TROCAR AQUI: print real da campanha de tráfego pago */}
                <div className="mx-auto mt-10 flex aspect-video w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 text-center font-body text-xs text-white/30">
                  Print da campanha de tráfego pago
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const STEP_MARKERS = ["01", "02", "03", "04"];
const STEPS_COUNT = STEP_MARKERS.length;

/* -------------------------------------------------------------------------
   StepHeader — cabeçalho padrão de cada passo (ícone, número, título,
   texto e frase de resultado), compartilhado pelos 4 formatos de prova.
   ----------------------------------------------------------------------- */
function StepHeader({ number, title, icon, text, result }) {
  return (
    <div className="group">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent-light ring-1 ring-accent/30 transition-colors group-hover:bg-accent/20 sm:h-16 sm:w-16">
        {icon}
      </div>
      <span className="font-display text-sm text-accent-light">
        Passo {number}
      </span>
      <h3 className="mt-1 font-display text-2xl tracking-tight sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 max-w-md font-body text-base text-white/65 sm:text-lg">
        {text}
      </p>
      <p className="mt-4 max-w-md border-l-2 border-accent/50 pl-4 font-body text-sm font-semibold italic text-white/85 sm:text-base">
        {result}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Ícones inline (SVG), leves e sem dependências externas.
   ----------------------------------------------------------------------- */
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M12 22s7-7.58 7-12.5A7 7 0 105 9.5C5 14.42 12 22 12 22z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <rect x="3" y="6" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 6l1.5-2h5L16 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
