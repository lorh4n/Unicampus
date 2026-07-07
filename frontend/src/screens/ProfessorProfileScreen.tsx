// Perfil público do professor: nome, nota (breakdown), o que leciona neste
// semestre e histórico de semestres anteriores (BUSINESS_RULES.md §1).
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { courseGradient } from '../theme/tokens';
import { initials } from '../utils/format';
import type { ProfessorTeaching } from '../models';
import { useProfessorProfileViewModel } from '../viewmodels/useProfessorProfileViewModel';

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

function TeachingRow({ t }: { t: ProfessorTeaching }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
      <div
        style={{
          width: 40, height: 40, borderRadius: 12, background: courseGradient('azul'),
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        }}
      >
        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#fff' }}>{t.courseCode}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#16153a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.courseName}
        </div>
        <div style={{ fontSize: 11.5, color: '#8e8e98', fontWeight: 500 }}>{t.className}</div>
      </div>
    </div>
  );
}

export function ProfessorProfileScreen() {
  const { id } = useParams();
  const vm = useProfessorProfileViewModel(id);

  if (vm.isLoading) {
    return (
      <div className="container-narrow">
        <PageHeader back title="Professor" />
        <ListSkeleton rows={3} height={90} />
      </div>
    );
  }
  if (vm.isError || !vm.profile) {
    return (
      <div className="container-narrow">
        <PageHeader back title="Professor" />
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  const { professor: p, current, pastBySemester } = vm.profile;

  return (
    <div className="container-narrow">
      <PageHeader back title="Perfil do professor" />

      {/* hero */}
      <div className="card float-in" style={{ borderRadius: 24, padding: 20, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 15 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(150deg,#2D6FE0,#5B9BFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            boxShadow: '0 8px 20px rgba(45,111,224,0.3)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{initials(p.name)}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#16153a', letterSpacing: '-0.01em' }}>{p.name}</div>
          <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, marginTop: 1 }}>{p.department}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF1E6', borderRadius: 20, padding: '4px 10px', marginTop: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#F2762E' }}>⭐ {p.scores.overall.toFixed(1)}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#C58A4A' }}>
              {p.scores.ratingsCount} avaliaç{p.scores.ratingsCount === 1 ? 'ão' : 'ões'}
            </span>
          </div>
        </div>
      </div>

      {/* score breakdown */}
      <div className="card float-in" style={{ padding: 18, marginBottom: 16, animationDelay: '.05s' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#16153a', marginBottom: 12 }}>Avaliação por critério</div>
        {CRITERIA.map((c) => {
          const value = p.scores[c.key];
          return (
            <div key={c.key} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#16153a' }}>{c.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: scoreColor(value) }}>{value.toFixed(1)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 6, background: '#f0f0f3', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(value / 5) * 100}%`, borderRadius: 6, background: scoreColor(value), transition: 'width .5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* semestre atual */}
      <div className="card float-in" style={{ padding: '4px 18px 8px', marginBottom: 16, animationDelay: '.1s' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#16153a', margin: '14px 0 2px' }}>
          Leciona neste semestre (2026.1)
        </div>
        {current.length === 0 ? (
          <div style={{ fontSize: 12.5, color: '#9a9aa4', fontWeight: 500, padding: '10px 0 14px' }}>
            Sem turmas ativas neste semestre.
          </div>
        ) : (
          current.map((t, i) => <TeachingRow key={`cur-${i}`} t={t} />)
        )}
      </div>

      {/* histórico */}
      {pastBySemester.length > 0 && (
        <div className="card float-in" style={{ padding: '4px 18px 12px', animationDelay: '.15s' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#16153a', margin: '14px 0 6px' }}>
            Semestres anteriores
          </div>
          {pastBySemester.map((group) => (
            <div key={group.semester} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.03em', marginTop: 8 }}>
                {group.semester}
              </div>
              {group.items.map((t, i) => <TeachingRow key={`${group.semester}-${i}`} t={t} />)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
