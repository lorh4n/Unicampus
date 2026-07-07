// ViewModels de Admin → Professores (o Admin é o "pai de tudo": cadastra e gere professores).
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import type { Professor, ProfessorPayload } from '../models';

export function useAdminProfessorsViewModel(search: string) {
  const query = useQuery({ queryKey: ['professors'], queryFn: () => repos.professors.list() });
  const q = search.trim().toLowerCase();
  const list = (query.data ?? []).filter((p) =>
    q ? `${p.name} ${p.department} ${p.email}`.toLowerCase().includes(q) : true,
  );
  return {
    professors: list,
    total: (query.data ?? []).length,
    isLoading: query.isLoading,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}

/** Drawer de criar/editar professor. */
export function useAdminProfessorFormViewModel(editing: Professor | null, onDone: () => void) {
  const qc = useQueryClient();
  const [name, setName] = useState(editing?.name ?? '');
  const [email, setEmail] = useState(editing?.email ?? '');
  const [department, setDepartment] = useState(editing?.department ?? '');

  const isValid = name.trim().length > 0 && email.trim().includes('@') && department.trim().length > 0;

  const invalidate = () => void qc.invalidateQueries({ queryKey: ['professors'] });

  const mutation = useMutation({
    mutationFn: (payload: ProfessorPayload) =>
      editing ? repos.professors.update(editing.id, payload) : repos.professors.create(payload),
    onSuccess: () => {
      invalidate();
      onDone();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => repos.professors.remove(id),
    onSuccess: () => {
      invalidate();
      onDone();
    },
  });

  return {
    isEdit: !!editing,
    name, setName,
    email, setEmail,
    department, setDepartment,
    isValid,
    saving: mutation.isPending,
    save: () => mutation.mutateAsync({ name, email, department }),
    removing: remove.isPending,
    removeProfessor: () => (editing ? remove.mutateAsync(editing.id) : Promise.resolve()),
  };
}
