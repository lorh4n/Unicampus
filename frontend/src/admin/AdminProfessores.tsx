// Admin → Professores: tabela só de leitura. Ninguém edita o score manualmente
// — quem gera a nota são os alunos (BUSINESS_RULES.md §3, §4.4).
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { initials } from '../utils/format';
import { useAdmin } from './AdminLayout';
import { useProfessorsQuery } from '../viewmodels/adminTurmas';

const HEADERS = ['PROFESSOR', 'DEPARTAMENTO', 'SCORE GERAL', 'AVALIAÇÕES'];
const GRID = '2.2fr 1.8fr 1.4fr 1fr';

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
  const { search } = useAdmin();
  const query = useProfessorsQuery();

  if (query.isLoading) return <ListSkeleton rows={5} height={64} />;
  if (query.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    );
  }

  const q = search.trim().toLowerCase();
  const list = (query.data ?? []).filter((p) =>
    q ? `${p.name} ${p.department}`.toLowerCase().includes(q) : true,
  );

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e98', marginBottom: 18 }}>
        {list.length} professor{list.length === 1 ? '' : 'es'}
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: '1px solid #eeeef2', background: '#fafafb' }}>
              {HEADERS.map((h) => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em' }}>{h}</div>
              ))}
            </div>

            {list.map((p, i) => (
              <div key={p.id} className="crow" style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: '1px solid #f4f4f7', animationDelay: `${i * 0.04}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eceaf2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#16153a' }}>{initials(p.name)}</span>
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
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
              </div>
            ))}

            {list.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: '#9a9aa4', fontSize: 14, fontWeight: 600 }}>
                Nenhum professor encontrado{search.trim() ? ` para "${search.trim()}"` : ''}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
