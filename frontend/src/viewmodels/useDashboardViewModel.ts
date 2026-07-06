// ViewModel do Dashboard: agrega aluno, disciplinas, alertas e próxima aula.
import { buildAlerts, nextClass, type DashAlert } from '../domain/rules';
import type { Course, Student } from '../models';
import { firstName } from '../utils/format';
import { useCoursesQuery, useMeQuery, useNotificationsQuery } from './queries';

export interface DashboardViewModel {
  student: Student | undefined;
  greetingName: string;
  courses: Course[];
  alerts: DashAlert[];
  next: { course: Course; slotIndex: number } | null;
  hasUnread: boolean;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useDashboardViewModel(): DashboardViewModel {
  const me = useMeQuery();
  const courses = useCoursesQuery();
  const notifications = useNotificationsQuery();

  const list = courses.data ?? [];
  return {
    student: me.data,
    greetingName: me.data ? firstName(me.data.name) : '',
    courses: list,
    alerts: buildAlerts(list),
    next: nextClass(list),
    hasUnread: (notifications.data ?? []).some((n) => !n.read),
    isLoading: me.isLoading || courses.isLoading,
    isError: courses.isError,
    retry: () => {
      void courses.refetch();
      void me.refetch();
    },
  };
}
