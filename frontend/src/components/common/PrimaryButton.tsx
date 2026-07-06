import type { ReactNode } from 'react';
import { IconCheck } from '../icons';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  type?: 'button' | 'submit';
}

/** Botão amarelo com estados padrão/carregando/sucesso/desabilitado (SPEC §12.2). */
export function PrimaryButton({ children, onClick, disabled, loading, success, type = 'button' }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`btn-primary pressable${success ? ' success' : ''}`}
      onClick={onClick}
      disabled={disabled || loading || success}
      style={success ? { opacity: 1 } : undefined}
    >
      {loading ? (
        <span className="spinner" aria-label="Carregando" />
      ) : success ? (
        <>
          <IconCheck size={17} />
          Feito!
        </>
      ) : (
        children
      )}
    </button>
  );
}
