// ViewModel da busca com abas.
import { useState } from 'react';
import type { SearchTab } from '../models';
import { useCoursesQuery, useSearchQuery } from './queries';

export function useSearchViewModel() {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<SearchTab>('disciplinas');
  const results = useSearchQuery(q, tab);
  const myCourses = useCoursesQuery();

  return {
    q, setQ,
    tab, setTab,
    results: results.data ?? [],
    isSearching: results.isLoading && q.trim().length > 0,
    /** id da disciplina do aluno com esse código (para abrir o detalhe), ou null. */
    courseIdFor: (code: string) => (myCourses.data ?? []).find((c) => c.code === code)?.id ?? null,
  };
}
