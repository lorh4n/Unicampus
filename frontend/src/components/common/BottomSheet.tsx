import type { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Bottom sheet de confirmação (SPEC §12.4): scrim + folha, Cancelar/Confirmar. */
export function BottomSheet({
  open, icon, title, subtitle, confirmLabel, danger, onConfirm, onCancel,
}: BottomSheetProps) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-scrim" onClick={onCancel} />
      <div className="sheet">
        <div className="sheet-handle" />
        {icon && (
          <div
            style={{
              width: 54, height: 54, borderRadius: 18, margin: '0 auto 14px',
              background: danger ? '#FFEDEC' : '#FFF4E8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ fontSize: 18, fontWeight: 800, color: '#16153a', textAlign: 'center' }}>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: 13.5, color: '#8e8e98', fontWeight: 500, textAlign: 'center',
              marginTop: 6, lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button className="btn-ghost pressable" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn-primary pressable"
            style={{
              flex: 1, width: 'auto', padding: 15,
              ...(danger
                ? { background: '#FF5A4D', color: '#fff', boxShadow: '0 10px 24px rgba(255,90,77,0.35)' }
                : {}),
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
