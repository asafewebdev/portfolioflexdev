// Contorno aproximado do Brasil — os MESMOS vértices usados para gerar a
// nuvem de pontos em `brazilDots.js` (o script que gera os dots faz um
// point-in-polygon sobre essa mesma lista), então o traço da linha fica
// sempre alinhado com a silhueta pontilhada por dentro. viewBox de
// referência: 0 0 600 600. Não é um contorno cartográfico exato — é uma
// silhueta estilizada, suficiente para leitura imediata da forma do país.
//
// Para trocar de região (ex: Brasil -> Equador): troque esta lista de
// vértices pelo contorno aproximado do novo país (mesma escala 600x600),
// e gere um novo `brazilDots.js` com o mesmo polígono para os dots
// continuarem alinhados com a linha.
export const BRAZIL_OUTLINE = [
  [360, 61.5], // Amapá / foz do Amazonas
  [450, 107.7], // São Luís
  [540, 138.5], // Fortaleza
  [585, 161.5], // Natal
  [601, 192.3], // João Pessoa — ponta mais a leste (nariz do Nordeste)
  [585, 217], // Recife
  [540, 276.8], // Salvador
  [525, 338.4], // sul da Bahia
  [510, 384.6], // Espírito Santo
  [465, 430.6], // Rio de Janeiro
  [390, 476.7], // Santa Catarina
  [315, 584.6], // Chuí — ponta sul
  [255, 538.3], // fronteira RS/Argentina, subindo
  [285, 446.0], // fronteira PR/Paraguai
  [240, 384.6], // fronteira MS/Paraguai
  [210, 323.0], // fronteira MT/Bolívia
  [195, 246.1], // fronteira Rondônia/Bolívia
  [95, 217], // Acre — cotovelo pra oeste
  [4, 184.6], // ponta oeste do Acre
  [60, 107.7], // fronteira AM/Peru-Colômbia
  [105, 61.5], // fronteira AM/Colômbia
  [210, 15.4], // Roraima — norte
  [285, 30.8], // fecha no topo
];
