// Tela não desenhada no protótipo — criada seguindo a mesma linguagem visual.
import { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ListSkeleton } from '../components/common/Skeleton';
import { useToast } from '../context/ToastContext';
import { usePersonalDataViewModel } from '../viewmodels/useProfileViewModel';

export function PersonalData() {
  const vm = usePersonalDataViewModel();
  const { showToast } = useToast();
  const [success, setSuccess] = useState(false);

  const save = async () => {
    await vm.save();
    setSuccess(true);
    showToast('Dados atualizados');
    setTimeout(() => setSuccess(false), 1400);
  };

  return (
    <div className="container-narrow">
      <PageHeader back title="Dados pessoais" subtitle="Nome e contato da sua conta" />

      {vm.isLoading ? (
        <ListSkeleton rows={3} height={72} />
      ) : (
        <>
          <div className="card" style={{ borderRadius: 22, padding: 18, marginBottom: 18 }}>
            <div style={{ marginBottom: 14 }}>
              <label className="field-label" htmlFor="pd-nome" style={{ display: 'block' }}>Nome completo</label>
              <input id="pd-nome" className="input" value={vm.name} onChange={(e) => vm.setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="field-label" htmlFor="pd-email" style={{ display: 'block' }}>E-mail</label>
              <input
                id="pd-email" className="input" type="email" value={vm.email}
                placeholder="voce@dac.unicamp.br"
                onChange={(e) => vm.setEmail(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="field-label">RA</div>
                <div className="input" style={{ background: '#f4f4f7', color: '#74747e', fontWeight: 700 }}>
                  {vm.ra}
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <div className="field-label">Curso</div>
                <div className="input" style={{ background: '#f4f4f7', color: '#74747e' }}>{vm.course}</div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: '#a8a8b2', fontWeight: 500, marginTop: 10 }}>
              RA e curso são registros da DAC e não podem ser alterados pelo app.
            </div>
          </div>

          <PrimaryButton onClick={save} loading={vm.saving} success={success} disabled={!vm.dirty || !vm.canSave}>
            Salvar alterações
          </PrimaryButton>
        </>
      )}
    </div>
  );
}
