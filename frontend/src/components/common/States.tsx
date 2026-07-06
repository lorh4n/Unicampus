import { PrimaryButton } from './PrimaryButton';

/** Estado de erro com retry (SPEC §11.5). */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#16153a' }}>Algo deu errado</div>
      <div style={{ fontSize: 13.5, color: '#8e8e98', fontWeight: 500, margin: '6px 0 20px' }}>
        Não foi possível carregar os dados. Verifique sua conexão.
      </div>
      <PrimaryButton onClick={onRetry}>Tentar de novo</PrimaryButton>
    </div>
  );
}

/** Estado vazio "Nenhuma disciplina ainda" (SPEC §13.7). */
export function EmptyState({
  title, subtitle, actionLabel, onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '38px 24px' }}>
      <div style={{ position: 'relative', width: 130, height: 110, margin: '0 auto 18px' }}>
        {[{ l: 0, t: 18, r: -10 }, { l: 28, t: 8, r: 6 }, { l: 56, t: 22, r: -4 }].map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', left: p.l, top: p.t, width: 66, height: 84,
              borderRadius: 16, border: '2px dashed #cfcfd6', background: '#fff',
              transform: `rotate(${p.r}deg)`,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 17, fontWeight: 800, color: '#16153a' }}>{title}</div>
      <div style={{ fontSize: 13.5, color: '#8e8e98', fontWeight: 500, margin: '6px 0 20px', lineHeight: 1.4 }}>
        {subtitle}
      </div>
      {actionLabel && onAction && <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>}
    </div>
  );
}
