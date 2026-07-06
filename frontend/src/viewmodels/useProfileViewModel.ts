// ViewModels do perfil e das telas de conta (dados pessoais, recuperar senha).
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repos } from '../data/repositories';
import { useAuth } from '../context/AuthContext';
import { useCurriculumQuery, useMeQuery } from './queries';

export function useProfileViewModel() {
  const { student: session, logout, refreshStudent } = useAuth();
  const me = useMeQuery();
  const curriculum = useCurriculumQuery();
  const [notificationsOn, setNotificationsOn] = useState(
    localStorage.getItem('unicampus.notifs') !== 'off',
  );

  return {
    student: me.data ?? session ?? undefined,
    progressPercent: curriculum.data?.progressPercent,
    notificationsOn,
    toggleNotifications: () =>
      setNotificationsOn((v) => {
        localStorage.setItem('unicampus.notifs', v ? 'off' : 'on');
        return !v;
      }),
    logout,
    refreshStudent,
  };
}

export function usePersonalDataViewModel() {
  const me = useMeQuery();
  const { refreshStudent } = useAuth();
  const qc = useQueryClient();

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (changes: { name: string; email: string }) => repos.student.updateMe(changes),
    onSuccess: (updated) => {
      qc.setQueryData(['me'], updated);
      refreshStudent(updated);
    },
  });

  const current = me.data;
  return {
    isLoading: me.isLoading,
    ra: current?.ra,
    course: current?.course,
    name: name ?? current?.name ?? '',
    email: email ?? current?.email ?? '',
    setName,
    setEmail,
    dirty: name !== null || email !== null,
    canSave: (name ?? current?.name ?? '').trim().length > 0,
    save: () =>
      mutation.mutateAsync({
        name: (name ?? current?.name ?? '').trim(),
        email: (email ?? current?.email ?? '').trim(),
      }),
    saving: mutation.isPending,
  };
}

export function usePasswordResetViewModel() {
  const [ra, setRa] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  return {
    ra, setRa,
    sending,
    sent,
    canSubmit: ra.trim().length > 0,
    submit: async () => {
      setSending(true);
      try {
        await repos.auth.requestPasswordReset(ra.trim());
        setSent(true);
      } finally {
        setSending(false);
      }
    },
  };
}
