import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { IconEye } from '../components/icons';
import { useLoginViewModel } from '../viewmodels/useLoginViewModel';

export function Login() {
  const navigate = useNavigate();
  const vm = useLoginViewModel();

  const ROLE_HOME = { aluno: '/app/inicio', professor: '/professor', admin: '/admin' } as const;

  const submit = async () => {
    const role = await vm.submit();
    if (role) navigate(ROLE_HOME[role]);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/unicamp.svg" alt="Unicamp" style={{ height: 40, width: 'auto', alignSelf: 'flex-start' }} />
        <div style={{ marginTop: 40 }}>
          <h1 style={{ margin: 0, fontSize: 31, fontWeight: 800, color: '#16153a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Bem-vindo
            <br />
            de volta 👋
          </h1>
          <p style={{ fontSize: 15, color: '#8e8e98', fontWeight: 500, lineHeight: 1.45, margin: '12px 0 0' }}>
            Entre com seu RA e senha para acessar sua vida acadêmica.
          </p>
        </div>

        {/* Seleção de papel: sempre visível. Serve para (a) UX — o usuário
            diz o que espera acessar — e (b) uma checagem extra de segurança:
            se o papel devolvido pelo backend não bater com a aba escolhida,
            o ViewModel encerra a sessão e bloqueia o acesso. O papel real
            NUNCA é decidido aqui — só o backend autentica e define o papel. */}
        <div style={{ marginTop: 26 }}>
          <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>Entrar como</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['aluno', 'professor', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className="pressable"
                onClick={() => vm.setRole(r)}
                style={{
                  flex: 1, borderRadius: 12, padding: '10px 6px',
                  fontSize: 13, fontWeight: 800,
                  border: vm.role === r ? '2px solid #16153a' : '1px solid #e4e4ea',
                  background: vm.role === r ? '#16153a' : '#fff',
                  color: vm.role === r ? '#fff' : '#8e8e98',
                }}
              >
                {vm.roleLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <form
          style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div>
            <label className="field-label" htmlFor="login-ra" style={{ display: 'block' }}>RA</label>
            <input
              id="login-ra"
              className="input" value={vm.ra} inputMode="numeric" placeholder="247195"
              style={{ fontWeight: 700, padding: 14 }}
              onChange={(e) => vm.setRa(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="login-senha" style={{ display: 'block' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-senha"
                className="input"
                type={vm.showPassword ? 'text' : 'password'}
                value={vm.password}
                placeholder="••••••••"
                style={{ padding: 14, paddingRight: 46, fontWeight: 700 }}
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
          </div>
          {vm.error && <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FF5A4D' }}>{vm.error}</div>}
          <button type="submit" hidden />
        </form>

        {/* Só no MODO DEV: um selo indicando que a aba acima também está
            simulando o papel que o backend devolveria no mock de login. */}
        {vm.isDevMode && (
          <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 10, background: '#16153a' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#FFC524', letterSpacing: '0.04em' }}>MODO DEV</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#b9b9d4', marginLeft: 6 }}>
              · login simulado como {vm.roleLabels[vm.role]}
            </span>
          </div>
        )}

        <div
          className="pressable-row"
          role="button"
          style={{ alignSelf: 'flex-end', marginTop: 12, fontSize: 13, fontWeight: 700, color: '#F2762E' }}
          onClick={() => navigate('/recuperar-senha')}
        >
          Esqueci minha senha
        </div>
        <div style={{ flex: 1, minHeight: 28 }} />

        <PrimaryButton onClick={submit} loading={vm.loading} disabled={!vm.canSubmit}>
          Entrar
        </PrimaryButton>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#8e8e98', fontWeight: 500 }}>
          Não tem conta?{' '}
          <span
            className="pressable-row"
            role="button"
            style={{ color: '#16153a', fontWeight: 700 }}
            onClick={() => navigate('/cadastro')}
          >
            Criar conta
          </span>
        </div>
      </div>
    </div>
  );
}