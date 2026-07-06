// Casca do dashboard do Professor — mesmo sistema visual do Admin, mas com
// responsabilidades diferentes: só as próprias turmas (BUSINESS_RULES.md §2).
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isDevMode } from '../data/repositories';
import { initials } from '../utils/format';
import { BottomSheet } from '../components/common/BottomSheet';
import { IconLogout } from '../components/icons';

const NAV = [
  {
    path: '/professor', label: 'Minhas turmas',
    icon: (c: string) => (
      <svg width="19" height="19" viewBox="0 0 20 20">
        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H16v12.5H5.5A1.5 1.5 0 0 0 4 17V4.5Z" fill="none" stroke={c} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M4 15.5A1.5 1.5 0 0 1 5.5 14H16" fill="none" stroke={c} strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    path: '/professor/avaliacao', label: 'Minha avaliação',
    icon: (c: string) => (
      <svg width="19" height="19" viewBox="0 0 20 20">
        <path d="M10 2 3 5.5v5c0 4.2 3 7 7 8.5 4-1.5 7-4.3 7-8.5v-5L10 2Z" fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7 10.3 9.3 12.6 13.5 8" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
] as const;

export const PROFESSOR_TITLES: Record<string, [string, string]> = {
  '/professor': ['Minhas turmas', 'Turmas em que você é o professor alocado'],
  '/professor/avaliacao': ['Minha avaliação', 'Score dado pelos alunos — só leitura'],
};

export function ProfessorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const exactTitle = PROFESSOR_TITLES[location.pathname];
  const [pageTitle, pageSub] = exactTitle ?? ['Turma', 'Detalhe da turma'];

  const go = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

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
            <div style={{ fontSize: 11, fontWeight: 600, color: '#FFC524', letterSpacing: '0.04em' }}>PAINEL PROFESSOR</div>
          </div>
        </div>

        <div style={{ flex: 1, marginTop: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {NAV.map((n) => {
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
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

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
