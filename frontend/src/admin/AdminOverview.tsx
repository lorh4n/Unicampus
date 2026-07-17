// Visão geral do painel admin (design Admin Web).
import { useNavigate } from 'react-router-dom';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import type { AdminActivity, AdminStatCard } from '../models';
import { courseGradient } from '../theme/tokens';
import { useAdminOverviewViewModel } from '../viewmodels/admin';
import { statusChipStyle } from './statusChip';

const CARD_ICON: Record<AdminStatCard['kind'], { bg: string; icon: JSX.Element }> = {
  disciplinas: {
    bg: '#FFF1E6',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H16v12.5H5.5A1.5 1.5 0 0 0 4 17V4.5Z" fill="none" stroke="#F2762E" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M4 15.5A1.5 1.5 0 0 1 5.5 14H16" fill="none" stroke="#F2762E" strokeWidth="1.7" />
      </svg>
    ),
  },
  turmas: {
    bg: '#EAF1FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20">
        <rect x="3" y="3" width="6.2" height="6.2" rx="1.6" fill="none" stroke="#2D6FE0" strokeWidth="1.7" />
        <rect x="10.8" y="3" width="6.2" height="6.2" rx="1.6" fill="none" stroke="#2D6FE0" strokeWidth="1.7" />
        <rect x="3" y="10.8" width="6.2" height="6.2" rx="1.6" fill="none" stroke="#2D6FE0" strokeWidth="1.7" />
        <rect x="10.8" y="10.8" width="6.2" height="6.2" rx="1.6" fill="none" stroke="#2D6FE0" strokeWidth="1.7" />
      </svg>
    ),
  },
  alunos: {
    bg: '#F3EEFF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="7" cy="7" r="2.6" fill="none" stroke="#7C4DFF" strokeWidth="1.7" />
        <circle cx="14" cy="7.5" r="2.2" fill="none" stroke="#7C4DFF" strokeWidth="1.7" />
        <path d="M2.5 16c0-2.6 2-4.3 4.5-4.3 1.2 0 2.3.4 3.1 1.1M11.5 16c0-2.4 1.7-3.9 3.8-3.9" fill="none" stroke="#7C4DFF" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  professores: {
    bg: '#E6F7F2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="6.5" r="3.1" fill="none" stroke="#16A085" strokeWidth="1.7" />
        <path d="M4 17c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2" fill="none" stroke="#16A085" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
};

const ACTIVITY_COLOR: Record<AdminActivity['kind'], { dot: string; bg: string }> = {
  criacao: { dot: '#16A085', bg: '#E6F7F2' },
  alocacao: { dot: '#2D6FE0', bg: '#EAF1FF' },
  matricula: { dot: '#F2762E', bg: '#FFF1E6' },
  criterios: { dot: '#7C4DFF', bg: '#F3EEFF' },
};

export function AdminOverview() {
  const navigate = useNavigate();
  const vm = useAdminOverviewViewModel();

  if (vm.isLoading) return <ListSkeleton rows={3} height={160} />;
  if (vm.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  return (
    <div>
      {/* stat cards */}
      <div className="admin-stat-grid">
        {vm.cards.map((card) => {
          const hasDelta = card.delta.trim() !== '' && card.delta !== '+0';
          return (
            <div key={card.kind} className="admin-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: CARD_ICON[card.kind].bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {CARD_ICON[card.kind].icon}
                </div>
                {hasDelta && (
                  <span
                    style={{
                      fontSize: 12, fontWeight: 800, borderRadius: 8, padding: '3px 8px',
                      color: '#16A085', background: '#E6F7F2',
                    }}
                  >
                    {card.delta}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 14 }}>{card.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e98', marginTop: 1 }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* chart + activity */}
      <div className="admin-dash-grid">
        <div className="admin-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>Matrículas por disciplina</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: '#8e8e98', marginTop: 1 }}>Turmas ativas do semestre</div>
            </div>
            <div style={{ background: '#f1f1f4', borderRadius: 10, padding: '7px 12px', fontSize: 12.5, fontWeight: 700, color: '#16153a' }}>
              2026.1
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, height: 188, paddingTop: 18 }}>
            {vm.chart.map((b, i) => {
              const last = i === vm.chart.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: last ? '#16153a' : '#9a9aa4' }}>{b.label}</span>
                  <div
                    style={{
                      width: '100%', maxWidth: 46,
                      height: Math.round((b.value / vm.maxChart) * 150),
                      borderRadius: '9px 9px 4px 4px',
                      background: last ? 'linear-gradient(180deg,#FFC524,#FF8A3D)' : '#ECECF2',
                      transformOrigin: 'bottom',
                      animation: 'growBar .6s cubic-bezier(.2,.7,.3,1) both',
                      boxShadow: last ? '0 6px 16px rgba(255,138,61,0.35)' : 'none',
                    }}
                  />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#9a9aa4' }}>{b.period}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-card" style={{ padding: 22 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 16 }}>Atividade recente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {vm.activity.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 10, background: ACTIVITY_COLOR[a.kind].bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACTIVITY_COLOR[a.kind].dot }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#16153a', lineHeight: 1.35 }}>{a.text}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#a0a0aa', marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recém-criadas */}
      <div className="admin-card" style={{ marginTop: 18, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px 14px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>Disciplinas recém-criadas</div>
          <button
            className="pressable"
            onClick={() => navigate('/admin/disciplinas')}
            style={{ border: 'none', background: 'transparent', fontSize: 13, fontWeight: 800, color: '#F2762E', padding: '4px 6px' }}
          >
            Ver todas →
          </button>
        </div>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            {vm.recentCourses.map((c) => (
              <div
                key={c.id}
                className="crow"
                style={{
                  display: 'grid', gridTemplateColumns: '2.8fr 0.8fr 0.9fr',
                  alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: '1px solid #f1f1f4',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: 12, background: courseGradient(c.color),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{c.code}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: '#8e8e98' }}>{c.credits} créditos</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#16153a' }}>
                  {c.studentCount} <span style={{ fontSize: 11, color: '#9a9aa4', fontWeight: 600 }}>alunos</span>
                </div>
                <div>
                  <span style={statusChipStyle(c.status)}>{c.status === 'ativa' ? 'Ativa' : 'Rascunho'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
