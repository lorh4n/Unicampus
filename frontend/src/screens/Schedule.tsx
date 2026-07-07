import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { TimetableGrid } from '../components/grade/TimetableGrid';
import { ListSkeleton } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/States';
import { IconSearch } from '../components/icons';
import { useScheduleViewModel } from '../viewmodels/useScheduleViewModel';

export function Schedule() {
  const navigate = useNavigate();
  const vm = useScheduleViewModel();

  return (
    <div className="container">
      <PageHeader
        title="Grade horária"
        subtitle={`Semestre 2026.1 · ${vm.totalCredits} créditos`}
        right={
          <button className="icon-circle pressable" aria-label="Buscar" onClick={() => navigate('/app/busca')}>
            <IconSearch />
          </button>
        }
      />

      {vm.isLoading ? (
        <ListSkeleton rows={5} height={90} />
      ) : vm.isError ? (
        <ErrorState onRetry={vm.retry} />
      ) : vm.isEmpty ? (
        <div className="container-narrow">
          <EmptyState
            title="Sem aulas na grade"
            subtitle="Cadastre os horários das suas disciplinas para montar a grade semanal."
            actionLabel="Matricular-se"
            onAction={() => navigate('/app/matricular')}
          />
        </div>
      ) : (
        <div className="card" style={{ padding: '18px 14px' }}>
          <TimetableGrid courses={vm.courses} onSelect={(id) => navigate(`/app/disciplina/${id}`)} />
        </div>
      )}
    </div>
  );
}
