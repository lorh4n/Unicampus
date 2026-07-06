// SVGs inline portados do design (DESIGN.md §5) — não trocar por lib de ícones.

export function IconMenuGrid({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <rect x="0" y="0" width="7" height="7" rx="2" fill={color} />
      <rect x="11" y="0" width="7" height="7" rx="2" fill={color} />
      <rect x="0" y="11" width="7" height="7" rx="2" fill={color} />
      <rect x="11" y="11" width="7" height="7" rx="2" fill={color} />
    </svg>
  );
}

export function IconSearch({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="2" />
      <path d="M12.5 12.5 16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path
        d="M9 2a4.5 4.5 0 0 0-4.5 4.5c0 3-1 4.5-1.5 5.2h12c-.5-.7-1.5-2.2-1.5-5.2A4.5 4.5 0 0 0 9 2Z"
        fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round"
      />
      <path d="M7.3 15a1.8 1.8 0 0 0 3.4 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconBack({ color = '#16153a', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M11 3 5 9l6 6" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ color = '#c4c4cc' }: { color?: string }) {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16" style={{ flex: 'none' }}>
      <path d="M1 1 8 8 1 15" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconFlame() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 20">
      <path d="M9 1C6 5 4 7 4 11a5 5 0 0 0 10 0c0-1.7-.8-3.2-1.7-4.4-.3 1-1 1.8-1.9 2C11 6 10.5 3 9 1Z" fill="#FF8A3D" />
      <path d="M9 8c-1.2 1.6-2 2.6-2 4a2 2 0 0 0 4 0c0-1-.5-1.8-1-2.6C9.7 9 9.4 8.5 9 8Z" fill="#FFC524" />
    </svg>
  );
}

export function IconWarn({ color = '#fff', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M9 2 16.5 15.5H1.5L9 2Z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <line x1="9" y1="7" x2="9" y2="10.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="12.8" r="0.9" fill={color} />
    </svg>
  );
}

export function IconPlus({ color = '#16153a', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <line x1="9" y1="3" x2="9" y2="15" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="3" y1="9" x2="15" y2="9" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconDots({ color = '#fff' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="4" cy="9" r="1.6" fill={color} />
      <circle cx="9" cy="9" r="1.6" fill={color} />
      <circle cx="14" cy="9" r="1.6" fill={color} />
    </svg>
  );
}

export function IconCheck({ color = '#fff', size = 15 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" style={{ flex: 'none' }}>
      <path d="M3 7.7 6 10.6 12 4" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLock({ color = '#aaa9b4', size = 13 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" style={{ flex: 'none' }}>
      <rect x="2.8" y="6" width="7.4" height="5.2" rx="1.3" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M4.4 6V4.4a2.1 2.1 0 0 1 4.2 0V6" fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

export function IconStatusCursando() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" style={{ flex: 'none' }}>
      <circle cx="6.5" cy="6.5" r="5.3" fill="none" stroke="#F2762E" strokeWidth="2" />
      <circle cx="6.5" cy="6.5" r="2" fill="#F2762E" />
    </svg>
  );
}

export function IconStatusDisponivel() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" style={{ flex: 'none' }}>
      <circle cx="6.5" cy="6.5" r="5" fill="none" stroke="#b6b6c0" strokeWidth="1.8" />
    </svg>
  );
}

export function IconLogout({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      <path d="M7 2H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3" fill="none" stroke="#FF5A4D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 5l4 4-4 4M15 9H7" fill="none" stroke="#FF5A4D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShieldCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M10 1 2 5v5c0 4.5 3.2 7.5 8 9 4.8-1.5 8-4.5 8-9V5l-8-4Z" fill="none" stroke="#FFC524" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 10 9 12.5 14 7" stroke="#FFC524" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconEye({ color = '#9a9aa4' }: { color?: string }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16">
      <path d="M1 8s3-5.5 9-5.5S19 8 19 8s-3 5.5-9 5.5S1 8 1 8Z" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="8" r="2.4" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function IconClose({ color = '#16153a', size = 13 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13">
      <path d="M1 1 12 12M12 1 1 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ---- bottom nav ----

export function NavHome({ active }: { active: boolean }) {
  return active ? (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M3 9 10 3l7 6v7a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V9Z" fill="#16153a" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <path d="M4 10 11 4l7 6v7a1 1 0 0 1-1 1h-3v-5H8v5H5a1 1 0 0 1-1-1v-7Z" fill="none" stroke="#7e7e9c" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function NavCalendar({ active }: { active: boolean }) {
  const c = active ? '#16153a' : '#7e7e9c';
  const s = active ? 20 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 22 22">
      <rect x="3" y="4" width="16" height="15" rx="3" fill="none" stroke={c} strokeWidth="1.9" />
      <line x1="3" y1="8.5" x2="19" y2="8.5" stroke={c} strokeWidth="1.9" />
      <line x1="7" y1="2.5" x2="7" y2="5.5" stroke={c} strokeWidth="1.9" strokeLinecap="round" />
      <line x1="15" y1="2.5" x2="15" y2="5.5" stroke={c} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function NavBars({ active }: { active: boolean }) {
  const c = active ? '#16153a' : '#7e7e9c';
  return (
    <svg width={active ? 20 : 22} height={active ? 20 : 22} viewBox="0 0 22 22">
      <rect x="3" y="11" width="4" height="7" rx="1.3" fill={c} />
      <rect x="9" y="6" width="4" height="12" rx="1.3" fill={c} />
      <rect x="15" y="9" width="4" height="9" rx="1.3" fill={c} />
    </svg>
  );
}

export function NavPerson({ active }: { active: boolean }) {
  return active ? (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="7" r="3.4" fill="#16153a" />
      <path d="M3.5 17c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" fill="#16153a" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="7" r="3.7" fill="none" stroke="#7e7e9c" strokeWidth="1.8" />
      <path d="M4 19c0-3.6 3.1-6 7-6s7 2.4 7 6" fill="none" stroke="#7e7e9c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
