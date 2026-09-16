import Reveal from "../components/Reveal";
import WhatsappButton from "../components/WhatsappButton";

// ⚠️ PLACEHOLDER — atualize o número de clientes conforme a carteira crescer.
const CLIENTS_COUNT = 16;

/**
 * Closing
 * Fechamento com prova social + CTA final grande. Última chance de
 * conversão antes do usuário sair da página.
 */
export default function Closing() {
  return (
    <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden bg-ink px-6 py-20 text-center">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[450px] w-[450px] -translate-x-1/2 translate-y-1/3 rounded-full bg-accent/25 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-body text-sm font-semibold text-accent-light">
            <span className="h-2 w-2 rounded-full bg-accent" />
            +{CLIENTS_COUNT} clientes já aparecem em primeiro no Google
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Sua clínica pode ser a{" "}
            <span className="text-gradient-accent">próxima.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-5 max-w-md font-body text-lg text-white/65">
            Chega de esperar o telefone tocar. Comece a aparecer onde as
            empresas já estão procurando.
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10">
            <WhatsappButton size="lg">
              Quero que minha empresa apareça em primeiro
            </WhatsappButton>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <p className="mt-6 font-body text-xs uppercase tracking-[0.3em] text-white/30">
            Resposta rápida via WhatsApp
          </p>
        </Reveal>
      </div>

      <footer className="relative z-10 mt-16 flex flex-col items-center gap-4">
        {/* Logo discreta no rodapé — mesma imagem do header, opacidade
            reduzida para não competir com o CTA acima */}
        <img
          src="/logo-flexdev.png"
          alt="Flex.dev"
          className="h-6 w-auto opacity-40"
        />
        <p className="font-body text-xs text-white/30">
          Flex.dev — Marketing digital para clínicas de medicina ocupacional
        </p>
      </footer>
    </section>
  );
}
