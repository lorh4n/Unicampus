import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomSheet } from '../components/common/BottomSheet';
import { IconChevronRight, IconLogout } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { initials } from '../utils/format';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';

function Row({
  iconBg, icon, label, right, onClick, last,
}: {
  iconBg: string;
  icon: JSX.Element;
  label: string;
  right: JSX.Element;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <div
      className={onClick ? 'pressable-row' : undefined}
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 13, padding: '14px 0',
        borderBottom: last ? 'none' : '1px solid #f0f0f3',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 11, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: '#16153a' }}>{label}</span>
      {right}
    </div>
  );
}

export function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useProfileViewModel();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div className="container-narrow">
      <PageHeader title="Perfil" />

      {/* hero */}
      <div className="card" style={{ borderRadius: 24, padding: 18, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 15 }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(150deg,#F2762E,#FF9D4D)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
            boxShadow: '0 8px 20px rgba(242,118,46,0.3)',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
            {vm.student ? initials(vm.student.name) : '—'}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: '#16153a', letterSpacing: '-0.01em' }}>
            {vm.student?.name}
          </div>
          <div style={{ fontSize: 12.5, color: '#8e8e98', fontWeight: 500, marginTop: 1 }}>
            RA {vm.student?.ra} · {vm.student?.course}
          </div>
          {vm.progressPercent !== undefined && (
            <div
              className="pressable-row"
              role="button"
              onClick={() => navigate('/app/integralizacao')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#16153a', borderRadius: 20, padding: '4px 10px', marginTop: 8 }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: '#FFC524' }}>{vm.progressPercent}%</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>integralizado</span>
            </div>
          )}
        </div>
      </div>

      {/* conta */}
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9a9aa4', letterSpacing: '0.04em', margin: '0 0 8px 4px' }}>CONTA</div>
      <div className="card" style={{ borderRadius: 20, padding: '2px 16px', marginBottom: 18 }}>
        <Row
          iconBg="#FFF1E6"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle cx="9" cy="6" r="3.2" fill="none" stroke="#F2762E" strokeWidth="1.7" />
              <path d="M3.5 15.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="#F2762E" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          }
          label="Dados pessoais"
          right={<IconChevronRight />}
          onClick={() => navigate('/app/perfil/dados')}
        />
        <Row
          iconBg="#EAF1FF"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M9 2 2 5.2 9 8.4 16 5.2 9 2Z" fill="none" stroke="#2D6FE0" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M5 7v4c0 1.1 1.8 2 4 2s4-.9 4-2V7" fill="none" stroke="#2D6FE0" strokeWidth="1.6" />
            </svg>
          }
          label="Curso e matrícula"
          right={<span style={{ fontSize: 12.5, color: '#9a9aa4', fontWeight: 600 }}>CC · {vm.student?.courseCode ?? '42'}</span>}
          onClick={() => navigate('/app/perfil/curso')}
        />
        <Row
          last
          iconBg="#FFF1E6"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M9 2a4.3 4.3 0 0 0-4.3 4.3c0 2.9-1 4.3-1.4 5h11.4c-.5-.7-1.4-2.1-1.4-5A4.3 4.3 0 0 0 9 2Z" fill="none" stroke="#F2762E" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M7.4 14.5a1.7 1.7 0 0 0 3.2 0" fill="none" stroke="#F2762E" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
          label="Notificações"
          right={
            <button
              role="switch"
              aria-checked={vm.notificationsOn}
              aria-label="Ativar notificações"
              onClick={vm.toggleNotifications}
              style={{
                width: 46, height: 28, borderRadius: 16, border: 'none',
                background: vm.notificationsOn ? '#FFC524' : '#d8d8e0',
                position: 'relative', flex: 'none', cursor: 'pointer',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)', transition: 'background .2s ease',
                padding: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute', top: 3, left: vm.notificationsOn ? 21 : 3, width: 22, height: 22,
                  borderRadius: '50%', background: '#fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'left .2s ease',
                }}
              />
            </button>
          }
        />
      </div>

      {/* preferências */}
      <div style={{ fontSize: 12, fontWeight: 700, color: '#9a9aa4', letterSpacing: '0.04em', margin: '0 0 8px 4px' }}>PREFERÊNCIAS</div>
      <div className="card" style={{ borderRadius: 20, padding: '2px 16px', marginBottom: 18 }}>
        <Row
          iconBg="#F3EEFF"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M9 3a6 6 0 1 0 5 9.5A5 5 0 0 1 9 3Z" fill="none" stroke="#7C4DFF" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          }
          label="Aparência"
          right={<span style={{ fontSize: 12.5, color: '#9a9aa4', fontWeight: 600 }}>Claro</span>}
          onClick={() => showToast('Tema escuro chega numa próxima versão')}
        />
        <Row
          last
          iconBg="#E6F7F2"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="7" fill="none" stroke="#16A085" strokeWidth="1.6" />
              <path d="M2 9h14M9 2c2 2.3 2 11.7 0 14M9 2c-2 2.3-2 11.7 0 14" fill="none" stroke="#16A085" strokeWidth="1.6" />
            </svg>
          }
          label="Idioma"
          right={<span style={{ fontSize: 12.5, color: '#9a9aa4', fontWeight: 600 }}>Português</span>}
          onClick={() => showToast('Só temos português por enquanto 🇧🇷')}
        />
      </div>

      {/* sair */}
      <div
        className="card pressable-row"
        role="button"
        onClick={() => setConfirmLogout(true)}
        style={{ borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}
      >
        <IconLogout />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#FF5A4D' }}>Sair da conta</span>
      </div>

      <BottomSheet
        open={confirmLogout}
        icon={<IconLogout size={22} />}
        danger
        title="Sair da conta?"
        subtitle="Você vai precisar entrar de novo com RA e senha."
        confirmLabel="Sair"
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          vm.logout();
          navigate('/bem-vindo');
        }}
      />
    </div>
  );
}
