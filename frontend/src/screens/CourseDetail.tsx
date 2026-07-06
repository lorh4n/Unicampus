import { useNavigate, useParams } from 'react-router-dom';
import { GradeSimulator } from '../components/grade/GradeSimulator';
import { AbsenceTracker } from '../components/grade/AbsenceTracker';
import { Skeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconBack, IconDots } from '../components/icons';
import { courseGradient, courseSolid } from '../theme/tokens';
import { fmtGrade, fmtPercent } from '../utils/format';
import { useCourseDetailViewModel } from '../viewmodels/useCourseDetailViewModel';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useCourseDetailViewModel(id);

  if (vm.isLoading) {
    return (
      <div className="container">
        <Skeleton style={{ height: 210, borderRadius: 26, marginBottom: 18 }} />
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <Skeleton style={{ flex: 1, height: 74, borderRadius: 18 }} delay={0.1} />
          <Skeleton style={{ flex: 1, height: 74, borderRadius: 18 }} delay={0.18} />
          <Skeleton style={{ flex: 1, height: 74, borderRadius: 18 }} delay={0.26} />
        </div>
        <Skeleton style={{ height: 180, borderRadius: 22 }} delay={0.32} />
      </div>
    );
  }

  if (vm.isError || !vm.course) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  const c = vm.course;
  const watermark = c.code.replace(/\D/g, '') || c.code;
  const iconBtn: React.CSSProperties = {
    width: 42, height: 42, borderRadius: '50%', border: 'none',
    background: 'rgba(255,255,255,0.22)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div className="container">
      {/* banner colorido da disciplina */}
      <div
        style={{
          background: courseGradient(c.color, 165), borderRadius: 26,
          padding: '18px 22px 22px', position: 'relative', overflow: 'hidden', marginBottom: 18,
        }}
      >
        <div
          style={{
            position: 'absolute', right: -30, top: -20, fontSize: 170, fontWeight: 800,
            color: 'rgba(255,255,255,0.12)', lineHeight: 1, pointerEvents: 'none',
          }}
        >
          {watermark}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <button className="pressable" aria-label="Voltar" style={iconBtn} onClick={() => navigate(-1)}>
            <IconBack color="#fff" />
          </button>
          <button
            className="pressable" aria-label="Editar disciplina" style={iconBtn}
            onClick={() => navigate(`/app/disciplina/${c.id}/editar`)}
          >
            <IconDots />
          </button>
        </div>
        <div style={{ marginTop: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>
            {c.code.toUpperCase()} · {c.credits} CRÉDITOS
          </div>
          <h1 style={{ margin: '3px 0 0', fontSize: 25, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {c.name}
          </h1>
          {(c.professor || c.className) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                {c.professor ? `Prof. ${c.professor}` : ''}
                {c.professor && c.className ? ' · ' : ''}
                {c.className ?? ''}
              </span>
              {c.professor && c.status === 'cursando' && (
                <button
                  className="pressable"
                  onClick={() => navigate(`/app/disciplina/${c.id}/avaliar-professor`)}
                  style={{
                    border: 'none', background: 'rgba(255,255,255,0.22)', color: '#fff',
                    fontSize: 11.5, fontWeight: 800, borderRadius: 20, padding: '5px 11px',
                  }}
                >
                  Avaliar professor
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* strip de métricas */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        {[
          { label: 'MÉDIA ATUAL', value: fmtGrade(c.average), color: '#16153a', size: 24 },
          { label: 'PRESENÇA', value: fmtPercent(c.attendance), color: '#16A085', size: 24 },
          { label: 'STATUS', value: vm.status?.label ?? '—', color: vm.status?.color ?? '#16153a', size: 15 },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              flex: 1, background: '#fff', borderRadius: 18, padding: 13, textAlign: 'center',
              boxShadow: '0 4px 14px rgba(20,20,45,0.05)',
            }}
          >
            <div style={{ fontSize: 11, color: '#9a9aa4', fontWeight: 600 }}>{m.label}</div>
            <div style={{ fontSize: m.size, fontWeight: 800, color: m.color, marginTop: m.size < 20 ? 6 : 2 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="detail-grid">
        <div>
          {/* critérios */}
          <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a', marginBottom: 12 }}>
            Critérios de avaliação
          </div>
          <div style={{ background: '#fff', borderRadius: 22, padding: '6px 16px', marginBottom: 20, boxShadow: '0 4px 14px rgba(20,20,45,0.05)' }}>
            {c.criteria.map((cr, i) => (
              <div
                key={cr.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0',
                  borderBottom: i < c.criteria.length - 1 ? '1px solid #f0f0f3' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 11, background: '#FFF1E6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: courseSolid(c.color),
                    }}
                  >
                    {cr.weight}%
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#16153a' }}>{cr.label}</div>
                    <div style={{ fontSize: 11, color: '#9a9aa4' }}>
                      {cr.done ? (cr.grade !== null ? 'Realizada' : 'Parcial') : 'A realizar'}
                      {cr.date ? ` · ${cr.date}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: cr.grade !== null ? 18 : 13, fontWeight: cr.grade !== null ? 800 : 700, color: cr.grade !== null ? '#16153a' : '#c4c4cc' }}>
                  {fmtGrade(cr.grade)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a', marginBottom: 12 }}>
            Controle de faltas
          </div>
          <AbsenceTracker course={c} />
        </div>

        <div className="detail-side">
          <GradeSimulator simulator={vm.simulator} />
        </div>
      </div>
    </div>
  );
}
