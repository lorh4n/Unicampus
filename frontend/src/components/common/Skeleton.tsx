import type { CSSProperties } from 'react';

export function Skeleton({ style, delay = 0 }: { style?: CSSProperties; delay?: number }) {
  return <div className="skeleton" style={{ animationDelay: `${delay}s`, ...style }} />;
}

/** Silhueta do dashboard enquanto carrega (SPEC §12.5). */
export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton style={{ height: 34, width: 220, marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <Skeleton style={{ flex: 1, height: 108, borderRadius: 24 }} />
        <Skeleton style={{ flex: 1, height: 108, borderRadius: 24 }} delay={0.12} />
      </div>
      <Skeleton style={{ height: 80, borderRadius: 24, marginBottom: 12 }} delay={0.2} />
      <Skeleton style={{ height: 62, borderRadius: 20, marginBottom: 24 }} delay={0.28} />
      <div style={{ display: 'flex', gap: 13 }}>
        <Skeleton style={{ width: 152, height: 208, borderRadius: 22, flex: 'none' }} delay={0.34} />
        <Skeleton style={{ width: 152, height: 208, borderRadius: 22, flex: 'none' }} delay={0.42} />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4, height = 72 }: { rows?: number; height?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} style={{ height, borderRadius: 18 }} delay={i * 0.08} />
      ))}
    </div>
  );
}
