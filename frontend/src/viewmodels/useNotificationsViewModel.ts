// ViewModel de notificações.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { AppNotification } from '../models';
import { useNotificationsQuery } from './queries';

export interface NotificationGroup {
  label: string;
  items: AppNotification[];
}

export function useNotificationsViewModel() {
  const query = useNotificationsQuery();
  const qc = useQueryClient();
  const invalidate = () => void qc.invalidateQueries({ queryKey: ['notifications'] });

  const toggle = useMutation({
    mutationFn: (id: string) => repos.notifications.toggleRead(id),
    onSuccess: invalidate,
  });
  const markAll = useMutation({
    mutationFn: () => repos.notifications.markAllRead(),
    onSuccess: invalidate,
  });

  const data = query.data ?? [];
  const groups: NotificationGroup[] = (['Hoje', 'Esta semana'] as const)
    .map((label) => ({ label, items: data.filter((n) => n.group === label) }))
    .filter((g) => g.items.length > 0);

  return {
    groups,
    unreadCount: data.filter((n) => !n.read).length,
    toggleRead: (id: string) => toggle.mutate(id),
    markAllRead: () => markAll.mutate(),
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}
