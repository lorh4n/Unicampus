// ViewModel da árvore de integralização (foco anti-espaguete).
import { useMemo, useState } from 'react';
import { deriveCurriculumFocus } from '../domain/rules';
import { useCurriculumQuery } from './queries';

export function useCurriculumViewModel() {
  const query = useCurriculumQuery();
  const [selected, setSelected] = useState<string | null>(null);

  const derived = useMemo(
    () => deriveCurriculumFocus(query.data, selected),
    [query.data, selected],
  );

  return {
    curriculum: query.data,
    ...derived,
    selected,
    toggle: (code: string) => setSelected((s) => (s === code ? null : code)),
    clear: () => setSelected(null),
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}
