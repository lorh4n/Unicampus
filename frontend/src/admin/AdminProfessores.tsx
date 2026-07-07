// Admin → Professores: o Admin cadastra/edita/remove professores (é o "pai de tudo").
// O score é só leitura — quem avalia são os alunos (BUSINESS_RULES.md §3, §4.4).
import { useState } from 'react';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconPlus } from '../components/icons';
import { initials } from '../utils/format';
import type { Professor } from '../models';
import { useAdminProfessorsViewModel } from '../viewmodels/adminProfessores';
import { useAdmin } from './AdminLayout';
import { AdminProfessorDrawer } from './AdminProfessorDrawer';

const HEADERS = ['PROFESSOR', 'DEPARTAMENTO', 'SCORE GERAL', 'AVALIAÇÕES', 'AÇÕES'];
const GRID = '2.2fr 1.8fr 1.2fr 0.9fr 0.6fr';

function scoreColor(v: number): string {
  if (v >= 4) return '#16A085';
  if (v >= 3) return '#F2762E';
  return '#FF5A4D';
}
function scoreBg(v: number): string {
  if (v >= 4) return '#E6F7F2';
  if (v >= 3) return '#FFF1E6';
  return '#FFEDEC';
}

export function AdminProfessores() {
  const { search, setSearch } = useAdmin();
  const vm = useAdminProfessorsViewModel(search);
  const [drawer, setDrawer] = useState<{ open: boolean; professor: Professor | null }>({ open: false, professor: null });

  if (vm.isLoading) return <ListSkeleton rows={5} height={64} />;
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
          className="input" value={search} placeholder="Buscar professor…"
          aria-label="Buscar professor" onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#8e8e98' }}>
          {vm.professors.length} professor{vm.professors.length === 1 ? '' : 'es'}
        </div>
        <button
          className="pressable"
          onClick={() => setDrawer({ open: true, professor: null })}
          style={{
            border: 'none', borderRadius: 12, background: '#FFC524', color: '#16153a', fontSize: 13,
            fontWeight: 800, padding: '9px 15px', display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 6px 16px rgba(255,197,36,0.35)',
          }}
        >
          <IconPlus size={15} /> Novo professor
        </button>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: '1px solid #eeeef2', background: '#fafafb' }}>
              {HEADERS.map((h) => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em', textAlign: h === 'AÇÕES' ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>

            {vm.professors.map((p, i) => (
              <div
                key={p.id}
                className="crow pressable-row"
                role="button"
                onClick={() => setDrawer({ open: true, professor: p })}
                style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: '1px solid #f4f4f7', animationDelay: `${i * 0.04}s` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eceaf2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#16153a' }}>{initials(p.name)}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: '#8e8e98', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#56565e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.department}
                </div>
                <div>
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800,
                      color: scoreColor(p.scores.overall), background: scoreBg(p.scores.overall),
                      borderRadius: 9, padding: '5px 10px',
                    }}
                  >
                    ⭐ {p.scores.overall.toFixed(1)}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#16153a' }}>{p.scores.ratingsCount}</div>
                <div className="rowact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <button
                    className="pressable" aria-label={`Editar ${p.name}`}
                    onClick={(e) => { e.stopPropagation(); setDrawer({ open: true, professor: p }); }}
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16">
                      <path d="M2.5 11.2 10 3.7l2.3 2.3-7.5 7.5L2 14l.5-2.8Z" fill="none" stroke="#16153a" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {vm.professors.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: '#9a9aa4', fontSize: 14, fontWeight: 600 }}>
                Nenhum professor encontrado{search.trim() ? ` para "${search.trim()}"` : ''}.
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer.open && <AdminProfessorDrawer professor={drawer.professor} onClose={() => setDrawer({ open: false, professor: null })} />}
    </div>
  );
}
