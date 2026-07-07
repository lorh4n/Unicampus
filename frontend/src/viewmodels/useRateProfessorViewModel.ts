// ViewModel da avaliação de professor (BUSINESS_RULES.md §4.4).
// Só pode avaliar quem tem a disciplina cadastrada e cursando.
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import { useCourseQuery } from './queries';

export function useRateProfessorViewModel(courseId: string | undefined) {
  const course = useCourseQuery(courseId);

  const professorsQuery = useQuery({
    queryKey: ['professors'],
    queryFn: () => repos.professors.list(),
    enabled: !!course.data?.professor,
  });

  // casa por id (vínculo direto) e cai para o nome como fallback
  const professor = professorsQuery.data?.find(
    (p) => p.id === course.data?.professorId || p.name === course.data?.professor,
  );

  const [didactics, setDidactics] = useState(4);
  const [organization, setOrganization] = useState(4);
  const [accessibility, setAccessibility] = useState(4);
  const [material, setMaterial] = useState(4);

  const canRate = course.data?.status === 'cursando' && !!professor;

  const mutation = useMutation({
    mutationFn: () =>
      repos.professors.rate({
        professorId: professor!.id,
        didactics,
        organization,
        accessibility,
        material,
      }),
  });

  return {
    course: course.data,
    professor,
    canRate,
    isLoading: course.isLoading || professorsQuery.isLoading,
    didactics, setDidactics,
    organization, setOrganization,
    accessibility, setAccessibility,
    material, setMaterial,
    submit: () => mutation.mutateAsync(),
    submitting: mutation.isPending,
    submitted: mutation.isSuccess,
  };
}
