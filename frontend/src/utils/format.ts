// Formatação pt-BR (SPEC.md §6.6): nota com vírgula e 1 casa, % inteiro, créditos inteiros.

export function fmtGrade(n: number | null): string {
  if (n === null) return '—';
  return n.toFixed(1).replace('.', ',');
}

export function fmtPercent(n: number | null): string {
  if (n === null) return '—';
  return `${Math.round(n)}%`;
}

export function fmtCredits(n: number): string {
  return `${n} ${n === 1 ? 'crédito' : 'créditos'}`;
}

export const WEEKDAYS_SHORT = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const;
export const WEEKDAYS_HEADER = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'] as const;

/** "14:00" → "14h" */
export function fmtHour(t: string): string {
  return `${t.split(':')[0].replace(/^0/, '')}h`;
}

export function fmtSlot(weekday: number, start: string, end: string): string {
  return `${WEEKDAYS_SHORT[weekday]} ${fmtHour(start)}–${fmtHour(end)}`;
}

export function firstName(full: string): string {
  return full.split(' ')[0];
}

export function initials(full: string): string {
  const parts = full.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}
