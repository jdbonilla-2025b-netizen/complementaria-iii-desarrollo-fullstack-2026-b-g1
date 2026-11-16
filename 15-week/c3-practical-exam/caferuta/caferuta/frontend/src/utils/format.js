const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export const formatCOP = (n) => cop.format(n);

export function formatDate(iso) {
  // "2026-12-20" -> "20 dic 2026" (sin desfase de zona horaria)
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

// Color de portada por departamento (las tarjetas no dependen de imágenes externas).
const PALETTE = {
  'Quindío': ['#2f5d3a', '#7a9e5a'],
  Caldas: ['#6b3e26', '#b07a4f'],
  Huila: ['#8a2f2f', '#d08a4a'],
  Antioquia: ['#28465a', '#5f8f8a'],
  'Nariño': ['#4b3a6b', '#9c7bb0'],
};
export function coverStyle(departamento) {
  const [a, b] = PALETTE[departamento] || ['#4a3426', '#a07850'];
  return { background: `linear-gradient(135deg, ${a}, ${b})` };
}
