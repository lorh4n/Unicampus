// ViewModel do login.
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isDevMode } from '../data/repositories';
import type { UserRole } from '../models';

export function useLoginViewModel() {
  const { login } = useAuth();
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Só no MODO DEV: simula o papel que o backend devolveria.
  const [devRole, setDevRole] = useState<UserRole>('aluno');

  /** Retorna o papel do usuário autenticado (para rotear), ou null se falhou. */
  const submit = async (): Promise<UserRole | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await login(ra, password, isDevMode ? { devRole } : undefined);
      return user.role;
    } catch (e) {
      // mostra a mensagem do backend quando houver (ex.: "RA ou senha inválidos")
      setError(e instanceof Error && e.message ? e.message : 'Não foi possível entrar. Confira RA e senha.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    ra, setRa,
    password, setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    canSubmit: ra.length > 0 && password.length > 0,
    submit,
    loading,
    error,
    isDevMode,
    devRole,
    setDevRole,
  };
}
