// ViewModel do cadastro (dados + seleção de matérias da oferta).
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOfferingsQuery } from './queries';

export function useSignupViewModel() {
  const { signup } = useAuth();
  const offerings = useOfferingsQuery();

  const [name, setName] = useState('');
  const [ra, setRa] = useState('');
  const [course] = useState('Ciência da Computação · 42');
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrolledSet = useMemo(() => new Set(enrolled), [enrolled]);
  const credits = (offerings.data ?? [])
    .filter((o) => enrolledSet.has(o.code))
    .reduce((a, o) => a + o.credits, 0);

  const submit = async (): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await signup({ name: name.trim(), ra: ra.trim(), course, enrolledCodes: enrolled });
      setSuccess(true);
      return true;
    } catch {
      setError('Não foi possível concluir o cadastro. Tente de novo.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    name, setName,
    ra, setRa,
    course,
    offerings: offerings.data ?? [],
    offeringsLoading: offerings.isLoading,
    isSelected: (code: string) => enrolledSet.has(code),
    toggle: (code: string) =>
      setEnrolled((list) => (list.includes(code) ? list.filter((c) => c !== code) : [...list, code])),
    selectedCount: enrolled.length,
    selectedCredits: credits,
    canSubmit: name.trim().length > 0 && ra.trim().length > 0 && enrolled.length > 0,
    submit,
    saving,
    success,
    error,
  };
}
