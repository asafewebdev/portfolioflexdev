import Reveal from "../components/Reveal";

/**
 * Problem
 * Cria tensão: a maioria das clínicas SST está invisível no Google.
 * Copy direta, sem rodeio — cutuca a dor antes de apresentar a solução.
 * Um único parágrafo de corpo (nada de blocos separados) pra fluir direto
 * até a frase de destaque e a virada pro processo.
 */
export default function Problem() {
  return (
    <section className="relative bg-ink px-6 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="mb-4 inline-block font-body text-sm font-bold uppercase tracking-[0.3em] text-accent-light">
            O problema
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">
            Sua clínica pode ser a melhor da cidade.{" "}
            <span className="text-white/40">
              Se ninguém te encontra, isso não importa.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 font-body text-base text-white/65 sm:mt-10 sm:text-lg">
            PCMSO, ASO, exame admissional. É isso que as empresas digitam no
            Google agora mesmo. E enquanto sua clínica não aparece lá, quem
            aparece leva o contrato.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-8 font-display text-2xl leading-snug tracking-tight text-accent-light sm:mt-10 sm:text-3xl">
            Enquanto você espera, o concorrente leva o contrato.
          </p>
        </Reveal>

        {/* Frase-ponte: menor que a frase da dor acima, funciona como a
            virada que leva o visitante para a seção "O processo" */}
        <Reveal delay={0.4}>
          <p className="mt-5 font-body text-lg text-white/70 sm:text-xl">
            Existe um caminho pra{" "}
            <span className="font-semibold text-accent-light">
              reverter isso
            </span>
            . Role e veja.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
