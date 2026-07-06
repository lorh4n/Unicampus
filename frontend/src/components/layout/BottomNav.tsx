import { useLocation, useNavigate } from 'react-router-dom';
import { NavBars, NavCalendar, NavHome, NavPerson } from '../icons';

const TABS = [
  { path: '/app/inicio', label: 'Início', Icon: NavHome },
  { path: '/app/grade', label: 'Grade horária', Icon: NavCalendar },
  { path: '/app/estatisticas', label: 'Estatísticas', Icon: NavBars },
  { path: '/app/perfil', label: 'Perfil', Icon: NavPerson },
];

/** Pílula navy do mobile; a aba ativa ganha círculo amarelo (design). */
export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="bottom-nav-wrap mobile-only">
      <nav className="bottom-nav">
        {TABS.map(({ path, label, Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              className="pressable"
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(path)}
              style={{
                border: 'none', background: isActive ? '#FFC524' : 'transparent',
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
              }}
            >
              <Icon active={isActive} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
