// ViewModel da grade horária semanal.
import type { Course } from '../models';
import { useScheduleQuery } from './queries';

export interface ScheduleViewModel {
  courses: Course[];
  totalCredits: number;
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useScheduleViewModel(): ScheduleViewModel {
  const schedule = useScheduleQuery();
  const courses = schedule.data ?? [];
  return {
    courses,
    totalCredits: courses.reduce((a, c) => a + c.credits, 0),
    isEmpty: !schedule.isLoading && courses.every((c) => c.slots.length === 0),
    isLoading: schedule.isLoading,
    isError: schedule.isError,
    retry: () => void schedule.refetch(),
  };
}
