// Seções secundárias do painel (padrão "em construção" do design Admin Web).
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_TITLES } from './AdminLayout';

export function AdminPlaceholder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title] = ADMIN_TITLES[location.pathname] ?? ['Seção'];

  return (
    <div className="admin-card" style={{ padding: '70px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 74, height: 74, borderRadius: 22, background: '#f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="34" height="34" viewBox="0 0 34 34">
          <rect x="6" y="8" width="22" height="18" rx="3" fill="none" stroke="#b6b6c0" strokeWidth="2" />
          <path d="M6 13h22" stroke="#b6b6c0" strokeWidth="2" />
          <circle cx="9.5" cy="10.5" r="0.9" fill="#b6b6c0" />
        </svg>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#8e8e98', marginTop: 8, maxWidth: 380, lineHeight: 1.5 }}>
        Esta seção depende de dados que virão do backend (alocação, matrículas e relatórios). A base
        visual reutiliza a tabela, os filtros e o drawer de Disciplinas.
      </div>
      <button
        className="pressable"
        onClick={() => navigate('/admin/disciplinas')}
        style={{ marginTop: 24, border: 'none', borderRadius: 13, background: '#16153a', color: '#fff', fontSize: 14, fontWeight: 800, padding: '12px 22px' }}
      >
        Voltar a Disciplinas
      </button>
    </div>
  );
}
