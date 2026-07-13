// ViewModel do login.
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isDevMode } from '../data/repositories';
import type { UserRole } from '../models';

const ROLE_LABELS: Record<UserRole, string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  admin: 'Admin',
};

export function useLoginViewModel() {
  const { login, logout } = useAuth();
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Aba escolhida pelo usuário na tela de login ("Entrar como ..."). Em modo
  // dev também controla qual papel o mock devolve; em produção serve só como
  // expectativa a ser validada contra o papel real vindo do backend.
  const [role, setRole] = useState<UserRole>('aluno');

  /**
   * Autentica e confere se o papel retornado pelo backend bate com a aba
   * escolhida. Se não bater (ex.: aluno tentando entrar pela aba "Admin"),
   * a sessão é encerrada imediatamente e um erro é exibido — o papel NUNCA
   * é decidido pelo frontend, só validado contra o que o backend disse.
   */
  const submit = async (): Promise<UserRole | null> => {
    setLoading(true);
    setError(null);
    try {
      const user = await login(ra, password, isDevMode ? { devRole: role } : undefined);
      if (user.role !== role) {
        logout();
        setError(`Essa conta não é de ${ROLE_LABELS[role]}. Selecione a opção correta para continuar.`);
        return null;
      }
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
    role,
    setRole,
    roleLabels: ROLE_LABELS,
  };
}