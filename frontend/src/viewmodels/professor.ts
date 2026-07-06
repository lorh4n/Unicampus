// ViewModels do dashboard do Professor — só as próprias turmas (BUSINESS_RULES.md §2).
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { GradeCriterion } from '../models';

export function useMyTurmasQuery() {
  return useQuery({ queryKey: ['professorPortal', 'turmas'], queryFn: () => repos.professorPortal.listMyTurmas() });
}

export function useMyTurmasViewModel() {
  const query = useMyTurmasQuery();
  return {
    turmas: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}

export function useMyScoreViewModel() {
  const query = useQuery({ queryKey: ['professorPortal', 'me', 'score'], queryFn: () => repos.professorPortal.getMyScore() });
  return {
    professor: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}

export interface CriterionDraft {
  label: string;
  weight: number;
}

/** Detalhe da turma: editor de PDD + roster (lançar nota / registrar falta). */
export function useTurmaDetailViewModel(turmaId: string | undefined) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['professorPortal', 'turmas', turmaId],
    queryFn: () => repos.professorPortal.getTurma(turmaId!),
    enabled: !!turmaId,
  });
  const turma = query.data;

  const invalidate = (updated: { id: string }) => {
    qc.setQueryData(['professorPortal', 'turmas', updated.id], updated);
    void qc.invalidateQueries({ queryKey: ['professorPortal', 'turmas'] });
  };

  const [criteriaDraft, setCriteriaDraft] = useState<CriterionDraft[]>([]);
  const [editingCriteria, setEditingCriteria] = useState(false);

  useEffect(() => {
    if (turma && !editingCriteria) {
      setCriteriaDraft(turma.criteria.map((c) => ({ label: c.label, weight: c.weight })));
    }
  }, [turma, editingCriteria]);

  const saveCriteria = useMutation({
    mutationFn: (criteria: CriterionDraft[]) =>
      repos.professorPortal.saveCriteria(turmaId!, { criteria }),
    onSuccess: (updated) => {
      invalidate(updated);
      setEditingCriteria(false);
    },
  });

  const setGrade = useMutation({
    mutationFn: ({ rosterId, criterionId, grade }: { rosterId: string; criterionId: string; grade: number | null }) =>
      repos.professorPortal.setGrade(turmaId!, rosterId, criterionId, grade),
    onSuccess: invalidate,
  });

  const addAbsence = useMutation({
    mutationFn: (rosterId: string) => repos.professorPortal.addAbsence(turmaId!, rosterId),
    onSuccess: invalidate,
  });

  const weightSum = criteriaDraft.reduce((a, c) => a + (Number.isFinite(c.weight) ? c.weight : 0), 0);
  const sumOk = weightSum === 100;

  return {
    turma,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),

    criteriaEditor: {
      isEditing: editingCriteria,
      startEditing: () => setEditingCriteria(true),
      cancel: () => {
        setEditingCriteria(false);
        if (turma) setCriteriaDraft(turma.criteria.map((c) => ({ label: c.label, weight: c.weight })));
      },
      draft: criteriaDraft,
      setLabel: (i: number, label: string) =>
        setCriteriaDraft((l) => l.map((x, j) => (j === i ? { ...x, label } : x))),
      setWeight: (i: number, weight: number) =>
        setCriteriaDraft((l) => l.map((x, j) => (j === i ? { ...x, weight } : x))),
      add: () => setCriteriaDraft((l) => [...l, { label: 'Nova avaliação', weight: 0 }]),
      removeAt: (i: number) => setCriteriaDraft((l) => l.filter((_, j) => j !== i)),
      weightSum,
      sumOk,
      saving: saveCriteria.isPending,
      save: () => saveCriteria.mutateAsync(criteriaDraft),
    },

    setGrade: (rosterId: string, criterionId: string, grade: number | null) =>
      setGrade.mutateAsync({ rosterId, criterionId, grade }),
    addAbsence: (rosterId: string) => addAbsence.mutateAsync(rosterId),
    savingGrade: setGrade.isPending,
    savingAbsence: addAbsence.isPending,
  };
}

export function criterionAverage(criteria: GradeCriterion[], grades: Record<string, number | null>): number | null {
  const known = criteria.filter((c) => grades[c.id] !== null && grades[c.id] !== undefined);
  if (known.length === 0) return null;
  const totalWeight = known.reduce((a, c) => a + c.weight, 0);
  if (totalWeight === 0) return null;
  const sum = known.reduce((a, c) => a + c.weight * (grades[c.id] as number), 0);
  return Math.round((sum / totalWeight) * 10) / 10;
}
