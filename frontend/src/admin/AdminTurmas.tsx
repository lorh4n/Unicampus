// Admin → Turmas: aloca professor/horário a cada disciplina do catálogo.
// PDD não aparece aqui — é do professor (BUSINESS_RULES.md §4.3).
import { useState } from 'react';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconPlus } from '../components/icons';
import { fmtSlot } from '../utils/format';
import { courseGradient } from '../theme/tokens';
import type { Turma } from '../models';
import { useAdminTurmasViewModel, type AdminFilter } from '../viewmodels/adminTurmas';
import { useAdmin } from './AdminLayout';
import { statusChipStyle } from './statusChip';
import { AdminTurmaDrawer } from './AdminTurmaDrawer';

const FILTERS: Array<{ key: AdminFilter; label: string }> = [
  { key: 'todas', label: 'Todas' },
  { key: 'ativas', label: 'Ativas' },
  { key: 'rascunho', label: 'Rascunhos' },
];

const HEADERS = ['TURMA', 'PROFESSOR', 'HORÁRIOS', 'ALUNOS', 'STATUS', 'AÇÕES'];
const GRID = '2fr 1.5fr 1.8fr 0.7fr 0.9fr 0.6fr';

export function AdminTurmas() {
  const { search, setSearch } = useAdmin();
  const vm = useAdminTurmasViewModel(search);
  const [drawer, setDrawer] = useState<{ open: boolean; turma: Turma | null }>({ open: false, turma: null });

  if (vm.isLoading) return <ListSkeleton rows={5} height={68} />;
  if (vm.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  return (
    <div>
      <div className="mobile-only" style={{ marginBottom: 12 }}>
        <input
          className="input" value={search} placeholder="Buscar turma, professor…"
          aria-label="Buscar turma" onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => {
          const active = vm.filter === f.key;
          return (
            <button
              key={f.key}
              className="pressable"
              onClick={() => vm.setFilter(f.key)}
              style={{
                border: 'none', borderRadius: 12, padding: '9px 15px', fontSize: 13, fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 7,
                ...(active ? { background: '#16153a', color: '#fff' } : { background: '#fff', color: '#56565e', boxShadow: '0 2px 8px rgba(20,20,45,0.05)' }),
              }}
            >
              {f.label} <span style={{ opacity: 0.6, fontWeight: 700 }}>{vm.counts[f.key]}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button
          className="pressable"
          onClick={() => setDrawer({ open: true, turma: null })}
          style={{
            border: 'none', borderRadius: 12, background: '#FFC524', color: '#16153a', fontSize: 13,
            fontWeight: 800, padding: '9px 15px', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 6px 16px rgba(255,197,36,0.35)',
          }}
        >
          <IconPlus size={15} /> Nova turma
        </button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: '1px solid #eeeef2', background: '#fafafb' }}>
              {HEADERS.map((h) => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em', textAlign: h === 'AÇÕES' ? 'right' : 'left' }}>
                  {h}
                </div>
              ))}
            </div>

            {vm.turmas.map((t, i) => (
              <div key={t.id} className="crow" style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: '1px solid #f4f4f7', animationDelay: `${i * 0.04}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: courseGradient(t.color), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: '#fff' }}>{t.courseCode}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.courseName}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: '#8e8e98' }}>{t.className}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#56565e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.professorName}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#56565e' }}>
                  {t.slots.map((s) => fmtSlot(s.weekday, s.start, s.end)).join(' · ') || '—'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t.roster.length}</div>
                <div>
                  <span style={statusChipStyle(t.status)}>{t.status === 'ativa' ? 'Ativa' : 'Rascunho'}</span>
                </div>
                <div className="rowact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <button
                    className="pressable" aria-label={`Editar ${t.className}`}
                    onClick={() => setDrawer({ open: true, turma: t })}
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16">
                      <path d="M2.5 11.2 10 3.7l2.3 2.3-7.5 7.5L2 14l.5-2.8Z" fill="none" stroke="#16153a" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {vm.turmas.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: '#9a9aa4', fontSize: 14, fontWeight: 600 }}>
                Nenhuma turma encontrada{search.trim() ? ` para "${search.trim()}"` : ''}.
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer.open && <AdminTurmaDrawer turma={drawer.turma} onClose={() => setDrawer({ open: false, turma: null })} />}
    </div>
  );
}
