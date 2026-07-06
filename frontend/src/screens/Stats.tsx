import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { PASSING_GRADE } from '../domain/rules';
import { courseGradient, courseSolid } from '../theme/tokens';
import { fmtGrade } from '../utils/format';
import { useStatsViewModel } from '../viewmodels/useStatsViewModel';

const MAX_BAR_HEIGHT = 120;

export function Stats() {
  const navigate = useNavigate();
  const vm = useStatsViewModel();

  return (
    <div className="container">
      <PageHeader title="Estatísticas" subtitle="Desempenho · 2026.1" />

      {vm.isLoading ? (
        <ListSkeleton rows={3} height={150} />
      ) : vm.isError ? (
        <div className="container-narrow">
          <ErrorState onRetry={vm.retry} />
        </div>
      ) : (
        <div className="grid-2">
          {/* evolução do CR */}
          <div
            style={{
              background: '#16153a', borderRadius: 24, padding: '18px 20px 16px',
              boxShadow: '0 12px 28px rgba(20,20,45,0.22)', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: '#a6a6c8', fontWeight: 600, letterSpacing: '0.02em' }}>
                  EVOLUÇÃO DO CR
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                    {vm.currentCr !== undefined ? fmtGrade(vm.currentCr) : '—'}
                  </span>
                  {vm.crDelta !== null && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: vm.crDelta >= 0 ? '#7CE0A0' : '#FF8A8A' }}>
                      {vm.crDelta >= 0 ? '▲' : '▼'} {fmtGrade(Math.abs(vm.crDelta))}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '6px 11px', fontSize: 11, fontWeight: 700, color: '#b9b9d4' }}>
                {vm.history.length} semestres
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, height: 148, marginTop: 18 }}>
              {vm.history.map((h, i) => {
                const isCurrent = i === vm.history.length - 1;
                return (
                  <div key={`${h.semester}-${i}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: isCurrent ? 800 : 700, color: isCurrent ? '#FFC524' : 'rgba(255,255,255,0.7)' }}>
                      {fmtGrade(h.cr)}
                    </span>
                    <div
                      style={{
                        width: '100%', maxWidth: 30,
                        height: (h.cr / vm.maxCr) * MAX_BAR_HEIGHT,
                        borderRadius: '8px 8px 4px 4px',
                        background: isCurrent
                          ? 'linear-gradient(180deg,#FFC524,#FF8A3D)'
                          : 'rgba(255,255,255,0.16)',
                        boxShadow: isCurrent ? '0 6px 14px rgba(255,138,61,0.4)' : 'none',
                      }}
                    />
                    <span style={{ fontSize: 9.5, fontWeight: isCurrent ? 700 : 600, color: isCurrent ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {h.semester}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {/* mini stats */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div className="card" style={{ flex: 1, padding: '15px 17px' }}>
                <div style={{ fontSize: 12, color: '#9a9aa4', fontWeight: 600 }}>Presença média</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#16A085', letterSpacing: '-0.02em', marginTop: 3 }}>
                  {vm.avgAttendance}%
                </div>
              </div>
              <div className="card" style={{ flex: 1, padding: '15px 17px' }}>
                <div style={{ fontSize: 12, color: '#9a9aa4', fontWeight: 600 }}>Aprovadas</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#16153a', letterSpacing: '-0.02em', marginTop: 3 }}>
                  {vm.approvedCount}{' '}
                  <span style={{ fontSize: 13, color: '#9a9aa4', fontWeight: 700 }}>disc.</span>
                </div>
              </div>
            </div>

            {/* notas por disciplina */}
            <div className="card" style={{ padding: '18px 16px 8px' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#16153a', marginBottom: 14 }}>
                Notas do semestre
              </div>
              {vm.courses.map((c) => (
                <div
                  key={c.id}
                  className="pressable-row"
                  role="button"
                  onClick={() => navigate(`/app/disciplina/${c.id}`)}
                  style={{ marginBottom: 14 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#16153a' }}>{c.code}</span>
                    <span
                      style={{
                        fontSize: 13, fontWeight: 800,
                        color: c.average !== null && c.average < PASSING_GRADE ? '#FF5A4D' : courseSolid(c.color),
                      }}
                    >
                      {fmtGrade(c.average)}
                    </span>
                  </div>
                  <div style={{ height: 9, borderRadius: 6, background: '#f0f0f3', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%', width: `${((c.average ?? 0) / 10) * 100}%`,
                        borderRadius: 6, background: courseGradient(c.color, 90),
                        transition: 'width .5s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
