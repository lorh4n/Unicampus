// Tela não desenhada no protótipo — criada seguindo a mesma linguagem visual.
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { ListSkeleton } from '../components/common/Skeleton';
import { IconChevronRight } from '../components/icons';
import { useCurriculumQuery, useMeQuery } from '../viewmodels/queries';

export function AcademicInfo() {
  const navigate = useNavigate();
  const me = useMeQuery();
  const curriculum = useCurriculumQuery();
  const s = me.data;

  const rows: Array<[string, string]> = s
    ? [
        ['Curso', `${s.course} · ${s.courseCode}`],
        ['RA', s.ra],
        ['Semestre atual', s.semester],
        ['CR — coef. de rendimento', s.cr.toFixed(1)],
        ['CP — coef. de progressão', s.cp.toFixed(2)],
        ['Créditos (janela do CP)', `${s.creditsCompleted} / ${s.creditsTotal}`],
      ]
    : [];

  return (
    <div className="container-narrow">
      <PageHeader back title="Curso e matrícula" subtitle="Situação acadêmica na DAC" />

      {me.isLoading ? (
        <ListSkeleton rows={4} height={58} />
      ) : (
        <>
          <div className="card" style={{ borderRadius: 22, padding: '4px 18px', marginBottom: 18 }}>
            {rows.map(([label, value], i) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '14px 0',
                  borderBottom: i < rows.length - 1 ? '1px solid #f0f0f3' : 'none',
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#74747e' }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#16153a', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>

          {curriculum.data && (
            <div
              className="pressable-row"
              role="button"
              onClick={() => navigate('/app/integralizacao')}
              style={{
                background: '#16153a', borderRadius: 22, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 12px 28px rgba(20,20,45,0.22)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: '#a6a6c8', fontWeight: 600, letterSpacing: '0.02em' }}>
                  INTEGRALIZAÇÃO
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2 }}>
                  {curriculum.data.progressPercent}% do curso concluído
                </div>
                <div style={{ fontSize: 12, color: '#b9b9d4', marginTop: 2 }}>
                  {curriculum.data.creditsCompleted} / {curriculum.data.creditsTotal} créditos · previsão{' '}
                  {curriculum.data.forecastSemester}
                </div>
              </div>
              <IconChevronRight color="#7e7e9c" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
