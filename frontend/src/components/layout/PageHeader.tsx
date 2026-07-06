import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBack, IconMenuGrid } from '../icons';
import { useDrawer } from './drawerContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** true = tela profunda: botão voltar; false = tela raiz: menu no mobile. */
  back?: boolean;
  right?: ReactNode;
}

/** Cabeçalho de página: raiz mostra menu (mobile) + título; profunda mostra voltar. */
export function PageHeader({ title, subtitle, back, right }: PageHeaderProps) {
  const navigate = useNavigate();
  const { openDrawer } = useDrawer();

  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 20,
      }}
    >
      {back ? (
        <button className="icon-circle-white pressable" aria-label="Voltar" onClick={() => navigate(-1)}>
          <IconBack />
        </button>
      ) : (
        <button className="icon-circle pressable mobile-only" aria-label="Abrir menu" onClick={openDrawer}>
          <IconMenuGrid />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#16153a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {right}
    </header>
  );
}
