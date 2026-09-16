import { WHATSAPP_LINK } from "../constants";

/**
 * WhatsappButton
 * Botão de CTA padrão do site. Sempre abre o WhatsApp em nova aba com a
 * mensagem pré-preenchida definida em src/constants.js.
 *
 * variant="solid"  -> fundo roxo cheio (CTA principal)
 * variant="ghost"  -> contorno roxo, fundo transparente (CTA secundário)
 */
export default function WhatsappButton({
  children,
  variant = "solid",
  className = "",
  size = "md",
  onClick,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-bold font-body tracking-tight transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-4 text-base sm:text-lg",
    lg: "px-9 py-5 text-lg sm:text-xl",
  };

  const variants = {
    solid:
      "bg-accent text-white shadow-glow hover:bg-accent-light hover:shadow-[0_0_60px_-8px_rgba(124,58,237,0.75)]",
    ghost:
      "border-2 border-accent text-white hover:bg-accent/10",
  };

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <WhatsappIcon />
      {children}
    </a>
  );
}

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.892.526 3.66 1.438 5.168L2 22l4.963-1.404A9.953 9.953 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.19a8.17 8.17 0 01-4.169-1.14l-.299-.177-3.06.866.828-3.024-.194-.31a8.19 8.19 0 01-1.256-4.395c0-4.521 3.68-8.2 8.15-8.2 4.472 0 8.15 3.679 8.15 8.2 0 4.522-3.678 8.18-8.15 8.18z" />
    </svg>
  );
}
