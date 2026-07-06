// ViewModel de estatísticas.
import { useCoursesQuery, useStatsQuery } from './queries';

export function useStatsViewModel() {
  const stats = useStatsQuery();
  const courses = useCoursesQuery();

  const history = stats.data?.crHistory ?? [];
  const last = history[history.length - 1];
  const prev = history[history.length - 2];

  return {
    history,
    currentCr: last?.cr,
    crDelta: last && prev ? last.cr - prev.cr : null,
    maxCr: Math.max(...history.map((h) => h.cr), 1),
    avgAttendance: stats.data?.avgAttendance,
    approvedCount: stats.data?.approvedCount,
    courses: courses.data ?? [],
    isLoading: stats.isLoading || courses.isLoading,
    isError: stats.isError,
    retry: () => void stats.refetch(),
  };
}
