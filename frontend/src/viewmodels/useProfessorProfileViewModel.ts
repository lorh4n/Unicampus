// ViewModel do perfil público do professor (busca → clique).
import { useQuery } from '@tanstack/react-query';
import { repos } from '../data/repositories';

export function useProfessorProfileViewModel(id: string | undefined) {
  const query = useQuery({
    queryKey: ['professorProfile', id],
    queryFn: () => repos.professors.getProfile(id!),
    enabled: !!id,
  });
  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError || (!query.isLoading && !query.data),
    retry: () => void query.refetch(),
  };
}
