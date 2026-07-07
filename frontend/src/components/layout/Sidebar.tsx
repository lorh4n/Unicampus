import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/format';
import { IconLogout, IconPlus } from '../icons';
import { NAV_ITEMS } from './navItems';

/** Navegação fixa do desktop (equivalente ao drawer do design). */
export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 8px' }}>
        <img src="/unicamp.svg" alt="Unicamp" style={{ height: 32, width: 'auto' }} />
        <div
          className="pressable-row"
          role="button"
          onClick={() => navigate('/app/perfil')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 20px' }}
        >
          <div
            style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'linear-gradient(150deg,#F2762E,#FF9D4D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {student ? initials(student.name) : '—'}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#16153a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {student?.name}
            </div>
            <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500 }}>RA {student?.ra}</div>
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`nav-item${location.pathname.startsWith(item.path) ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <button
          className="btn-primary pressable"
          style={{ marginTop: 14, padding: 14 }}
          onClick={() => navigate('/app/matricular')}
        >
          <IconPlus size={16} />
          Matricular-se
        </button>
      </nav>

      <button className="nav-item" onClick={onLogout} style={{ color: '#FF5A4D', fontWeight: 800 }}>
        <span className="nav-icon" style={{ background: '#FFEDEC' }}>
          <IconLogout size={16} />
        </span>
        Sair
      </button>
      <div style={{ fontSize: 11, color: '#a8a8b2', fontWeight: 500, textAlign: 'center', marginTop: 8 }}>
        Unicampus · v1.0.0
      </div>
    </aside>
  );
}
