import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListSkeleton } from '../components/common/Skeleton';
import { IconBack, IconClose, IconSearch } from '../components/icons';
import type { CourseStatus, SearchTab } from '../models';
import { courseGradient } from '../theme/tokens';
import { useSearchViewModel } from '../viewmodels/useSearchViewModel';

const TABS: Array<{ id: SearchTab; label: string }> = [
  { id: 'disciplinas', label: 'Disciplinas' },
  { id: 'professores', label: 'Professores' },
  { id: 'salas', label: 'Salas' },
];

const STATUS_BADGE: Record<CourseStatus, { label: string; color: string; bg: string }> = {
  aprovada: { label: 'Aprovada', color: '#16A085', bg: '#E6F7F2' },
  cursando: { label: 'Cursando', color: '#F2762E', bg: '#FFF1E6' },
  disponivel: { label: 'Disponível', color: '#2D6FE0', bg: '#EAF1FF' },
  bloqueada: { label: 'Bloqueada', color: '#9a9aa4', bg: '#f0f0f3' },
};

export function Search() {
  const navigate = useNavigate();
  const vm = useSearchViewModel();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const openResult = (code: string) => {
    const id = vm.courseIdFor(code);
    if (id) navigate(`/app/disciplina/${id}`);
  };

  return (
    <div className="container-narrow">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="icon-circle-white pressable mobile-only" aria-label="Voltar" onClick={() => navigate(-1)}>
          <IconBack />
        </button>
        <div
          style={{
            flex: 1, background: '#fff', border: '1.5px solid #FFC524', borderRadius: 16,
            padding: '12px 14px', boxShadow: '0 0 0 3px rgba(255,197,36,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <IconSearch color="#9a9aa4" />
          <input
            ref={inputRef}
            value={vm.q}
            placeholder="Buscar disciplina, professor, sala…"
            aria-label="Buscar"
            onChange={(e) => vm.setQ(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 15, fontWeight: 600,
              color: '#16153a', background: 'transparent', minWidth: 0,
            }}
          />
          {vm.q && (
            <button
              className="pressable" aria-label="Limpar busca" onClick={() => vm.setQ('')}
              style={{
                width: 18, height: 18, borderRadius: '50%', border: 'none', background: '#e4e4ea',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flex: 'none',
              }}
            >
              <IconClose color="#74747e" size={9} />
            </button>
          )}
        </div>
      </div>

      {/* abas de filtro */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="pressable"
            onClick={() => vm.setTab(t.id)}
            style={{
              fontSize: 12.5, fontWeight: 700, borderRadius: 20, padding: '7px 15px',
              ...(vm.tab === t.id
                ? { background: '#16153a', color: '#fff', border: '1.5px solid transparent' }
                : { background: '#fff', color: '#74747e', border: '1.5px solid #e8e8ee' }),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {vm.q.trim() === '' ? (
        <div style={{ textAlign: 'center', padding: '60px 30px', color: '#9a9aa4', fontSize: 13.5, fontWeight: 500 }}>
          Busque por código ou nome — ex. <b>MC322</b>, <b>cálc</b>, <b>CB02</b>.
        </div>
      ) : vm.isSearching ? (
        <ListSkeleton rows={4} height={70} />
      ) : (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#9a9aa4', letterSpacing: '0.03em', margin: '0 0 10px 4px' }}>
            {vm.results.length} RESULTADO{vm.results.length === 1 ? '' : 'S'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vm.results.map((r, i) => (
              <div
                key={`${r.code}-${i}`}
                className="pressable-row float-in"
                role="button"
                onClick={() => openResult(r.code)}
                style={{
                  background: '#fff', borderRadius: 18, padding: '13px 14px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxShadow: '0 4px 14px rgba(20,20,45,0.05)',
                  animationDelay: `${i * 0.05}s`,
                  opacity: r.status === 'bloqueada' ? 0.85 : 1,
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: r.color ? courseGradient(r.color) : '#edecf0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: r.color ? '#fff' : '#aaa9b4' }}>
                    {r.code}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#16153a' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.detail}
                  </div>
                </div>
                {r.status && (
                  <span
                    style={{
                      fontSize: 10.5, fontWeight: 800,
                      color: STATUS_BADGE[r.status].color, background: STATUS_BADGE[r.status].bg,
                      borderRadius: 8, padding: '3px 8px', flex: 'none',
                    }}
                  >
                    {STATUS_BADGE[r.status].label}
                  </span>
                )}
                {r.score !== undefined && (
                  <span
                    style={{
                      fontSize: 11.5, fontWeight: 800, color: '#F2762E', background: '#FFF1E6',
                      borderRadius: 8, padding: '3px 8px', flex: 'none',
                    }}
                  >
                    ⭐ {r.score.toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
