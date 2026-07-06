import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Drawer } from './Drawer';
import { BottomSheet } from '../common/BottomSheet';
import { IconLogout } from '../icons';
import { useAuth } from '../../context/AuthContext';
import { isDevMode } from '../../data/repositories';
import { DrawerContext } from './drawerContext';

/** Casca autenticada: sidebar (desktop), bottom nav (mobile), drawer e logout. */
export function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const askLogout = () => {
    setDrawerOpen(false);
    setConfirmLogout(true);
  };

  return (
    <div className="app-shell">
      <Sidebar onLogout={askLogout} />
      <main className="app-main">
        <DrawerContext.Provider value={{ openDrawer: () => setDrawerOpen(true) }}>
          <Outlet />
        </DrawerContext.Provider>
      </main>
      <BottomNav />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onLogout={askLogout} />
      {isDevMode && <div className="dev-badge">MODO DEV · dados de exemplo</div>}
      <BottomSheet
        open={confirmLogout}
        icon={<IconLogout size={22} />}
        danger
        title="Sair da conta?"
        subtitle="Você vai precisar entrar de novo com RA e senha."
        confirmLabel="Sair"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
          navigate('/bem-vindo');
        }}
      />
    </div>
  );
}
