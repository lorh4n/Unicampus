import { useNavigate } from 'react-router-dom';

const SIDE_CARDS = [
  {
    code: 'F 128', grad: 'linear-gradient(150deg,#7C4DFF,#A78BFA)',
    style: { left: 14, top: 30, transform: 'rotate(-13deg)', boxShadow: '0 16px 36px rgba(124,77,255,0.32)', opacity: 0.92 },
  },
  {
    code: 'MA111', grad: 'linear-gradient(150deg,#2D6FE0,#5B9BFF)',
    style: { right: 8, top: 18, transform: 'rotate(10deg)', boxShadow: '0 16px 36px rgba(45,111,224,0.32)', opacity: 0.94 },
  },
] as const;

export function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src="/unicamp.svg" alt="Unicamp" style={{ height: 40, width: 'auto', alignSelf: 'flex-start', marginBottom: 8 }} />

        {/* cards empilhados — metáfora de disciplinas */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
          <div style={{ position: 'relative', width: 230, height: 210 }}>
            {SIDE_CARDS.map((c) => (
              <div
                key={c.code}
                style={{
                  position: 'absolute', width: 150, height: 150, borderRadius: 30,
                  background: c.grad, display: 'flex', alignItems: 'flex-end', padding: 14,
                  ...c.style,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>{c.code}</span>
              </div>
            ))}
            <div
              style={{
                position: 'absolute', left: 40, top: 44, width: 150, height: 150, borderRadius: 30,
                background: 'linear-gradient(150deg,#F2762E,#FF9D4D)',
                boxShadow: '0 20px 44px rgba(242,118,46,0.4)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>MC322</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Média 7.8 · 92%</span>
            </div>
          </div>
        </div>

        <div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: '#16153a', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Bem-vindo ao
            <br />
            Unicampus
          </h1>
          <p style={{ fontSize: 15, color: '#8e8e98', fontWeight: 500, lineHeight: 1.45, margin: '12px 0 0' }}>
            Sua vida acadêmica na Unicamp, organizada: notas, faltas, grade e o mapa do seu curso — tudo em
            um lugar.
          </p>
        </div>

        <div style={{ marginTop: 28 }}>
          <button className="btn-primary pressable" style={{ padding: 18 }} onClick={() => navigate('/cadastro')}>
            Criar minha conta
          </button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#8e8e98', fontWeight: 500 }}>
            Já tem conta?{' '}
            <span
              className="pressable-row"
              role="button"
              style={{ color: '#16153a', fontWeight: 700 }}
              onClick={() => navigate('/entrar')}
            >
              Entrar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
