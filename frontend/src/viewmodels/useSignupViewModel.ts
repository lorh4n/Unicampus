// ViewModel do cadastro (dados + matérias em curso + matérias já concluídas).
// As concluídas (com nota) alimentam o cálculo de CR/CP feito no backend;
// aqui mantemos apenas um preview para o aluno conferir antes de enviar.
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOfferingsQuery } from './queries';

const COURSE_NAME = 'Ciência da Computação';
const COURSE_CODE = '42';
const MIN_PASSWORD = 6;
const CREDITS_TOTAL = 188;

/** Estado de cada disciplina na tela: não selecionada, em curso ou concluída. */
export type CourseState = 'none' | 'enrolled' | 'completed';

export function useSignupViewModel() {
  const { signup } = useAuth();
  const offerings = useOfferingsQuery();

  const [name, setName] = useState('');
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enrolled, setEnrolled] = useState<string[]>([]);
  // código -> nota digitada (string para permitir campo vazio enquanto edita).
  const [completed, setCompleted] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = offerings.data ?? [];
  const enrolledSet = useMemo(() => new Set(enrolled), [enrolled]);
  const creditsByCode = useMemo(
    () => new Map(list.map((o) => [o.code, o.credits])),
    [list],
  );

  const credits = list
    .filter((o) => enrolledSet.has(o.code))
    .reduce((a, o) => a + o.credits, 0);

  // Notas válidas (0–10) entre as concluídas — base do preview de CR/CP.
  const validCompleted = useMemo(
    () =>
      Object.entries(completed)
        .map(([code, raw]) => ({ code, raw, grade: Number(raw), credits: creditsByCode.get(code) ?? 0 }))
        .filter((c) => c.raw !== '' && Number.isFinite(c.grade) && c.grade >= 0 && c.grade <= 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completed, creditsByCode],
  );

  const completedCodes = Object.keys(completed);
  const completedCredits = completedCodes.reduce((a, code) => a + (creditsByCode.get(code) ?? 0), 0);
  const gradedCredits = validCompleted.reduce((a, c) => a + c.credits, 0);
  const previewCp = completedCredits > 0
    ? Math.round((completedCredits / CREDITS_TOTAL) * 100) / 100
    : 0;
  const previewCr = gradedCredits > 0
    ? Math.round((validCompleted.reduce((a, c) => a + c.grade * c.credits, 0) / gradedCredits) * 10) / 10
    : 0;

  const stateOf = (code: string): CourseState =>
    enrolledSet.has(code) ? 'enrolled' : code in completed ? 'completed' : 'none';

  const setEnrolledState = (code: string) => {
    setCompleted((c) => {
      if (!(code in c)) return c;
      const { [code]: _drop, ...rest } = c;
      return rest;
    });
    setEnrolled((l) => (l.includes(code) ? l : [...l, code]));
  };

  const setCompletedState = (code: string) => {
    setEnrolled((l) => l.filter((c) => c !== code));
    setCompleted((c) => (code in c ? c : { ...c, [code]: '' }));
  };

  const clearState = (code: string) => {
    setEnrolled((l) => l.filter((c) => c !== code));
    setCompleted((c) => {
      if (!(code in c)) return c;
      const { [code]: _drop, ...rest } = c;
      return rest;
    });
  };

  const gradeMissing = completedCodes.some((code) => {
    const raw = completed[code];
    const n = Number(raw);
    return raw === '' || !Number.isFinite(n) || n < 0 || n > 10;
  });

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
        completed: completedCodes.map((code) => ({ code, grade: Number(completed[code]) })),
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
    offerings: list,
    offeringsLoading: offerings.isLoading,
    stateOf,
    setEnrolledState,
    setCompletedState,
    clearState,
    gradeOf: (code: string) => completed[code] ?? '',
    setGrade: (code: string, value: string) =>
      setCompleted((c) => (code in c ? { ...c, [code]: value } : c)),
    selectedCount: enrolled.length,
    selectedCredits: credits,
    completedCount: completedCodes.length,
    gradeMissing: completedCodes.length > 0 && gradeMissing,
    previewCp,
    previewCr,
    canSubmit:
      name.trim().length > 0 &&
      ra.trim().length > 0 &&
      password.length >= MIN_PASSWORD &&
      enrolled.length + completedCodes.length > 0 &&
      !gradeMissing,
    submit,
    saving,
    success,
    error,
  };
}
