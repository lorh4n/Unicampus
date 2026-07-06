// Catálogo de disciplinas do painel admin — só dados de catálogo (código, área,
// créditos, cor). Professor e horários vivem em Turmas (BUSINESS_RULES.md §3).
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { courseGradient } from '../theme/tokens';
import { useAdminCoursesViewModel, type AdminFilter } from '../viewmodels/admin';
import { useAdmin } from './AdminLayout';
import { statusChipStyle } from './statusChip';

const FILTERS: Array<{ key: AdminFilter; label: string }> = [
  { key: 'todas', label: 'Todas' },
  { key: 'ativas', label: 'Ativas' },
  { key: 'rascunho', label: 'Rascunhos' },
];

const HEADERS = ['DISCIPLINA', 'CRÉD.', 'TURMAS', 'ALUNOS', 'STATUS', 'AÇÕES'];
const GRID = '2.6fr 0.7fr 0.7fr 0.8fr 1fr 0.6fr';

export function AdminCourses() {
  const { search, setSearch, openCourseDrawer } = useAdmin();
  const vm = useAdminCoursesViewModel(search);

  if (vm.isLoading) return <ListSkeleton rows={6} height={68} />;
  if (vm.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  return (
    <div>
      {/* busca (mobile) + filtros */}
      <div className="mobile-only" style={{ marginBottom: 12 }}>
        <input
          className="input"
          value={search}
          placeholder="Buscar disciplina, professor…"
          aria-label="Buscar disciplina"
          onChange={(e) => setSearch(e.target.value)}
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
                ...(active
                  ? { background: '#16153a', color: '#fff' }
                  : { background: '#fff', color: '#56565e', boxShadow: '0 2px 8px rgba(20,20,45,0.05)' }),
              }}
            >
              {f.label} <span style={{ opacity: 0.6, fontWeight: 700 }}>{vm.counts[f.key]}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e98' }}>
          {vm.courses.length} disciplina{vm.courses.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-table-scroll">
          <div className="admin-table-min">
            <div
              style={{
                display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14,
                padding: '14px 22px', borderBottom: '1px solid #eeeef2', background: '#fafafb',
              }}
            >
              {HEADERS.map((h) => (
                <div
                  key={h}
                  style={{
                    fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em',
                    textAlign: h === 'AÇÕES' ? 'right' : 'left',
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {vm.courses.map((c, i) => (
              <div
                key={c.id}
                className="crow"
                style={{
                  display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', gap: 14,
                  padding: '13px 22px', borderTop: '1px solid #f4f4f7',
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12, background: courseGradient(c.color),
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{c.code}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: '#8e8e98' }}>{c.area}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.credits}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.classCount}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.studentCount}</div>
                <div>
                  <span style={statusChipStyle(c.status)}>{c.status === 'ativa' ? 'Ativa' : 'Rascunho'}</span>
                </div>
                <div className="rowact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <button
                    className="pressable"
                    aria-label={`Editar ${c.code}`}
                    onClick={() => openCourseDrawer(c)}
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16">
                      <path d="M2.5 11.2 10 3.7l2.3 2.3-7.5 7.5L2 14l.5-2.8Z" fill="none" stroke="#16153a" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {vm.courses.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: '#9a9aa4', fontSize: 14, fontWeight: 600 }}>
                Nenhuma disciplina encontrada{search.trim() ? ` para "${search.trim()}"` : ''}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
