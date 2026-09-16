/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Identidade visual Flex.dev
        ink: "#0A0A0A", // fundo preto principal
        surface: "#121212", // preto levemente elevado (cards, seções alternadas)
        accent: {
          DEFAULT: "#7C3AED", // roxo vibrante — CTAs, destaques, números
          light: "#A78BFA",
          dark: "#5B21B6",
        },
      },
      fontFamily: {
        // Título: fonte pesada/condensada. Corpo: fonte limpa.
        display: ["'Archivo Black'", "'Arial Narrow'", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        // Editorial: usada só na manchete do Hero (formato "notícia"),
        // pegada de jornal impresso, sério e com autoridade.
        editorial: ["'Playfair Display'", "Georgia", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2.5s infinite",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124, 58, 237, 0.55)",
      },
    },
  },
  plugins: [],
};
