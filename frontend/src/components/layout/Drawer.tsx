import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/format';
import { IconClose, IconLogout, IconPlus } from '../icons';
import { NAV_ITEMS } from './navItems';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

/** Menu lateral do mobile (aberto pelo botão de menu das telas raiz). */
export function Drawer({ open, onClose, onLogout }: DrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = useAuth();
  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="drawer">
        <div style={{ padding: '26px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/unicamp.svg" alt="Unicamp" style={{ height: 30, width: 'auto' }} />
            <button className="icon-circle-white pressable" aria-label="Fechar menu" onClick={onClose} style={{ width: 36, height: 36 }}>
              <IconClose />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
            <div
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'linear-gradient(150deg,#F2762E,#FF9D4D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                {student ? initials(student.name) : '—'}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a' }}>{student?.name}</div>
              <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500 }}>RA {student?.ra}</div>
            </div>
          </div>
        </div>

        <div className="scrollarea" style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`nav-item${location.pathname.startsWith(item.path) ? ' active' : ''}`}
              onClick={() => go(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="nav-item" onClick={() => go('/app/matricular')}>
            <span className="nav-icon">
              <IconPlus size={15} />
            </span>
            Matricular-se
          </button>
        </div>

        <div style={{ padding: '0 16px 30px' }}>
          <button className="nav-item" onClick={onLogout} style={{ color: '#FF5A4D', fontWeight: 800 }}>
            <span className="nav-icon" style={{ background: '#FFEDEC' }}>
              <IconLogout size={16} />
            </span>
            Sair
          </button>
          <div style={{ fontSize: 11, color: '#a8a8b2', fontWeight: 500, textAlign: 'center', marginTop: 14 }}>
            Unicampus · v1.0.0
          </div>
        </div>
      </div>
    </>
  );
}
