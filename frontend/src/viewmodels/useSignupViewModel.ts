// ViewModel do cadastro (dados + seleção de matérias da oferta).
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOfferingsQuery } from './queries';

const COURSE_NAME = 'Ciência da Computação';
const COURSE_CODE = '42';
const MIN_PASSWORD = 6;

export function useSignupViewModel() {
  const { signup } = useAuth();
  const offerings = useOfferingsQuery();

  const [name, setName] = useState('');
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      await signup({
        name: name.trim(),
        ra: ra.trim(),
        course: COURSE_NAME,
        password,
        enrolledCodes: enrolled,
      });
      setSuccess(true);
      return true;
    } catch (e) {
      // mostra a mensagem do backend quando houver (ex.: RA já cadastrado)
      setError(e instanceof Error && e.message
        ? e.message
        : 'Não foi possível concluir o cadastro. Tente de novo.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    name, setName,
    ra, setRa,
    password, setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    passwordTooShort: password.length > 0 && password.length < MIN_PASSWORD,
    course: `${COURSE_NAME} · ${COURSE_CODE}`,
    offerings: offerings.data ?? [],
    offeringsLoading: offerings.isLoading,
    isSelected: (code: string) => enrolledSet.has(code),
    toggle: (code: string) =>
      setEnrolled((list) => (list.includes(code) ? list.filter((c) => c !== code) : [...list, code])),
    selectedCount: enrolled.length,
    selectedCredits: credits,
    canSubmit:
      name.trim().length > 0 &&
      ra.trim().length > 0 &&
      password.length >= MIN_PASSWORD &&
      enrolled.length > 0,
    submit,
    saving,
    success,
    error,
  };
}
