import type { Course } from '../../models';
import { remainingAbsences } from '../../domain/rules';

interface AbsenceTrackerProps {
  course: Course;
  /** Ajusta o contador pessoal do aluno (opcional — só na tela de detalhe). */
  onChangeSelf?: (value: number) => void;
  saving?: boolean;
}

/**
 * Controle de faltas: barra até o limite de 25%. Mostra as faltas OFICIAIS (lançadas
 * pelo professor) e o CONTROLE PESSOAL do aluno — que ele ajusta enquanto o professor
 * ainda não lançou no sistema (BUSINESS_RULES.md §4.2).
 */
export function AbsenceTracker({ course, onChangeSelf, saving }: AbsenceTrackerProps) {
  // o que vale para o risco de reprovação é o maior entre oficial e controle pessoal
  const effective = Math.max(course.absences, course.selfAbsences);
  const remaining = remainingAbsences({ absences: effective, absenceLimit: course.absenceLimit });
  const pct = Math.min(100, (effective / course.absenceLimit) * 100);
  const over = remaining < 0;

  return (
    <div style={{ background: '#fff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(20,20,45,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: '#9a9aa4', fontWeight: 600 }}>Faltas (maior contagem)</div>
          <div style={{ fontSize: 13, color: '#16153a', fontWeight: 600, marginTop: 2 }}>
            de {course.totalHours}h de carga horária
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: over ? '#FF5A4D' : '#16153a' }}>{effective}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#9a9aa4' }}> / {course.absenceLimit}</span>
        </div>
      </div>

      <div style={{ height: 12, borderRadius: 8, background: '#f0f0f3', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
            background: over ? 'linear-gradient(90deg,#FF8A3D,#FF5A4D)' : 'linear-gradient(90deg,#FFC524,#FF8A3D)',
            borderRadius: 8, transition: 'width .4s cubic-bezier(.34,1.2,.64,1)',
          }}
        />
        <div style={{ position: 'absolute', left: '100%', top: -3, bottom: -3, width: 2, background: '#FF5A4D', transform: 'translateX(-2px)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: '#9a9aa4', fontWeight: 600 }}>0 faltas</span>
        <span style={{ fontSize: 11, color: '#FF5A4D', fontWeight: 700 }}>Limite 25% · {course.absenceLimit} faltas</span>
      </div>

      {/* oficial vs pessoal */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <div style={{ flex: 1, background: '#f6f6f9', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, color: '#9a9aa4', fontWeight: 700, letterSpacing: '0.02em' }}>OFICIAL (professor)</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#16153a', marginTop: 2 }}>{course.absences}</div>
        </div>
        <div style={{ flex: 1, background: '#FFF4E8', borderRadius: 14, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#C58A4A', fontWeight: 700, letterSpacing: '0.02em' }}>SEU CONTROLE</span>
            {onChangeSelf && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  className="pressable" aria-label="Remover uma falta pessoal"
                  disabled={saving || course.selfAbsences <= 0}
                  onClick={() => onChangeSelf(course.selfAbsences - 1)}
                  style={stepBtn(course.selfAbsences <= 0)}
                >
                  −
                </button>
                <button
                  className="pressable" aria-label="Registrar uma falta pessoal"
                  disabled={saving}
                  onClick={() => onChangeSelf(course.selfAbsences + 1)}
                  style={stepBtn(false)}
                >
                  +
                </button>
              </div>
            )}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#A85A12', marginTop: 2 }}>{course.selfAbsences}</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          background: over ? '#FFEDEC' : '#F1F1F4',
          borderRadius: 14, padding: '10px 12px',
          fontSize: 12, color: over ? '#B3261E' : '#74747e', fontWeight: 600, lineHeight: 1.35,
        }}
      >
        {over ? (
          <>Limite de faltas ultrapassado — risco de reprovação por frequência.</>
        ) : (
          <>
            Restam <b>{remaining} {remaining === 1 ? 'falta' : 'faltas'}</b> antes de reprovar por frequência.
            {onChangeSelf && ' Use "Seu controle" para anotar faltas antes do professor lançar.'}
          </>
        )}
      </div>
    </div>
  );
}

function stepBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 24, height: 24, borderRadius: 8, border: 'none',
    background: disabled ? '#f0e2cf' : '#FF8A3D', color: '#fff',
    fontSize: 16, fontWeight: 800, lineHeight: 1, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 0,
    cursor: disabled ? 'default' : 'pointer',
  };
}
