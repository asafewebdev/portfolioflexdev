import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Config padrão do Vite para React. Nenhum ajuste especial é necessário
// para publicar na Vercel: basta importar o repositório e o preset
// "Vite" da Vercel detecta build (`npm run build`) e output (`dist`) sozinho.
export default defineConfig({
  plugins: [react()],
});
