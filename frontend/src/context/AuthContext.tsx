// Sessão do usuário (parte do Model no MVVM): token + aluno persistidos.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Student, UserRole } from '../models';
import { repos, type SignupPayload } from '../data/repositories';
import type { LoginOptions } from '../data/repositories/types';
import { getToken, setToken } from '../data/http/httpClient';

const STUDENT_KEY = 'unicampus.student';

interface AuthValue {
  student: Student | null;
  isLoggedIn: boolean;
  /** Papel do usuário logado (vem do backend na autenticação). */
  role: UserRole | null;
  login: (ra: string, password: string, options?: LoginOptions) => Promise<Student>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  /** Atualiza o usuário em sessão (ex.: depois de editar dados pessoais). */
  refreshStudent: (student: Student) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function loadStudent(): Student | null {
  if (!getToken()) return null;
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    return raw ? (JSON.parse(raw) as Student) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(loadStudent);

  const persist = (s: Student) => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
    setStudent(s);
  };

  const clear = () => {
    localStorage.removeItem(STUDENT_KEY);
    setToken(null);
    setStudent(null);
  };

  // 401 do backend derruba a sessão em qualquer tela
  useEffect(() => {
    const onUnauthorized = () => clear();
    window.addEventListener('unicampus:unauthorized', onUnauthorized);
    return () => window.removeEventListener('unicampus:unauthorized', onUnauthorized);
  }, []);

  const value: AuthValue = {
    student,
    isLoggedIn: student !== null,
    role: student?.role ?? null,
    login: async (ra, password, options) => {
      const session = await repos.auth.login(ra, password, options);
      persist(session.student);
      return session.student;
    },
    signup: async (payload) => {
      const session = await repos.auth.signup(payload);
      persist(session.student);
    },
    logout: () => {
      void repos.auth.logout();
      clear();
    },
    refreshStudent: persist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
