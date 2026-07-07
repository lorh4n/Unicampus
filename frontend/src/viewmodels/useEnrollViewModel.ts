// ViewModel da matrícula em turmas ofertadas (substitui "criar disciplina").
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { CourseColor } from '../models';

export function useEnrollViewModel() {
  const query = useQuery({
    queryKey: ['availableTurmas'],
    queryFn: () => repos.enrollment.getAvailableTurmas(),
  });
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ turmaId, color }: { turmaId: string; color: CourseColor }) =>
      repos.enrollment.enrollInTurma(turmaId, color),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['courses'] });
      void qc.invalidateQueries({ queryKey: ['schedule'] });
      void qc.invalidateQueries({ queryKey: ['availableTurmas'] });
    },
  });

  return {
    turmas: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
    enroll: (turmaId: string, color: CourseColor) => mutation.mutateAsync({ turmaId, color }),
    enrolling: mutation.isPending,
  };
}
