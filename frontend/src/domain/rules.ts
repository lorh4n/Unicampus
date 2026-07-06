// Regras de negócio do frontend (SPEC §6) — funções puras, sem React.
import type { Course, Curriculum, CurriculumCourse, GradeCriterion } from '../models';
import { fmtGrade } from '../utils/format';

export const PASSING_GRADE = 5.0;

export interface SimulatorResult {
  targetLabel: string; // "na P2" / "nas restantes"
  neededLabel: string; // "3,7", "0,0" ou "> 10"
  message: string;
  tone: 'ok' | 'warn' | 'fail';
}

/**
 * Nota necessária nas avaliações restantes para atingir a média 5,0:
 * needed = (M − Σ(wi·gi)) / wr — genérica para qualquer configuração de critérios.
 */
export function computeNeeded(
  criteria: GradeCriterion[],
  known: Record<string, number>,
): SimulatorResult | null {
  const remaining = criteria.filter((c) => !(c.id in known));
  if (remaining.length === 0) return null;

  let acc = 0;
  for (const c of criteria) {
    if (c.id in known) acc += (c.weight / 100) * known[c.id];
  }
  const wr = remaining.reduce((a, c) => a + c.weight, 0) / 100;
  if (wr <= 0) return null;
  const raw = (PASSING_GRADE - acc) / wr;

  const targetLabel =
    remaining.length === 1 ? `na ${remaining[0].label.replace(/^Prova /, '')}` : 'nas restantes';

  if (raw <= 0) {
    return { targetLabel, neededLabel: '0,0', message: `✓ Já aprovada mesmo com 0 ${targetLabel}`, tone: 'ok' };
  }
  if (raw > 10) {
    return {
      targetLabel,
      neededLabel: '> 10',
      message: `✕ Aprovação inviável apenas com ${remaining.length === 1 ? 'essa avaliação' : 'as avaliações restantes'}`,
      tone: 'fail',
    };
  }
  return {
    targetLabel,
    neededLabel: fmtGrade(raw),
    message: raw > 7 ? '⚠ Meta exige um bom desempenho' : '✓ Meta dentro do alcance',
    tone: raw > 7 ? 'warn' : 'ok',
  };
}

/** Faltas restantes antes de reprovar por frequência. */
export function remainingAbsences(course: Pick<Course, 'absences' | 'absenceLimit'>): number {
  return course.absenceLimit - course.absences;
}

export interface DashAlert {
  courseId: string;
  courseCode: string;
  kind: 'falta' | 'nota';
  text: string;
}

/** Alertas do dashboard: faltas restantes ≤ 2 ou média < 5. */
export function buildAlerts(courses: Course[]): DashAlert[] {
  const alerts: DashAlert[] = [];
  for (const c of courses) {
    if (remainingAbsences(c) <= 2) {
      alerts.push({ courseId: c.id, courseCode: c.code, kind: 'falta', text: `${c.code} perto do limite de faltas` });
    }
    if (c.average !== null && c.average < PASSING_GRADE) {
      alerts.push({ courseId: c.id, courseCode: c.code, kind: 'nota', text: `nota ${c.code} abaixo da média` });
    }
  }
  return alerts;
}

/** Próxima aula: slot mais próximo a partir do dia atual. */
export function nextClass(courses: Course[]): { course: Course; slotIndex: number } | null {
  const today = new Date().getDay(); // 0=Dom
  const order = (wd: number) => (wd - today + 7) % 7;
  const candidates: Array<{ course: Course; slotIndex: number; key: number }> = [];
  for (const c of courses) {
    c.slots.forEach((s, i) => {
      candidates.push({ course: c, slotIndex: i, key: order(s.weekday) * 24 + parseInt(s.start, 10) });
    });
  }
  candidates.sort((a, b) => a.key - b.key);
  return candidates.length ? { course: candidates[0].course, slotIndex: candidates[0].slotIndex } : null;
}

// ---------------------------------------------------------------------------
// Árvore de integralização — foco anti-espaguete
// ---------------------------------------------------------------------------

export type ChipFocus = 'none' | 'selected' | 'prereq' | 'unlocks' | 'dimmed';

export interface FocusBanner {
  code: string;
  name: string;
  preText: string;
  preDone: boolean;
  unlockCount: number;
  unlockText: string;
}

export interface SemesterGroup {
  label: string;
  credits: number;
  items: CurriculumCourse[];
}

export interface CurriculumDerived {
  focusOf: (code: string) => ChipFocus;
  banner: FocusBanner | null;
  semesters: SemesterGroup[];
}

export function deriveCurriculumFocus(
  curriculum: Curriculum | undefined,
  selected: string | null,
): CurriculumDerived {
  const all = curriculum?.courses ?? [];
  const byCode = new Map<string, CurriculumCourse>(all.map((c) => [c.code, c]));
  const sel = selected ? byCode.get(selected) ?? null : null;
  const preSet = new Set(sel?.prerequisites ?? []);
  const unlockSet = new Set(
    sel ? all.filter((c) => c.prerequisites.includes(sel.code)).map((c) => c.code) : [],
  );

  const focusOf = (code: string): ChipFocus => {
    if (!sel) return 'none';
    if (code === sel.code) return 'selected';
    if (preSet.has(code)) return 'prereq';
    if (unlockSet.has(code)) return 'unlocks';
    return 'dimmed';
  };

  let banner: FocusBanner | null = null;
  if (sel) {
    banner = {
      code: sel.code,
      name: sel.name,
      preText: sel.prerequisites.length ? sel.prerequisites.join('   ·   ') : 'Nenhum',
      preDone:
        sel.prerequisites.length > 0 &&
        sel.prerequisites.every((c) => byCode.get(c)?.status === 'aprovada'),
      unlockCount: unlockSet.size,
      unlockText: unlockSet.size ? [...unlockSet].join('   ·   ') : 'Nenhuma ainda',
    };
  }

  const semesters: SemesterGroup[] = Array.from({ length: 8 }, (_, i) => {
    const items = all.filter((c) => c.semester === i + 1);
    return {
      label: `${i + 1}º semestre`,
      credits: items.reduce((a, c) => a + c.credits, 0),
      items,
    };
  });

  return { focusOf, banner, semesters };
}
