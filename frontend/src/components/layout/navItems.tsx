// Itens de navegação compartilhados entre Sidebar (desktop) e Drawer (mobile).

export interface NavItemDef {
  path: string;
  label: string;
  icon: JSX.Element;
}

export const NAV_ITEMS: NavItemDef[] = [
  {
    path: '/app/inicio', label: 'Início',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <path d="M3 9 9 3.5 15 9v6a1 1 0 0 1-1 1h-3v-4H7v4H4a1 1 0 0 1-1-1V9Z" fill="#16153a" />
      </svg>
    ),
  },
  {
    path: '/app/grade', label: 'Grade horária',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <rect x="2.5" y="3.5" width="13" height="12" rx="2.5" fill="none" stroke="#16153a" strokeWidth="1.6" />
        <line x1="2.5" y1="7" x2="15.5" y2="7" stroke="#16153a" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    path: '/app/estatisticas', label: 'Estatísticas',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <rect x="2" y="9" width="3.4" height="6.5" rx="1.1" fill="#16153a" />
        <rect x="7.3" y="4.5" width="3.4" height="11" rx="1.1" fill="#16153a" />
        <rect x="12.6" y="7" width="3.4" height="8.5" rx="1.1" fill="#16153a" />
      </svg>
    ),
  },
  {
    path: '/app/integralizacao', label: 'Integralização',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <circle cx="9" cy="4" r="2.3" fill="none" stroke="#16153a" strokeWidth="1.6" />
        <circle cx="4.5" cy="13" r="2.3" fill="none" stroke="#16153a" strokeWidth="1.6" />
        <circle cx="13.5" cy="13" r="2.3" fill="none" stroke="#16153a" strokeWidth="1.6" />
        <path d="M9 6.3v3.2M9 9.5 5 11M9 9.5 13 11" fill="none" stroke="#16153a" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    path: '/app/notificacoes', label: 'Notificações',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <path d="M9 2a4.3 4.3 0 0 0-4.3 4.3c0 2.9-1 4.3-1.4 5h11.4c-.5-.7-1.4-2.1-1.4-5A4.3 4.3 0 0 0 9 2Z" fill="none" stroke="#16153a" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M7.4 14.5a1.7 1.7 0 0 0 3.2 0" fill="none" stroke="#16153a" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/app/busca', label: 'Busca',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <circle cx="8" cy="8" r="5.5" fill="none" stroke="#16153a" strokeWidth="1.8" />
        <path d="M12.5 12.5 15.5 15.5" stroke="#16153a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: '/app/perfil', label: 'Perfil',
    icon: (
      <svg width="17" height="17" viewBox="0 0 18 18">
        <circle cx="9" cy="6" r="3" fill="none" stroke="#16153a" strokeWidth="1.6" />
        <path d="M3.5 15.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="#16153a" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];
