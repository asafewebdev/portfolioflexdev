// ---------------------------------------------------------------------------
// Configurações centrais do site. Troque aqui e o valor se propaga em todo
// lugar que usa o WhatsApp como CTA.
// ---------------------------------------------------------------------------

// Número de WhatsApp da Flex.dev (formato internacional, sem símbolos).
export const WHATSAPP_NUMBER = "5571984351405";

// Mensagem pré-preenchida ao clicar em qualquer botão de CTA.
const WHATSAPP_MESSAGE =
  "Olá! Quero que minha clínica apareça em primeiro no Google.";

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;
