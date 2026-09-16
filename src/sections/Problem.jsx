import Reveal from "../components/Reveal";

/**
 * Problem
 * Cria tensão: a maioria das clínicas SST está invisível no Google.
 * Copy direta, sem rodeio — cutuca a dor antes de apresentar a solução.
 */
export default function Problem() {
  const points = [
    {
      title: "PCMSO, ASO, exame admissional.",
      text: "É isso que as empresas digitam no Google agora mesmo. E se a sua clínica não está lá, quem está leva o contrato.",
    },
    {
      title: "Quem aparece primeiro, fecha.",
      text: "Não porque é melhor. Porque foi encontrado. E enquanto a maioria segue invisível, esse lugar no topo está esperando alguém ocupar.",
    },
  ];

  return (
    <section className="relative bg-ink px-6 py-16 sm:py-20">
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

        <div className="mt-10 flex flex-col gap-6 sm:mt-12 sm:gap-8">
          {points.map((point, i) => (
            <Reveal key={point.title} delay={0.1 * i}>
              <div className="border-l-2 border-accent/40 pl-6">
                <h3 className="font-display text-xl text-white sm:text-2xl">
                  {point.title}
                </h3>
                <p className="mt-2 font-body text-base text-white/60 sm:text-lg">
                  {point.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-10 font-display text-2xl leading-snug tracking-tight text-accent-light sm:mt-12 sm:text-3xl">
            Enquanto você espera, o concorrente leva o contrato.
          </p>
        </Reveal>

        {/* Frase-ponte: menor que a frase da dor acima, funciona como a
            virada que leva o visitante para a seção "O processo" */}
        <Reveal delay={0.45}>
          <p className="mt-6 font-body text-lg text-white/70 sm:text-xl">
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
