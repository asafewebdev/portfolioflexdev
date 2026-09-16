/**
 * BeforeAfter
 * Comparativo lado a lado (Antes / Depois), usado no passo do Instagram.
 * Cada lado aceita uma imagem real (print de perfil) via prop — enquanto
 * não houver imagem, mostra um placeholder tracejado no mesmo estilo
 * usado na seção de Prova, para manter consistência visual.
 *
 * Props:
 * - beforeSrc / afterSrc: caminho da imagem (opcional).
 * - beforeAlt / afterAlt: texto alternativo da imagem.
 */
export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "Perfil do Instagram antes",
  afterAlt = "Perfil do Instagram depois",
}) {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md sm:gap-4">
      <Frame label="Antes" tone="muted" src={beforeSrc} alt={beforeAlt} />
      <Frame label="Depois" tone="accent" src={afterSrc} alt={afterAlt} />
    </div>
  );
}

function Frame({ label, tone, src, alt }) {
  const isAccent = tone === "accent";
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className={`font-body text-xs font-bold uppercase tracking-[0.25em] ${
          isAccent ? "text-accent-light" : "text-white/40"
        }`}
      >
        {label}
      </span>

      <div
        className={`relative aspect-[9/16] w-full overflow-hidden rounded-2xl border ${
          isAccent
            ? "border-accent/50 shadow-glow"
            : "border-white/10 opacity-70"
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          // Placeholder tracejado — some assim que `src` for passado
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-white/[0.02] px-3 text-center">
            <IgIcon />
            <span className="font-body text-[11px] leading-snug text-white/30">
              Print do perfil
              <br />
              {label.toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white/20" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
