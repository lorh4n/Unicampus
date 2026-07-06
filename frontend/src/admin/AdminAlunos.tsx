// Admin → Alunos: visão geral de matrícula, sem editar notas/faltas
// (isso é exclusivo do professor da turma — BUSINESS_RULES.md §3).
import { useQuery } from '@tanstack/react-query';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { repos } from '../data/repositories';
import { useAdmin } from './AdminLayout';

const HEADERS = ['ALUNO', 'CURSO', 'SEMESTRE', 'CR', 'CP'];
const GRID = '2fr 1.8fr 1fr 0.8fr 0.8fr';

export function AdminAlunos() {
  const { search } = useAdmin();
  const query = useQuery({ queryKey: ['admin', 'students'], queryFn: () => repos.admin.listStudents() });

  if (query.isLoading) return <ListSkeleton rows={5} height={60} />;
  if (query.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={() => void query.refetch()} />
      </div>
    );
  }

  const q = search.trim().toLowerCase();
  const list = (query.data ?? []).filter((s) =>
    q ? `${s.name} ${s.ra} ${s.course}`.toLowerCase().includes(q) : true,
  );

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e98', marginBottom: 18 }}>
        {list.length} aluno{list.length === 1 ? '' : 's'}
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: '1px solid #eeeef2', background: '#fafafb' }}>
              {HEADERS.map((h) => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em' }}>{h}</div>
              ))}
            </div>

            {list.map((s, i) => (
              <div key={s.id} className="crow" style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14, padding: '13px 22px', borderTop: '1px solid #f4f4f7', animationDelay: `${i * 0.04}s` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#8e8e98' }}>RA {s.ra}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#56565e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.course}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#56565e' }}>{s.semester}</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#16153a' }}>{s.cr.toFixed(1)}</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#16153a' }}>{s.cp.toFixed(2)}</div>
              </div>
            ))}

            {list.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: '#9a9aa4', fontSize: 14, fontWeight: 600 }}>
                Nenhum aluno encontrado{search.trim() ? ` para "${search.trim()}"` : ''}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
