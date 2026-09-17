// Transforma uma lista de vértices [x,y] num path SVG de polígono fechado
// com cantos levemente arredondados — sem "estourar" pra fora do polígono
// original (cada canto é cortado a uma distância fixa dos vizinhos e
// arredondado com uma curva quadrática usando o próprio vértice como
// ponto de controle). Isso mantém o traço fiel à silhueta original,
// diferente de uma spline (Catmull-Rom) que pode ultrapassar os vértices
// e sair da nuvem de pontos gerada a partir do mesmo polígono.
export function roundedPolygonPath(points, radius = 20) {
  const n = points.length;
  if (n < 3) return "";

  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const distPrev = dist(prev, curr);
    const distNext = dist(curr, next);
    const cutPrev = Math.min(radius, distPrev / 2) / (distPrev || 1);
    const cutNext = Math.min(radius, distNext / 2) / (distNext || 1);

    const p1 = lerp(curr, prev, cutPrev); // ponto antes do vértice, na aresta anterior
    const p2 = lerp(curr, next, cutNext); // ponto depois do vértice, na próxima aresta

    d += i === 0 ? `M ${p1[0]} ${p1[1]} ` : `L ${p1[0]} ${p1[1]} `;
    d += `Q ${curr[0]} ${curr[1]} ${p2[0]} ${p2[1]} `;
  }
  return d + "Z";
}
