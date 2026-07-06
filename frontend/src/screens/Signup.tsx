import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ListSkeleton } from '../components/common/Skeleton';
import { IconBack, IconCheck } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { useSignupViewModel } from '../viewmodels/useSignupViewModel';

export function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useSignupViewModel();

  const submit = async () => {
    if (await vm.submit()) {
      showToast('Cadastro concluído');
      setTimeout(() => navigate('/app/inicio'), 700);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* header + progresso 2/2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <button className="icon-circle-white pressable" aria-label="Voltar" onClick={() => navigate(-1)}>
            <IconBack />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ height: 7, borderRadius: 4, background: '#e2e2e8', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#FFC524,#FF8A3D)', borderRadius: 4 }} />
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9a9aa4', flex: 'none' }}>2 / 2</span>
        </div>

        <div style={{ fontSize: 15, color: '#8e8e98', fontWeight: 500 }}>Quase lá! 🎓</div>
        <h1 style={{ margin: '2px 0 0', fontSize: 27, fontWeight: 800, color: '#16153a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Crie seu perfil
        </h1>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label" htmlFor="su-nome" style={{ display: 'block' }}>Nome completo</label>
              <input
                id="su-nome" className="input" value={vm.name} placeholder="Seu nome"
                onChange={(e) => vm.setName(e.target.value)}
              />
            </div>
            <div style={{ width: 110, flex: 'none' }}>
              <label className="field-label" htmlFor="su-ra" style={{ display: 'block' }}>RA</label>
              <input
                id="su-ra" className="input" value={vm.ra} inputMode="numeric" placeholder="247195"
                style={{ fontWeight: 700 }}
                onChange={(e) => vm.setRa(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div className="field-label">Curso</div>
            <div className="input" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {vm.course}
              <svg width="12" height="8" viewBox="0 0 12 8">
                <path d="M1 1 6 6 11 1" fill="none" stroke="#9a9aa4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a' }}>Disciplinas de 2026.1</div>
            <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, marginTop: 1 }}>
              Toque nas matérias que você cursa
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, background: '#16153a',
              borderRadius: 20, padding: '6px 13px', margin: '10px 0 14px',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFC524' }}>{vm.selectedCount}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
              selecionadas · {vm.selectedCredits} créditos
            </span>
          </div>

          {vm.offeringsLoading ? (
            <ListSkeleton rows={6} height={64} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {vm.offerings.map((o) => {
                const on = vm.isSelected(o.code);
                return (
                  <div
                    key={o.code}
                    className="pressable-row float-in"
                    role="button"
                    aria-pressed={on}
                    onClick={() => vm.toggle(o.code)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11, padding: 13, borderRadius: 16,
                      ...(on
                        ? {
                            background: 'linear-gradient(150deg,#F2762E,#FF9D4D)', color: '#fff',
                            border: '1.5px solid transparent', boxShadow: '0 8px 18px rgba(242,118,46,0.28)',
                          }
                        : { background: '#fff', color: '#16153a', border: '1.5px solid #e4e4ea' }),
                    }}
                  >
                    {on ? (
                      <div
                        style={{
                          width: 24, height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                        }}
                      >
                        <IconCheck size={14} />
                      </div>
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: 8, border: '1.8px solid #d6d6de', flex: 'none' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{o.code}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.72, lineHeight: 1.2 }}>{o.name}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, flex: 'none' }}>{o.credits} cr</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {vm.error && (
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FF5A4D', marginTop: 14 }}>{vm.error}</div>
        )}

        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={submit} disabled={!vm.canSubmit} loading={vm.saving} success={vm.success}>
            Concluir cadastro
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
