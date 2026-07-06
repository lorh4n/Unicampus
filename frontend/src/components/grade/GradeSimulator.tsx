import type { GradeCriterion } from '../../models';
import type { SimulatorResult } from '../../domain/rules';
import { fmtGrade } from '../../utils/format';
import { IconShieldCheck } from '../icons';

const TONE_COLOR = { ok: '#7CE0A0', warn: '#FFC524', fail: '#FF8A8A' } as const;

export interface SimulatorProps {
  simulator: {
    knownCriteria: GradeCriterion[];
    values: Record<string, number>;
    setValue: (id: string, v: number) => void;
    result: SimulatorResult | null;
  };
}

/** Card navy do simulador: sliders das notas conhecidas → nota necessária (SPEC §5.5). */
export function GradeSimulator({ simulator }: SimulatorProps) {
  if (!simulator.result) {
    return null; // todas as avaliações já têm nota — nada a simular
  }

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

      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 18, padding: 16, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 13, color: '#b9b9d4', lineHeight: 1.4 }}>
          Para ser <span style={{ color: '#7CE0A0', fontWeight: 700 }}>aprovada</span> (média 5,0), você
          precisa de pelo menos:
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 4px' }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#FFC524', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {simulator.result.neededLabel}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{simulator.result.targetLabel}</span>
        </div>
        <div style={{ fontSize: 12, color: TONE_COLOR[simulator.result.tone], fontWeight: 600 }}>
          {simulator.result.message}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 16 }}>
        {simulator.knownCriteria.map((c, i) => (
          <div key={c.id} style={{ marginTop: i > 0 ? 12 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#b9b9d4', fontWeight: 600 }}>Nota — {c.label}</span>
              <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>{fmtGrade(simulator.values[c.id])}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={simulator.values[c.id]}
              aria-label={`Nota de ${c.label}`}
              onChange={(e) => simulator.setValue(c.id, parseFloat(e.target.value))}
            />
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#8a8aac', fontWeight: 500, marginTop: 10 }}>
          Simulação local — arraste para testar cenários; nada é salvo.
        </div>
      </div>
    </div>
  );
}
