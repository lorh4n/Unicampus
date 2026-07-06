import type { CSSProperties } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RingProgress } from '../components/common/RingProgress';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconCheck, IconLock, IconStatusCursando, IconStatusDisponivel } from '../components/icons';
import type { CourseStatus } from '../models';
import type { ChipFocus } from '../domain/rules';
import { useCurriculumViewModel } from '../viewmodels/useCurriculumViewModel';

const STATUS_STYLE: Record<CourseStatus, CSSProperties> = {
  aprovada: {
    background: 'linear-gradient(150deg,#16A085,#1ABC9C)', color: '#fff',
    border: '1.5px solid transparent', boxShadow: '0 4px 12px rgba(22,160,133,0.22)',
  },
  cursando: {
    background: '#fff', color: '#16153a',
    border: '2px solid #F2762E', boxShadow: '0 4px 12px rgba(242,118,46,0.14)',
  },
  disponivel: { background: '#fff', color: '#16153a', border: '1.5px solid #d8d8e0' },
  bloqueada: { background: '#edecf0', color: '#aaa9b4', border: '1.5px solid #e4e3ea' },
};

const FOCUS_STYLE: Record<ChipFocus, CSSProperties> = {
  none: {},
  selected: { boxShadow: '0 0 0 3px #16153a, 0 8px 20px rgba(20,20,45,0.18)', transform: 'scale(1.05)' },
  prereq: { boxShadow: '0 0 0 3px #2D6FE0' },
  unlocks: { boxShadow: '0 0 0 3px #7C4DFF' },
  dimmed: { opacity: 0.26, filter: 'saturate(0.55)' },
};

const STATUS_ICON: Record<CourseStatus, JSX.Element> = {
  aprovada: <IconCheck />,
  cursando: <IconStatusCursando />,
  disponivel: <IconStatusDisponivel />,
  bloqueada: <IconLock />,
};

const LEGEND: Array<{ label: string; swatch: JSX.Element; muted?: boolean }> = [
  {
    label: 'Aprovada',
    swatch: (
      <div style={{ width: 20, height: 20, borderRadius: 7, background: 'linear-gradient(150deg,#16A085,#1ABC9C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={12} />
      </div>
    ),
  },
  { label: 'Cursando', swatch: <div style={{ width: 20, height: 20, borderRadius: 7, background: '#fff', border: '2px solid #F2762E' }} /> },
  { label: 'Disponível', swatch: <div style={{ width: 20, height: 20, borderRadius: 7, background: '#fff', border: '1.5px solid #d8d8e0' }} /> },
  {
    label: 'Bloqueada', muted: true,
    swatch: (
      <div style={{ width: 20, height: 20, borderRadius: 7, background: '#edecf0', border: '1.5px solid #e4e3ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconLock size={11} />
      </div>
    ),
  },
];

export function CurriculumTree() {
  const vm = useCurriculumViewModel();
  const data = vm.curriculum;

  return (
    <div className="container">
      <PageHeader
        title="Integralização"
        subtitle={data ? `${data.courseName} · ${data.courseCode}` : undefined}
      />

      {vm.isLoading ? (
        <ListSkeleton rows={5} height={110} />
      ) : vm.isError || !data ? (
        <div className="container-narrow">
          <ErrorState onRetry={vm.retry} />
        </div>
      ) : (
        <>
          <div className="grid-2" style={{ marginBottom: 18, alignItems: 'stretch' }}>
            {/* card de progresso */}
            <div
              style={{
                background: '#16153a', borderRadius: 24, padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 12px 28px rgba(20,20,45,0.22)', position: 'relative', overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(242,118,46,0.3), transparent 70%)',
                }}
              />
              <RingProgress percent={data.progressPercent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#a6a6c8', fontWeight: 600, letterSpacing: '0.02em' }}>
                  PROGRESSO DO CURSO
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginTop: 2 }}>
                  {data.creditsCompleted}{' '}
                  <span style={{ fontSize: 15, color: '#8a8aac' }}>/ {data.creditsTotal} créditos</span>
                </div>
                <div style={{ fontSize: 12, color: '#b9b9d4', marginTop: 3 }}>
                  {data.creditsTotal - data.creditsCompleted} créditos restantes · previsão {data.forecastSemester}
                </div>
              </div>
            </div>

            {/* legenda */}
            <div
              className="card"
              style={{
                borderRadius: 18, padding: '13px 15px',
                display: 'flex', flexWrap: 'wrap', gap: '11px 16px', alignItems: 'center', alignContent: 'center',
              }}
            >
              {LEGEND.map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {l.swatch}
                  <span style={{ fontSize: 12, fontWeight: 600, color: l.muted ? '#9a9aa4' : '#16153a' }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* banner de foco */}
          {vm.banner && (
            <div
              className="float-in"
              style={{
                background: '#fff', borderRadius: 22, padding: 16, marginBottom: 18,
                boxShadow: '0 8px 22px rgba(20,20,45,0.08)', border: '1.5px solid #ececf0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#16153a', letterSpacing: '-0.01em' }}>
                    {vm.banner.code}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, lineHeight: 1.3, marginTop: 1 }}>
                    {vm.banner.name}
                  </div>
                </div>
                <div
                  className="pressable-row"
                  role="button"
                  onClick={vm.clear}
                  style={{
                    flex: 'none', fontSize: 12, fontWeight: 700, color: '#F2762E',
                    background: '#FFF1E6', borderRadius: 20, padding: '6px 12px',
                  }}
                >
                  Ver tudo
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: '#2D6FE0', flex: 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#2D6FE0', letterSpacing: '0.02em', flex: 'none' }}>
                    PRÉ-REQUISITOS
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#16153a' }}>{vm.banner.preText}</span>
                  {vm.banner.preDone && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#16A085', background: '#E6F7F2', borderRadius: 8, padding: '2px 7px' }}>
                      ✓ cumpridos
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: '#7C4DFF', flex: 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#7C4DFF', letterSpacing: '0.02em', flex: 'none' }}>
                    LIBERA {vm.banner.unlockCount}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#16153a' }}>{vm.banner.unlockText}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: '#a8a8b2', fontWeight: 500, borderTop: '1px solid #f0f0f3', paddingTop: 10 }}>
                Mostrando apenas as conexões desta disciplina — toque em outra para focar.
              </div>
            </div>
          )}

          {/* semestres */}
          {vm.semesters.map((sem) => (
            <div key={sem.label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#16153a', letterSpacing: '-0.01em' }}>
                  {sem.label}
                </span>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#9a9aa4' }}>{sem.credits} créditos</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {sem.items.map((item) => {
                  const f = vm.focusOf(item.code);
                  return (
                    <div
                      key={item.code}
                      role="button"
                      aria-label={`${item.code} — ${item.name}`}
                      title={item.name}
                      onClick={() => vm.toggle(item.code)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px',
                        borderRadius: 15, cursor: 'pointer', transition: 'all .18s', flex: '0 0 auto',
                        ...STATUS_STYLE[item.status],
                        ...FOCUS_STYLE[f],
                      }}
                    >
                      {STATUS_ICON[item.status]}
                      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.12 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{item.code}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.66 }}>{item.credits} cr</span>
                      </div>
                      {item.status === 'cursando' && (
                        <span
                          style={{
                            fontSize: 8.5, fontWeight: 800, color: '#F2762E', background: '#FFF1E6',
                            borderRadius: 7, padding: '2px 6px', letterSpacing: '0.02em', flex: 'none',
                          }}
                        >
                          CURSANDO
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
