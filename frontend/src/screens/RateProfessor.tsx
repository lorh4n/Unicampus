// Avaliação de professor pelo aluno — só disponível para disciplina cursando
// (BUSINESS_RULES.md §4.4).
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ListSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import { useRateProfessorViewModel } from '../viewmodels/useRateProfessorViewModel';

const CRITERIA = [
  { key: 'didactics', label: 'Didática' },
  { key: 'organization', label: 'Organização' },
  { key: 'accessibility', label: 'Acessibilidade' },
  { key: 'material', label: 'Material didático' },
] as const;

export function RateProfessor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useRateProfessorViewModel(id);

  const setters = {
    didactics: vm.setDidactics,
    organization: vm.setOrganization,
    accessibility: vm.setAccessibility,
    material: vm.setMaterial,
  };
  const values = {
    didactics: vm.didactics,
    organization: vm.organization,
    accessibility: vm.accessibility,
    material: vm.material,
  };

  const submit = async () => {
    await vm.submit();
    showToast('Avaliação enviada — obrigado!');
    setTimeout(() => navigate(-1), 900);
  };

  if (vm.isLoading) {
    return (
      <div className="container-narrow">
        <PageHeader back title="Avaliar professor" />
        <ListSkeleton rows={2} height={90} />
      </div>
    );
  }

  return (
    <div className="container-narrow">
      <PageHeader
        back
        title="Avaliar professor"
        subtitle={vm.professor ? vm.professor.name : vm.course?.professor}
      />

      {!vm.canRate ? (
        <div className="card" style={{ borderRadius: 20, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#16153a', marginBottom: 6 }}>
            Avaliação indisponível
          </div>
          <div style={{ fontSize: 13, color: '#8e8e98', fontWeight: 500, lineHeight: 1.5 }}>
            Só é possível avaliar o professor de uma disciplina que você está{' '}
            <b>cursando</b> no momento.
          </div>
        </div>
      ) : vm.submitted ? (
        <div className="card" style={{ borderRadius: 20, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#16153a' }}>Avaliação enviada</div>
          <div style={{ fontSize: 13, color: '#8e8e98', fontWeight: 500, marginTop: 4 }}>
            Obrigado por ajudar a melhorar o ensino.
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ borderRadius: 20, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#8e8e98', fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }}>
              Sua avaliação é anônima e entra na média de todos os alunos que avaliaram
              este professor. Notas de 0 a 5.
            </div>
          </div>

          {CRITERIA.map((c) => (
            <div key={c.key} className="card" style={{ borderRadius: 20, padding: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#16153a' }}>{c.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#F2762E' }}>{values[c.key].toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={values[c.key]}
                aria-label={c.label}
                onChange={(e) => setters[c.key](parseFloat(e.target.value))}
              />
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <PrimaryButton onClick={submit} loading={vm.submitting}>
              Enviar avaliação
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
