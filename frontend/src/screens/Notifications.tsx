import { PageHeader } from '../components/layout/PageHeader';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconBell, IconWarn } from '../components/icons';
import type { NotificationKind } from '../models';
import { useNotificationsViewModel } from '../viewmodels/useNotificationsViewModel';

const KIND_ICON: Record<NotificationKind, { bg: string; icon: JSX.Element }> = {
  falta: { bg: '#FFF4E8', icon: <IconWarn color="#FF8A3D" /> },
  nota: {
    bg: '#FFEDEC',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="7" fill="none" stroke="#FF5A4D" strokeWidth="1.6" />
        <line x1="9" y1="5.5" x2="9" y2="9.5" stroke="#FF5A4D" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="9" cy="12.3" r="0.9" fill="#FF5A4D" />
      </svg>
    ),
  },
  prazo: {
    bg: '#EAF1FF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="2.5" y="4" width="13" height="11" rx="2.5" fill="none" stroke="#2D6FE0" strokeWidth="1.6" />
        <line x1="2.5" y1="7.5" x2="15.5" y2="7.5" stroke="#2D6FE0" strokeWidth="1.6" />
        <line x1="6" y1="2.5" x2="6" y2="5" stroke="#2D6FE0" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="12" y1="2.5" x2="12" y2="5" stroke="#2D6FE0" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  sistema: { bg: '#ECECF3', icon: <IconBell color="#16153a" /> },
};

export function Notifications() {
  const vm = useNotificationsViewModel();

  return (
    <div className="container-narrow">
      <PageHeader
        back
        title="Notificações"
        subtitle={`${vm.unreadCount} não lidas`}
        right={
          <button
            className="pressable"
            onClick={vm.markAllRead}
            style={{
              border: 'none', background: 'transparent', fontSize: 12.5, fontWeight: 700,
              color: '#F2762E', padding: 0, whiteSpace: 'nowrap',
            }}
          >
            Marcar todas
          </button>
        }
      />

      {vm.isLoading ? (
        <ListSkeleton rows={4} height={84} />
      ) : vm.isError ? (
        <ErrorState onRetry={vm.retry} />
      ) : (
        vm.groups.map((g) => (
          <div key={g.label} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9a9aa4', letterSpacing: '0.03em', margin: '0 0 9px 6px' }}>
              {g.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map((n, i) => (
                <div
                  key={n.id}
                  className="pressable-row float-in"
                  role="button"
                  aria-label={`${n.title}${n.read ? '' : ' (não lida)'}`}
                  onClick={() => vm.toggleRead(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 14px',
                    borderRadius: 18, background: '#fff',
                    opacity: n.read ? 0.6 : 1,
                    boxShadow: n.read ? 'none' : '0 4px 14px rgba(20,20,45,0.06)',
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: 12, background: KIND_ICON[n.kind].bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                    }}
                  >
                    {KIND_ICON[n.kind].icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#16153a', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500, lineHeight: 1.35, marginTop: 2 }}>
                      {n.desc}
                    </div>
                    <div style={{ fontSize: 11, color: '#b4b4be', fontWeight: 600, marginTop: 5 }}>{n.time}</div>
                  </div>
                  {!n.read && <div className="unread-dot" style={{ marginTop: 5 }} />}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
