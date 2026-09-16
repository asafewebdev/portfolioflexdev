import Header from "./components/Header";
import Hero from "./sections/Hero";
import Problem from "./sections/Problem";
import Process from "./sections/Process";
import Proof from "./sections/Proof";
import Closing from "./sections/Closing";
import StickyWhatsapp from "./components/StickyWhatsapp";

/**
 * App
 * Landing page da Flex.dev — jornada de scroll narrativo imersivo,
 * na ordem definida no briefing: Herói -> Problema -> Processo -> Prova
 * -> Fechamento/CTA. O Header fixo mantém a logo visível durante todo o
 * scroll, e o botão flutuante do WhatsApp acompanha a rolagem inteira
 * para garantir conversão a qualquer momento.
 */
export default function App() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Problem />
      <Process />
      <Proof />
      <Closing />
      <StickyWhatsapp />
    </main>
  );
}
