// Lista das turmas do professor logado (BUSINESS_RULES.md §2).
import { useNavigate } from 'react-router-dom';
import { ListSkeleton } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/States';
import { courseGradient } from '../theme/tokens';
import { fmtSlot } from '../utils/format';
import { statusChipStyle } from '../admin/statusChip';
import { useMyTurmasViewModel } from '../viewmodels/professor';

export function ProfessorClasses() {
  const navigate = useNavigate();
  const vm = useMyTurmasViewModel();

  if (vm.isLoading) return <ListSkeleton rows={3} height={110} />;
  if (vm.isError) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }
  if (vm.turmas.length === 0) {
    return (
      <div className="container-narrow">
        <EmptyState title="Nenhuma turma alocada" subtitle="Quando o Admin alocar você a uma turma, ela aparece aqui." />
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {vm.turmas.map((t) => {
        const pendingGrades = t.criteria.filter((c) => c.grade === null).length;
        return (
          <div
            key={t.id}
            className="admin-card hover-lift float-in"
            role="button"
            onClick={() => navigate(`/professor/turmas/${t.id}`)}
            style={{ padding: 20, cursor: 'pointer', animationDelay: `${vm.turmas.indexOf(t) * 0.05}s` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
              <div
                style={{
                  width: 46, height: 46, borderRadius: 13, background: courseGradient(t.color),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{t.courseCode}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.courseName}
                </div>
                <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500 }}>{t.className}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {t.slots.map((s) => (
                <div key={s.id} style={{ fontSize: 12.5, color: '#56565e', fontWeight: 600 }}>
                  {fmtSlot(s.weekday, s.start, s.end)} · {s.room}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={statusChipStyle(t.status)}>{t.status === 'ativa' ? 'Ativa' : 'Rascunho'}</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#16153a' }}>
                {t.roster.length} aluno{t.roster.length === 1 ? '' : 's'}
              </span>
            </div>

            {pendingGrades > 0 && (
              <div style={{ marginTop: 10, fontSize: 11.5, fontWeight: 700, color: '#F2762E' }}>
                {pendingGrades} avaliação{pendingGrades === 1 ? '' : 'ões'} sem nota lançada
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
