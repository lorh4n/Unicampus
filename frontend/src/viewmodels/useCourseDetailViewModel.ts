// ViewModel do detalhe da disciplina: simulador de notas (local), contador
// pessoal de faltas do aluno e desmatrícula (BUSINESS_RULES.md §1, §4.2).
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  computeNeeded,
  remainingAbsences,
  weightedAverage,
  PASSING_GRADE,
  type SimulatorResult,
} from '../domain/rules';
import { repos } from '../data/repositories';
import type { Course, GradeCriterion } from '../models';
import { useCourseQuery } from './queries';

export interface SimulatorModel {
  /** Avaliações já lançadas pelo professor (fixas, ponderadas pelo PDD). */
  launched: GradeCriterion[];
  /** Avaliações ainda sem nota — o aluno simula com sliders. */
  remaining: GradeCriterion[];
  /** Valores dos sliders (nota hipotética) por critério restante. */
  remainingValues: Record<string, number>;
  setRemainingValue: (id: string, v: number) => void;
  /** Nota mínima necessária nas restantes p/ média 5,0 (usa só as notas reais). */
  needed: SimulatorResult | null;
  /** Média projetada com as notas reais + os sliders das restantes. */
  projected: number;
  projectedPassing: boolean;
}

export interface CourseDetailViewModel {
  course: Course | undefined;
  status: { label: string; color: string } | null;
  simulator: SimulatorModel | null;
  setSelfAbsences: (value: number) => void;
  savingSelfAbsences: boolean;
  leaveCourse: () => Promise<void>;
  leaving: boolean;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useCourseDetailViewModel(id: string | undefined): CourseDetailViewModel {
  const query = useCourseQuery(id);
  const course = query.data;
  const qc = useQueryClient();

  const launched = useMemo(
    () => course?.criteria.filter((c) => c.grade !== null) ?? [],
    [course],
  );
  const remaining = useMemo(
    () => course?.criteria.filter((c) => c.grade === null) ?? [],
    [course],
  );

  // sliders das avaliações restantes — default = nota de aprovação (5,0)
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const remainingValues: Record<string, number> = {};
  for (const c of remaining) remainingValues[c.id] = overrides[c.id] ?? PASSING_GRADE;

  const simulator: SimulatorModel | null = useMemo(() => {
    if (!course) return null;
    if (remaining.length === 0) return null; // nada a simular

    const launchedGrades: Record<string, number> = {};
    for (const c of launched) launchedGrades[c.id] = c.grade as number;

    const allGrades: Record<string, number> = { ...launchedGrades };
    for (const c of remaining) allGrades[c.id] = overrides[c.id] ?? PASSING_GRADE;

    const projected = weightedAverage(course.criteria, allGrades) ?? 0;

    return {
      launched,
      remaining,
      remainingValues,
      setRemainingValue: (cid: string, v: number) => setOverrides((s) => ({ ...s, [cid]: v })),
      needed: computeNeeded(course.criteria, launchedGrades),
      projected,
      projectedPassing: projected >= PASSING_GRADE,
    };
    // remainingValues é derivado de overrides; incluir overrides cobre as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, launched, remaining, overrides]);

  const status = course
    ? remainingAbsences({
        absences: Math.max(course.absences, course.selfAbsences),
        absenceLimit: course.absenceLimit,
      }) < 0
      ? { label: 'Frequência', color: '#FF5A4D' }
      : course.average !== null && course.average < PASSING_GRADE
        ? { label: 'Atenção', color: '#FF8A3D' }
        : { label: 'No prazo', color: '#16A085' }
    : null;

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['courses'] });
    void qc.invalidateQueries({ queryKey: ['schedule'] });
  };

  const selfAbsencesMutation = useMutation({
    mutationFn: (value: number) => repos.courses.setSelfAbsences(id!, value),
    onSuccess: (updated) => {
      qc.setQueryData(['courses', id], updated);
      invalidate();
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => repos.courses.remove(id!),
    onSuccess: invalidate,
  });

  return {
    course,
    status,
    simulator,
    setSelfAbsences: (value) => selfAbsencesMutation.mutate(value),
    savingSelfAbsences: selfAbsencesMutation.isPending,
    leaveCourse: () => leaveMutation.mutateAsync(),
    leaving: leaveMutation.isPending,
    isLoading: query.isLoading,
    isError: query.isError || (!query.isLoading && !course),
    retry: () => void query.refetch(),
  };
}
