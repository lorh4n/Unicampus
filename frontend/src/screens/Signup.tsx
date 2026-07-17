import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ListSkeleton } from '../components/common/Skeleton';
import { IconBack, IconEye } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { useSignupViewModel } from '../viewmodels/useSignupViewModel';

/** Botão de estado (Cursando / Já concluí) usado em cada disciplina. */
function StateButton({
  label,
  active,
  activeStyle,
  onClick,
}: {
  label: string;
  active: boolean;
  activeStyle: CSSProperties;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="pressable"
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: 'none', borderRadius: 10, padding: '8px 13px', fontSize: 12.5, fontWeight: 800,
        cursor: 'pointer',
        ...(active ? activeStyle : { background: '#f1f1f4', color: '#56565e' }),
      }}
    >
      {label}
    </button>
  );
}

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
          <div style={{ marginBottom: 12 }}>
            <label className="field-label" htmlFor="su-senha" style={{ display: 'block' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                id="su-senha"
                className="input"
                type={vm.showPassword ? 'text' : 'password'}
                value={vm.password}
                placeholder="Mínimo 6 caracteres"
                style={{ paddingRight: 46, fontWeight: 700 }}
                onChange={(e) => vm.setPassword(e.target.value)}
              />
              <button
                type="button"
                className="pressable"
                aria-label={vm.showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={vm.toggleShowPassword}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  border: 'none', background: 'transparent', padding: 0, display: 'flex',
                }}
              >
                <IconEye color={vm.showPassword ? '#16153a' : '#9a9aa4'} />
              </button>
            </div>
            {vm.passwordTooShort && (
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#FF5A4D', marginTop: 4 }}>
                A senha precisa de pelo menos 6 caracteres.
              </div>
            )}
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
            <div style={{ fontSize: 16, fontWeight: 800, color: '#16153a' }}>Suas disciplinas</div>
            <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, marginTop: 1 }}>
              Marque o que você <b>cursa</b> em 2026.1 e o que já <b>concluiu</b> (com a nota).
              Calouro? Marque só as que vai cursar.
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0 14px' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, background: '#16153a',
                borderRadius: 20, padding: '6px 13px',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: '#FFC524' }}>{vm.selectedCount}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                cursando · {vm.selectedCredits} cr
              </span>
            </div>
            {vm.completedCount > 0 && (
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, background: '#E6F7F2',
                  borderRadius: 20, padding: '6px 13px',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F8A6E' }}>
                  {vm.completedCount} concluídas
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#0F8A6E' }}>
                  CP {vm.previewCp.toFixed(2)}{vm.previewCr > 0 ? ` · CR ${vm.previewCr.toFixed(1)}` : ''}
                </span>
              </div>
            )}
          </div>

          {vm.offeringsLoading ? (
            <ListSkeleton rows={6} height={64} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {vm.offerings.map((o) => {
                const state = vm.stateOf(o.code);
                const enrolled = state === 'enrolled';
                const done = state === 'completed';
                return (
                  <div
                    key={o.code}
                    className="float-in"
                    style={{
                      padding: 13, borderRadius: 16,
                      ...(enrolled
                        ? {
                            background: 'linear-gradient(150deg,#F2762E,#FF9D4D)', color: '#fff',
                            border: '1.5px solid transparent', boxShadow: '0 8px 18px rgba(242,118,46,0.28)',
                          }
                        : done
                          ? { background: '#EAF9F4', color: '#16153a', border: '1.5px solid #9BE0CB' }
                          : { background: '#fff', color: '#16153a', border: '1.5px solid #e4e4ea' }),
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{o.code}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.72, lineHeight: 1.2 }}>{o.name}</div>
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.75, flex: 'none' }}>{o.credits} cr</span>
                    </div>

                    <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
                      <StateButton
                        label="Cursando"
                        active={enrolled}
                        activeStyle={{ background: 'rgba(255,255,255,0.24)', color: '#fff' }}
                        onClick={() => (enrolled ? vm.clearState(o.code) : vm.setEnrolledState(o.code))}
                      />
                      <StateButton
                        label="Já concluí"
                        active={done}
                        activeStyle={{ background: '#12B886', color: '#fff' }}
                        onClick={() => (done ? vm.clearState(o.code) : vm.setCompletedState(o.code))}
                      />
                      {done && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F8A6E' }}>Nota</span>
                          <input
                            className="input"
                            inputMode="decimal"
                            value={vm.gradeOf(o.code)}
                            placeholder="0–10"
                            aria-label={`Nota de ${o.code}`}
                            onChange={(e) => {
                              const v = e.target.value.replace(',', '.').replace(/[^\d.]/g, '');
                              vm.setGrade(o.code, v);
                            }}
                            style={{ width: 66, height: 38, padding: '0 10px', fontWeight: 800, textAlign: 'center' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {vm.gradeMissing && !vm.error && (
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#F2762E', marginTop: 14 }}>
            Preencha a nota (0–10) de cada matéria marcada como concluída.
          </div>
        )}
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
