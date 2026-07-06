// ViewModels de Admin → Turmas: aloca professor/horário/sala a uma disciplina do
// catálogo. PDD não entra aqui — é o professor quem define (BUSINESS_RULES.md §4.3).
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { ClassSlot, Turma, TurmaPayload } from '../models';
import { useAdminCoursesQuery, type AdminFilter } from './admin';

export type { AdminFilter };

export function useAdminTurmasQuery() {
  return useQuery({ queryKey: ['admin', 'turmas'], queryFn: () => repos.admin.listTurmas() });
}

export function useProfessorsQuery() {
  return useQuery({ queryKey: ['professors'], queryFn: () => repos.professors.list() });
}

export function useAdminTurmasViewModel(search: string) {
  const query = useAdminTurmasQuery();
  const [filter, setFilter] = useState<AdminFilter>('todas');

  const all = useMemo(() => query.data ?? [], [query.data]);
  const counts = {
    todas: all.length,
    ativas: all.filter((t) => t.status === 'ativa').length,
    rascunho: all.filter((t) => t.status === 'rascunho').length,
  };

  const q = search.trim().toLowerCase();
  let list = all;
  if (filter === 'ativas') list = list.filter((t) => t.status === 'ativa');
  if (filter === 'rascunho') list = list.filter((t) => t.status === 'rascunho');
  if (q) {
    list = list.filter((t) =>
      `${t.courseCode} ${t.courseName} ${t.className} ${t.professorName}`.toLowerCase().includes(q),
    );
  }

  return {
    turmas: list,
    counts,
    filter,
    setFilter,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}

export type AdminSlotDraft = Omit<ClassSlot, 'id'>;

/** ViewModel do drawer "Nova turma" / edição (painel admin). */
export function useAdminTurmaFormViewModel(editing: Turma | null, onDone: () => void) {
  const qc = useQueryClient();
  const courses = useAdminCoursesQuery();
  const professorsQuery = useProfessorsQuery();

  const [courseCode, setCourseCode] = useState(editing?.courseCode ?? '');
  const [className, setClassName] = useState(editing?.className ?? '');
  const [professorId, setProfessorId] = useState(editing?.professorId ?? '');
  const [slots, setSlots] = useState<AdminSlotDraft[]>(
    editing?.slots.map(({ weekday, start, end, room }) => ({ weekday, start, end, room })) ?? [],
  );

  useEffect(() => {
    if (!editing && courses.data?.length && !courseCode) setCourseCode(courses.data[0].code);
    if (!editing && professorsQuery.data?.length && !professorId) setProfessorId(professorsQuery.data[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses.data, professorsQuery.data]);

  const isValid = courseCode.trim().length > 0 && className.trim().length > 0 && professorId.length > 0;

  const mutation = useMutation({
    mutationFn: (payload: TurmaPayload) =>
      editing ? repos.admin.updateTurma(editing.id, payload) : repos.admin.createTurma(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'turmas'] });
      onDone();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => repos.admin.removeTurma(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'turmas'] });
      onDone();
    },
  });

  return {
    isEdit: !!editing,
    courses: courses.data ?? [],
    professors: professorsQuery.data ?? [],
    courseCode, setCourseCode,
    className, setClassName,
    professorId, setProfessorId,
    slots: {
      list: slots,
      add: (s: AdminSlotDraft) => setSlots((l) => [...l, s]),
      removeAt: (i: number) => setSlots((l) => l.filter((_, j) => j !== i)),
    },
    isValid,
    saving: mutation.isPending,
    save: () =>
      mutation.mutateAsync({
        courseCode,
        className: className.trim(),
        professorId,
        slots,
      }),
    removing: remove.isPending,
    removeTurma: () => (editing ? remove.mutateAsync(editing.id) : Promise.resolve()),
  };
}
