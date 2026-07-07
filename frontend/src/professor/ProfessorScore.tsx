// Score do professor — leitura apenas; quem avalia são os alunos (BUSINESS_RULES.md §4.4).
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { CountUp } from '../components/common/CountUp';
import { useMyScoreViewModel } from '../viewmodels/professor';

const CRITERIA: Array<{ key: 'didactics' | 'organization' | 'accessibility' | 'material'; label: string }> = [
  { key: 'didactics', label: 'Didática' },
  { key: 'organization', label: 'Organização' },
  { key: 'accessibility', label: 'Acessibilidade' },
  { key: 'material', label: 'Material didático' },
];

function scoreColor(v: number): string {
  if (v >= 4) return '#16A085';
  if (v >= 3) return '#F2762E';
  return '#FF5A4D';
}

export function ProfessorScore() {
  const vm = useMyScoreViewModel();

  if (vm.isLoading) return <ListSkeleton rows={2} height={110} />;
  if (vm.isError || !vm.professor) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  const p = vm.professor;

  return (
    <div className="container-narrow" style={{ margin: 0, maxWidth: 560 }}>
      <div
        style={{
          background: '#16153a', borderRadius: 24, padding: '22px 24px', marginBottom: 18,
          boxShadow: '0 12px 28px rgba(20,20,45,0.22)', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: '#a6a6c8', fontWeight: 600, letterSpacing: '0.02em' }}>
          MÉDIA GERAL
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color: '#FFC524', letterSpacing: '-0.02em', marginTop: 4 }}>
          <CountUp value={p.scores.overall} decimals={1} comma />
        </div>
        <div style={{ fontSize: 12.5, color: '#b9b9d4', fontWeight: 500, marginTop: 4 }}>
          {p.scores.ratingsCount} avaliaç{p.scores.ratingsCount === 1 ? 'ão' : 'ões'} recebida{p.scores.ratingsCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Por critério</div>
        {CRITERIA.map((c) => {
          const value = p.scores[c.key];
          return (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#16153a' }}>{c.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(value) }}>{value.toFixed(1)}</span>
              </div>
              <div style={{ height: 9, borderRadius: 6, background: '#f0f0f3', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%', width: `${(value / 5) * 100}%`, borderRadius: 6,
                    background: scoreColor(value), transition: 'width .5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 11.5, color: '#a8a8b2', fontWeight: 500, marginTop: 6, lineHeight: 1.4 }}>
          A nota é a média das avaliações enviadas pelos alunos matriculados nas suas
          turmas — você não pode editá-la.
        </div>
      </div>
    </div>
  );
}
