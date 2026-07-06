// Casca do painel admin/professor — sidebar navy + topbar (design Admin Web).
import { createContext, useContext, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isDevMode } from '../data/repositories';
import type { AdminCourse } from '../models';
import { initials } from '../utils/format';
import { BottomSheet } from '../components/common/BottomSheet';
import { IconLogout, IconPlus } from '../components/icons';
import { AdminCourseDrawer } from './AdminCourseDrawer';

interface AdminCtx {
  search: string;
  setSearch: (q: string) => void;
  openCourseDrawer: (course?: AdminCourse) => void;
}

const AdminContext = createContext<AdminCtx | null>(null);

export function useAdmin(): AdminCtx {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin precisa estar dentro do AdminLayout');
  return ctx;
}

const NAV = [
  { path: '/admin', label: 'Visão geral', section: 'PRINCIPAL', icon: NavHomeIcon },
  { path: '/admin/disciplinas', label: 'Disciplinas', section: 'PRINCIPAL', icon: NavBookIcon },
  { path: '/admin/turmas', label: 'Turmas', section: 'PRINCIPAL', icon: NavGridIcon },
  { path: '/admin/matriculas', label: 'Matrículas', section: 'PRINCIPAL', icon: NavCheckIcon },
  { path: '/admin/professores', label: 'Professores', section: 'ACADÊMICO', icon: NavTeacherIcon },
  { path: '/admin/alunos', label: 'Alunos', section: 'ACADÊMICO', icon: NavStudentsIcon },
  { path: '/admin/relatorios', label: 'Relatórios', section: 'ACADÊMICO', icon: NavChartIcon },
  { path: '/admin/config', label: 'Configurações', section: 'ACADÊMICO', icon: NavGearIcon },
] as const;

export const ADMIN_TITLES: Record<string, [string, string]> = {
  '/admin': ['Visão geral', 'Resumo do semestre 2026.1'],
  '/admin/disciplinas': ['Disciplinas', 'Gerencie o catálogo de matérias'],
  '/admin/turmas': ['Turmas', 'Ofertas e alocação do semestre'],
  '/admin/matriculas': ['Matrículas', 'Pedidos e ajustes de matrícula'],
  '/admin/professores': ['Professores', 'Corpo docente e alocações'],
  '/admin/alunos': ['Alunos', 'Estudantes matriculados'],
  '/admin/relatorios': ['Relatórios', 'Indicadores acadêmicos'],
  '/admin/config': ['Configurações', 'Parâmetros do sistema'],
};

function NavHomeIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><path d="M3 9.5 10 4l7 5.5V17a1 1 0 0 1-1 1h-3.5v-5h-5v5H4a1 1 0 0 1-1-1V9.5Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>;
}
function NavBookIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H16v12.5H5.5A1.5 1.5 0 0 0 4 17V4.5Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /><path d="M4 15.5A1.5 1.5 0 0 1 5.5 14H16" fill="none" stroke={c} strokeWidth="1.7" /></svg>;
}
function NavGridIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><rect x="3" y="3" width="6.2" height="6.2" rx="1.6" fill="none" stroke={c} strokeWidth="1.7" /><rect x="10.8" y="3" width="6.2" height="6.2" rx="1.6" fill="none" stroke={c} strokeWidth="1.7" /><rect x="3" y="10.8" width="6.2" height="6.2" rx="1.6" fill="none" stroke={c} strokeWidth="1.7" /><rect x="10.8" y="10.8" width="6.2" height="6.2" rx="1.6" fill="none" stroke={c} strokeWidth="1.7" /></svg>;
}
function NavCheckIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><rect x="3.5" y="4" width="13" height="13" rx="3" fill="none" stroke={c} strokeWidth="1.7" /><path d="M7 10.5 9.2 12.7 13.5 8" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function NavTeacherIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><circle cx="10" cy="6.5" r="3.1" fill="none" stroke={c} strokeWidth="1.7" /><path d="M4 17c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function NavStudentsIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><circle cx="7" cy="7" r="2.6" fill="none" stroke={c} strokeWidth="1.7" /><circle cx="14" cy="7.5" r="2.2" fill="none" stroke={c} strokeWidth="1.7" /><path d="M2.5 16c0-2.6 2-4.3 4.5-4.3 1.2 0 2.3.4 3.1 1.1M11.5 16c0-2.4 1.7-3.9 3.8-3.9" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>;
}
function NavChartIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><path d="M3.5 16.5h13" stroke={c} strokeWidth="1.7" strokeLinecap="round" /><rect x="4.5" y="9" width="3" height="5" rx="1" fill={c} /><rect x="9.5" y="5.5" width="3" height="8.5" rx="1" fill={c} /><rect x="14.5" y="11" width="3" height="3" rx="1" fill={c} /></svg>;
}
function NavGearIcon(c: string) {
  return <svg width="19" height="19" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2.6" fill="none" stroke={c} strokeWidth="1.7" /><path d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState<{ open: boolean; course: AdminCourse | null }>({ open: false, course: null });
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pageTitle, pageSub] = ADMIN_TITLES[location.pathname] ?? ['', ''];

  const go = (path: string) => {
    setSidebarOpen(false);
    setSearch('');
    navigate(path);
  };

  const sections = ['PRINCIPAL', 'ACADÊMICO'] as const;

  return (
    <div className="admin-shell">
      {sidebarOpen && <div className="sheet-scrim mobile-only" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '6px 8px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <img src="/unicamp.svg" alt="Unicamp" style={{ height: 22, width: 'auto' }} />
          </div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Unicampus</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#FFC524', letterSpacing: '0.04em' }}>PAINEL ADMIN</div>
          </div>
        </div>

        <div className="scrollarea" style={{ flex: 1, overflowY: 'auto', marginTop: 6 }}>
          {sections.map((section) => (
            <div key={section}>
              <div style={{ marginTop: 22, fontSize: 10.5, fontWeight: 700, color: '#5a5a82', letterSpacing: '0.08em', padding: '0 10px 8px' }}>
                {section}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {NAV.filter((n) => n.section === section).map((n) => {
                  const active = location.pathname === n.path;
                  const stroke = active ? '#FFC524' : '#8a8ab0';
                  return (
                    <button key={n.path} className={`admin-navrow${active ? ' active' : ''}`} onClick={() => go(n.path)}>
                      <div style={{ width: 20, height: 20, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {n.icon(stroke)}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: active ? 800 : 600, color: active ? '#fff' : '#b6b6d0' }}>
                        {n.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          className="pressable"
          onClick={() => setConfirmLogout(true)}
          style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '11px 12px',
            display: 'flex', alignItems: 'center', gap: 11, border: 'none', width: '100%', textAlign: 'left',
          }}
          aria-label="Sair da conta"
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(150deg,#FFC524,#FF8A3D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: '#16153a' }}>
              {student ? initials(student.name) : '—'}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {student?.name}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#8a8ab0' }}>{student?.title ?? 'Professor(a)'}</div>
          </div>
          <IconLogout size={16} />
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="icon-circle pressable mobile-only"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
            style={{ width: 42, height: 42 }}
          >
            <svg width="17" height="17" viewBox="0 0 18 18">
              <line x1="2" y1="4.5" x2="16" y2="4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="2" y1="9" x2="16" y2="9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="2" y1="13.5" x2="16" y2="13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>{pageTitle}</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: '#8e8e98', marginTop: 1 }}>{pageSub}</div>
          </div>
          <div
            className="desktop-only"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, background: '#f1f1f4',
              borderRadius: 13, padding: '10px 14px', width: 280,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 18 18">
              <circle cx="8" cy="8" r="6" fill="none" stroke="#9a9aa4" strokeWidth="2" />
              <path d="M12.5 12.5 16 16" stroke="#9a9aa4" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar disciplina, professor, sala…"
              aria-label="Buscar no painel"
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, fontWeight: 600, color: '#16153a' }}
            />
          </div>
          <button
            className="pressable"
            onClick={() => setDrawer({ open: true, course: null })}
            style={{
              border: 'none', borderRadius: 13, background: '#FFC524', color: '#16153a',
              fontSize: 14, fontWeight: 800, padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 20px rgba(255,197,36,0.4)',
            }}
          >
            <IconPlus size={16} />
            <span className="desktop-only">Nova disciplina</span>
          </button>
        </header>

        <div className="admin-content">
          <AdminContext.Provider
            value={{
              search,
              setSearch,
              openCourseDrawer: (course) => setDrawer({ open: true, course: course ?? null }),
            }}
          >
            <Outlet />
          </AdminContext.Provider>
        </div>
      </main>

      {drawer.open && (
        <AdminCourseDrawer
          course={drawer.course}
          onClose={() => setDrawer({ open: false, course: null })}
        />
      )}

      {isDevMode && <div className="dev-badge">MODO DEV · dados de exemplo</div>}

      <BottomSheet
        open={confirmLogout}
        icon={<IconLogout size={22} />}
        danger
        title="Sair da conta?"
        subtitle="Você vai precisar entrar de novo para acessar o painel."
        confirmLabel="Sair"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
          navigate('/entrar');
        }}
      />
    </div>
  );
}
