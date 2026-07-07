import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './admin/AdminLayout';
import { AdminOverview } from './admin/AdminOverview';
import { AdminCourses } from './admin/AdminCourses';
import { AdminTurmas } from './admin/AdminTurmas';
import { AdminProfessores } from './admin/AdminProfessores';
import { AdminAlunos } from './admin/AdminAlunos';
import { AdminPlaceholder } from './admin/AdminPlaceholder';
import { ProfessorLayout } from './professor/ProfessorLayout';
import { ProfessorClasses } from './professor/ProfessorClasses';
import { ProfessorClassDetail } from './professor/ProfessorClassDetail';
import { ProfessorScore } from './professor/ProfessorScore';
import { Welcome } from './screens/Welcome';
import { Signup } from './screens/Signup';
import { Login } from './screens/Login';
import { ForgotPassword } from './screens/ForgotPassword';
import { Dashboard } from './screens/Dashboard';
import { Schedule } from './screens/Schedule';
import { Stats } from './screens/Stats';
import { Profile } from './screens/Profile';
import { PersonalData } from './screens/PersonalData';
import { AcademicInfo } from './screens/AcademicInfo';
import { CourseDetail } from './screens/CourseDetail';
import { EnrollCourse } from './screens/EnrollCourse';
import { RateProfessor } from './screens/RateProfessor';
import { ProfessorProfileScreen } from './screens/ProfessorProfileScreen';
import { CurriculumTree } from './screens/CurriculumTree';
import { Notifications } from './screens/Notifications';
import { Search } from './screens/Search';

const ROLE_HOME: Record<string, string> = { aluno: '/app/inicio', professor: '/professor', admin: '/admin' };

/** Rota exclusiva de aluno; professor/admin são mandados para o próprio painel. */
function StudentOnly({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/bem-vindo" replace />;
  if (role && role !== 'aluno') return <Navigate to={ROLE_HOME[role]} replace />;
  return <>{children}</>;
}

/** Rota exclusiva do professor (dashboard próprio — só as turmas dele). */
function ProfessorOnly({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/entrar" replace />;
  if (role && role !== 'professor') return <Navigate to={ROLE_HOME[role]} replace />;
  return <>{children}</>;
}

/** Rota exclusiva do Admin (coordenação) — catálogo global e alocação. */
function AdminOnly({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/entrar" replace />;
  if (role && role !== 'admin') return <Navigate to={ROLE_HOME[role]} replace />;
  return <>{children}</>;
}

export default function App() {
  const { isLoggedIn, role } = useAuth();
  const home = !isLoggedIn ? '/bem-vindo' : ROLE_HOME[role ?? 'aluno'];

  return (
    <Routes>
      <Route path="/" element={<Navigate to={home} replace />} />

      {/* onboarding / auth */}
      <Route path="/bem-vindo" element={<Welcome />} />
      <Route path="/cadastro" element={<Signup />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />

      {/* área do aluno */}
      <Route
        path="/app"
        element={
          <StudentOnly>
            <AppLayout />
          </StudentOnly>
        }
      >
        <Route index element={<Navigate to="/app/inicio" replace />} />
        <Route path="inicio" element={<Dashboard />} />
        <Route path="grade" element={<Schedule />} />
        <Route path="estatisticas" element={<Stats />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="perfil/dados" element={<PersonalData />} />
        <Route path="perfil/curso" element={<AcademicInfo />} />
        <Route path="integralizacao" element={<CurriculumTree />} />
        <Route path="notificacoes" element={<Notifications />} />
        <Route path="busca" element={<Search />} />
        <Route path="matricular" element={<EnrollCourse />} />
        <Route path="disciplina/:id" element={<CourseDetail />} />
        <Route path="disciplina/:id/avaliar-professor" element={<RateProfessor />} />
        <Route path="professor/:id" element={<ProfessorProfileScreen />} />
      </Route>

      {/* dashboard do professor — só as próprias turmas */}
      <Route
        path="/professor"
        element={
          <ProfessorOnly>
            <ProfessorLayout />
          </ProfessorOnly>
        }
      >
        <Route index element={<ProfessorClasses />} />
        <Route path="turmas/:id" element={<ProfessorClassDetail />} />
        <Route path="avaliacao" element={<ProfessorScore />} />
      </Route>

      {/* painel do Admin (coordenação) — catálogo global e alocação */}
      <Route
        path="/admin"
        element={
          <AdminOnly>
            <AdminLayout />
          </AdminOnly>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="disciplinas" element={<AdminCourses />} />
        <Route path="turmas" element={<AdminTurmas />} />
        <Route path="matriculas" element={<AdminPlaceholder />} />
        <Route path="professores" element={<AdminProfessores />} />
        <Route path="alunos" element={<AdminAlunos />} />
        <Route path="relatorios" element={<AdminPlaceholder />} />
        <Route path="config" element={<AdminPlaceholder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
