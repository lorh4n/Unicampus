// Tela não desenhada no protótipo — criada seguindo a mesma linguagem visual.
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { IconBack, IconCheck } from '../components/icons';
import { usePasswordResetViewModel } from '../viewmodels/useProfileViewModel';

export function ForgotPassword() {
  const navigate = useNavigate();
  const vm = usePasswordResetViewModel();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          className="icon-circle-white pressable"
          aria-label="Voltar"
          onClick={() => navigate(-1)}
          style={{ alignSelf: 'flex-start' }}
        >
          <IconBack />
        </button>

        {vm.sent ? (
          <div className="float-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: 74, height: 74, borderRadius: '50%',
                background: 'linear-gradient(150deg,#16A085,#1ABC9C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 16px 34px rgba(22,160,133,0.35)', marginBottom: 22,
              }}
            >
              <IconCheck size={34} />
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#16153a', letterSpacing: '-0.02em' }}>
              Verifique seu e-mail
            </h1>
            <p style={{ fontSize: 14.5, color: '#8e8e98', fontWeight: 500, lineHeight: 1.5, margin: '10px 0 0', maxWidth: 300 }}>
              Enviamos as instruções de redefinição de senha para o e-mail institucional do RA{' '}
              <b style={{ color: '#16153a' }}>{vm.ra}</b>.
            </p>
            <button
              className="btn-primary pressable fit"
              style={{ marginTop: 28 }}
              onClick={() => navigate('/entrar')}
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 32 }}>
              <h1 style={{ margin: 0, fontSize: 29, fontWeight: 800, color: '#16153a', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
                Esqueceu
                <br />
                sua senha?
              </h1>
              <p style={{ fontSize: 15, color: '#8e8e98', fontWeight: 500, lineHeight: 1.45, margin: '12px 0 0' }}>
                Informe seu RA e enviaremos um link de redefinição para o seu e-mail institucional (DAC).
              </p>
            </div>

            <form
              style={{ marginTop: 30 }}
              onSubmit={(e) => {
                e.preventDefault();
                void vm.submit();
              }}
            >
              <label className="field-label" htmlFor="reset-ra" style={{ display: 'block' }}>RA</label>
              <input
                id="reset-ra"
                className="input"
                value={vm.ra}
                inputMode="numeric"
                placeholder="247195"
                style={{ fontWeight: 700, padding: 14 }}
                onChange={(e) => vm.setRa(e.target.value.replace(/\D/g, ''))}
              />
            </form>

            <div style={{ flex: 1, minHeight: 28 }} />
            <PrimaryButton onClick={() => void vm.submit()} loading={vm.sending} disabled={!vm.canSubmit}>
              Enviar link de redefinição
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
