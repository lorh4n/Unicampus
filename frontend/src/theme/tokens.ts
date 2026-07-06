// Tokens de design — fonte: DESIGN.md / SPEC.md §9 do protótipo Unicampus.
import type { CourseColor } from '../models';

export const color = {
  navy: '#16153a',
  textSecondary: '#8e8e98',
  textTertiary: '#74747e',
  textMuted: '#9a9aa4',
  screenBg: '#f1f1f4',
  boardBg: '#e9e9ec',
  surface: '#ffffff',
  border: '#e8e8ee',
  yellow: '#FFC524',
  red: '#FF5A4D',
  green: '#16A085',
  amberBg: '#FFF4E8',
  amberBorder: '#FFE0BD',
  amberText: '#A85A12',
  amberSub: '#C58A4A',
} as const;

/** Gradientes [de, para] de cada cor de disciplina. */
export const courseGradients: Record<CourseColor, [string, string]> = {
  laranja: ['#F2762E', '#FF9D4D'],
  azul: ['#2D6FE0', '#5B9BFF'],
  roxo: ['#7C4DFF', '#A78BFA'],
  verde: ['#16A085', '#1ABC9C'],
  rosa: ['#E0457B', '#FF7AA8'],
};

export function courseGradient(c: CourseColor, angle = 150): string {
  const [from, to] = courseGradients[c];
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

/** Cor sólida principal de uma disciplina (para textos/realces). */
export function courseSolid(c: CourseColor): string {
  return courseGradients[c][0];
}

export const radius = { frame: 44, card: 22, cardSm: 14, chip: 16, pill: 20, full: 9999 } as const;

export const shadow = {
  card: '0 6px 18px rgba(20,20,45,0.06)',
  cardSm: '0 4px 14px rgba(20,20,45,0.05)',
  elevated: '0 12px 28px rgba(20,20,45,0.22)',
  yellowBtn: '0 10px 24px rgba(255,197,36,0.4)',
  nav: '0 14px 30px rgba(20,20,45,0.28)',
} as const;
