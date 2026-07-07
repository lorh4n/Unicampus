import type { SimulatorModel } from '../../viewmodels/useCourseDetailViewModel';
import { fmtGrade } from '../../utils/format';
import { IconShieldCheck } from '../icons';

const TONE_COLOR = { ok: '#7CE0A0', warn: '#FFC524', fail: '#FF8A8A' } as const;

/**
 * Simulador de notas (card navy). As notas JÁ LANÇADAS pelo professor aparecem
 * fixas (ponderadas pelo PDD); os sliders simulam as avaliações RESTANTES e
 * mostram a média projetada ao vivo (BUSINESS_RULES.md §4.1).
 */
export function GradeSimulator({ simulator }: { simulator: SimulatorModel | null }) {
  if (!simulator) return null; // todas as avaliações já têm nota — nada a simular

  const passing = simulator.projectedPassing;

  return (
    <div
      style={{
        background: '#16153a', borderRadius: 26, padding: 20,
        boxShadow: '0 16px 34px rgba(20,20,45,0.3)', position: 'relative', overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', right: -20, bottom: -30, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,197,36,0.25), transparent 70%)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, position: 'relative', zIndex: 1 }}>
        <IconShieldCheck />
        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Simulador de notas</span>
      </div>

      {/* nota necessária — baseada só nas notas reais já lançadas */}
      {simulator.needed && (
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 18, padding: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, color: '#b9b9d4', lineHeight: 1.4 }}>
            Para ser <span style={{ color: '#7CE0A0', fontWeight: 700 }}>aprovada</span> (média 5,0), você
            precisa de pelo menos:
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: '#FFC524', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {simulator.needed.neededLabel}
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{simulator.needed.targetLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: TONE_COLOR[simulator.needed.tone], fontWeight: 600 }}>
            {simulator.needed.message}
          </div>
        </div>
      )}

      {/* notas já lançadas (fixas) */}
      {simulator.launched.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
          <div style={{ fontSize: 11, color: '#8a8aac', fontWeight: 700, letterSpacing: '0.03em', marginBottom: 8 }}>
            JÁ LANÇADAS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {simulator.launched.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '8px 11px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: 12, color: '#b9b9d4', fontWeight: 600 }}>{c.label}</span>
                <span style={{ fontSize: 11, color: '#8a8aac', fontWeight: 600 }}>{c.weight}%</span>
                <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>{fmtGrade(c.grade)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* sliders das avaliações restantes */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
        <div style={{ fontSize: 11, color: '#8a8aac', fontWeight: 700, letterSpacing: '0.03em', marginBottom: 8 }}>
          SIMULE AS RESTANTES
        </div>
        {simulator.remaining.map((c, i) => (
          <div key={c.id} style={{ marginTop: i > 0 ? 12 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#b9b9d4', fontWeight: 600 }}>
                {c.label} <span style={{ color: '#8a8aac' }}>· {c.weight}%</span>
              </span>
              <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>{fmtGrade(simulator.remainingValues[c.id])}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={simulator.remainingValues[c.id]}
              aria-label={`Nota simulada de ${c.label}`}
              onChange={(e) => simulator.setRemainingValue(c.id, parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>

      {/* média projetada ao vivo */}
      <div
        style={{
          position: 'relative', zIndex: 1, marginTop: 16,
          background: passing ? 'rgba(124,224,160,0.12)' : 'rgba(255,138,138,0.12)',
          borderRadius: 16, padding: '13px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: '#b9b9d4', fontWeight: 600 }}>Média projetada</div>
          <div style={{ fontSize: 11.5, color: passing ? '#7CE0A0' : '#FF8A8A', fontWeight: 700, marginTop: 2 }}>
            {passing ? '✓ Aprovada neste cenário' : '✕ Abaixo da média neste cenário'}
          </div>
        </div>
        <span style={{ fontSize: 34, fontWeight: 800, color: passing ? '#7CE0A0' : '#FF8A8A', letterSpacing: '-0.02em' }}>
          {fmtGrade(simulator.projected)}
        </span>
      </div>

      <div style={{ fontSize: 11, color: '#8a8aac', fontWeight: 500, marginTop: 10, position: 'relative', zIndex: 1 }}>
        Simulação local — arraste as restantes para testar cenários; nada é salvo.
      </div>
    </div>
  );
}
