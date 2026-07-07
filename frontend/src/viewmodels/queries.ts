// Consultas/mutações base (TanStack Query sobre os repositórios).
// Usadas pelos ViewModels — as Views não importam daqui.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { SearchTab } from '../models';

export function useMeQuery() {
  return useQuery({ queryKey: ['me'], queryFn: () => repos.student.getMe() });
}

export function useCoursesQuery() {
  return useQuery({ queryKey: ['courses'], queryFn: () => repos.courses.list() });
}

export function useCourseQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => repos.courses.get(id!),
    enabled: !!id,
  });
}

export function useScheduleQuery() {
  return useQuery({ queryKey: ['schedule'], queryFn: () => repos.schedule.getWeek() });
}

export function useCurriculumQuery() {
  return useQuery({ queryKey: ['curriculum'], queryFn: () => repos.curriculum.get() });
}

export function useOfferingsQuery() {
  return useQuery({ queryKey: ['offerings'], queryFn: () => repos.enrollment.getOfferings() });
}

export function useStatsQuery() {
  return useQuery({ queryKey: ['stats'], queryFn: () => repos.stats.get() });
}

export function useNotificationsQuery() {
  return useQuery({ queryKey: ['notifications'], queryFn: () => repos.notifications.list() });
}

export function useSearchQuery(q: string, tab: SearchTab) {
  return useQuery({
    queryKey: ['search', q, tab],
    queryFn: () => repos.search.query(q, tab),
    enabled: q.trim().length > 0,
  });
}

export function useRemoveCourseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repos.courses.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['courses'] });
      void qc.invalidateQueries({ queryKey: ['schedule'] });
    },
  });
}
