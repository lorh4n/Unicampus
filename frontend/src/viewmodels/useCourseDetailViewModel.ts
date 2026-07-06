// ViewModel do detalhe da disciplina + simulador de notas.
import { useMemo, useState } from 'react';
import { computeNeeded, remainingAbsences, PASSING_GRADE, type SimulatorResult } from '../domain/rules';
import type { Course, GradeCriterion } from '../models';
import { useCourseQuery } from './queries';

export interface CourseDetailViewModel {
  course: Course | undefined;
  status: { label: string; color: string } | null;
  simulator: {
    knownCriteria: GradeCriterion[];
    values: Record<string, number>;
    setValue: (id: string, v: number) => void;
    result: SimulatorResult | null;
  };
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useCourseDetailViewModel(id: string | undefined): CourseDetailViewModel {
  const query = useCourseQuery(id);
  const course = query.data;

  // notas dos sliders (simulação local, não persiste)
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const knownCriteria = useMemo(
    () => course?.criteria.filter((c) => c.grade !== null) ?? [],
    [course],
  );
  const values: Record<string, number> = {};
  for (const c of knownCriteria) values[c.id] = overrides[c.id] ?? c.grade ?? 0;

  const status = course
    ? remainingAbsences(course) < 0
      ? { label: 'Frequência', color: '#FF5A4D' }
      : course.average !== null && course.average < PASSING_GRADE
        ? { label: 'Atenção', color: '#FF8A3D' }
        : { label: 'No prazo', color: '#16A085' }
    : null;

  return {
    course,
    status,
    simulator: {
      knownCriteria,
      values,
      setValue: (cid, v) => setOverrides((s) => ({ ...s, [cid]: v })),
      result: course ? computeNeeded(course.criteria, values) : null,
    },
    isLoading: query.isLoading,
    isError: query.isError || (!query.isLoading && !course),
    retry: () => void query.refetch(),
  };
}
