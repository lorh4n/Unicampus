// ViewModels do painel Admin — visão geral e catálogo de disciplinas.
// PDD/horários NÃO ficam aqui: Admin só cadastra o catálogo; turma+professor+PDD
// são geridos em admin/adminTurmas.ts e no dashboard do professor (BUSINESS_RULES.md).
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { AdminCourse, AdminCoursePayload, CourseColor } from '../models';

export function useAdminOverviewQuery() {
  return useQuery({ queryKey: ['admin', 'overview'], queryFn: () => repos.admin.getOverview() });
}

export function useAdminCoursesQuery() {
  return useQuery({ queryKey: ['admin', 'courses'], queryFn: () => repos.admin.listCourses() });
}

export function useAdminOverviewViewModel() {
  const overview = useAdminOverviewQuery();
  const courses = useAdminCoursesQuery();
  const chart = overview.data?.enrollmentChart ?? [];
  return {
    cards: overview.data?.cards ?? [],
    chart,
    maxChart: Math.max(...chart.map((c) => c.value), 1),
    activity: overview.data?.activity ?? [],
    recentCourses: (courses.data ?? []).slice(0, 4),
    isLoading: overview.isLoading || courses.isLoading,
    isError: overview.isError,
    retry: () => void overview.refetch(),
  };
}

export type AdminFilter = 'todas' | 'ativas' | 'rascunho';

export function useAdminCoursesViewModel(search: string) {
  const query = useAdminCoursesQuery();
  const [filter, setFilter] = useState<AdminFilter>('todas');

  const all = useMemo(() => query.data ?? [], [query.data]);
  const counts = {
    todas: all.length,
    ativas: all.filter((c) => c.status === 'ativa').length,
    rascunho: all.filter((c) => c.status === 'rascunho').length,
  };

  const q = search.trim().toLowerCase();
  let list = all;
  if (filter === 'ativas') list = list.filter((c) => c.status === 'ativa');
  if (filter === 'rascunho') list = list.filter((c) => c.status === 'rascunho');
  if (q) list = list.filter((c) => `${c.name} ${c.code} ${c.area}`.toLowerCase().includes(q));

  return {
    courses: list,
    counts,
    filter,
    setFilter,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}

/** ViewModel do drawer "Nova disciplina" / edição — só dados de catálogo. */
export function useAdminCourseFormViewModel(editing: AdminCourse | null, onDone: () => void) {
  const qc = useQueryClient();
  const [code, setCode] = useState(editing?.code ?? '');
  const [area, setArea] = useState(editing?.area ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [credits, setCredits] = useState(editing?.credits ?? 4);
  const [color, setColor] = useState<CourseColor>(editing?.color ?? 'laranja');

  const isValid = code.trim().length > 0 && name.trim().length > 0;

  const mutation = useMutation({
    mutationFn: (payload: AdminCoursePayload) =>
      editing ? repos.admin.updateCourse(editing.id, payload) : repos.admin.createCourse(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      onDone();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => repos.admin.removeCourse(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin'] });
      onDone();
    },
  });

  return {
    isEdit: !!editing,
    code, setCode,
    area, setArea,
    name, setName,
    credits, setCredits,
    color, setColor,
    isValid,
    saving: mutation.isPending,
    save: () =>
      mutation.mutateAsync({
        code: code.trim(),
        area: area.trim() || 'Geral',
        name: name.trim(),
        credits,
        color,
      }),
    removing: remove.isPending,
    removeCourse: () => (editing ? remove.mutateAsync(editing.id) : Promise.resolve()),
  };
}
