import type { Course } from '../../models';
import { courseGradient } from '../../theme/tokens';

// Faixas de horário do protótipo: 08/10/14/16/19h, 96px por faixa (SPEC §5.4).
const BANDS = ['08:00', '10:00', '14:00', '16:00', '19:00'];
const BAND_LABELS = ['08h', '10h', '14h', '16h', '19h', '21h'];
const BAND_HEIGHT = 96;
const BLOCK_HEIGHT = 90;

function bandIndex(start: string): number {
  const i = BANDS.indexOf(start);
  if (i >= 0) return i;
  // horário fora das faixas: aproxima pela hora
  const h = parseInt(start, 10);
  let best = 0;
  BANDS.forEach((b, idx) => {
    if (parseInt(b, 10) <= h) best = idx;
  });
  return best;
}

interface TimetableGridProps {
  courses: Course[];
  onSelect: (courseId: string) => void;
}

/** Grade semanal posicional Seg–Sex com blocos coloridos por disciplina. */
export function TimetableGrid({ courses, onSelect }: TimetableGridProps) {
  const today = new Date().getDay(); // 1=Seg .. 5=Sex

  const blocks: Array<{ course: Course; weekday: number; top: number; room: string }> = [];
  for (const c of courses)
    for (const s of c.slots)
      blocks.push({ course: c, weekday: s.weekday, top: bandIndex(s.start) * BAND_HEIGHT, room: s.room });

  return (
    <div>
      {/* cabeçalho de dias */}
      <div style={{ display: 'flex', marginBottom: 6 }}>
        <div style={{ width: 38, flex: 'none' }} />
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((d, i) => {
            const isToday = i + 1 === today;
            return (
              <div
                key={d}
                style={{
                  flex: 1, textAlign: 'center', fontSize: 12,
                  fontWeight: isToday ? 800 : 700,
                  color: isToday ? '#fff' : '#9a9aa4',
                  background: isToday ? '#16153a' : 'transparent',
                  borderRadius: 10, padding: '2px 0',
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex' }}>
        {/* trilho de horas */}
        <div style={{ width: 38, flex: 'none', display: 'flex', flexDirection: 'column' }}>
          {BAND_LABELS.map((h, i) => (
            <div
              key={h}
              style={{
                height: i < 5 ? BAND_HEIGHT : 8, fontSize: 10, fontWeight: 600,
                color: '#a8a8b2', paddingTop: 2,
              }}
            >
              {h}
            </div>
          ))}
        </div>
        {/* colunas */}
        <div style={{ flex: 1, display: 'flex', gap: 6, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ height: i < 5 ? BAND_HEIGHT : 0, borderTop: '1px solid #e4e4ea' }} />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((wd) => (
            <div key={wd} style={{ flex: 1, position: 'relative', height: BAND_HEIGHT * 5 + 8 }}>
              {blocks
                .filter((b) => b.weekday === wd)
                .map((b, i) => (
                  <div
                    key={`${b.course.id}-${i}`}
                    className="pressable"
                    role="button"
                    aria-label={`${b.course.code} — ${b.room}`}
                    onClick={() => onSelect(b.course.id)}
                    style={{
                      position: 'absolute', top: b.top, left: 0, right: 0, height: BLOCK_HEIGHT,
                      background: courseGradient(b.course.color, 160),
                      borderRadius: 12, padding: '8px 7px',
                      boxShadow: '0 6px 14px rgba(20,20,45,0.2)', overflow: 'hidden',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{b.course.code}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.92)', marginTop: 2, lineHeight: 1.2 }}>
                      {b.room}
                    </div>
                    {b.course.professor && (
                      <div
                        style={{
                          fontSize: 8.5, color: 'rgba(255,255,255,0.8)',
                          position: 'absolute', bottom: 7, left: 7, right: 7,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}
                      >
                        {b.course.professor}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
