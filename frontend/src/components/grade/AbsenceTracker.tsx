import type { Course } from '../../models';
import { remainingAbsences } from '../../domain/rules';

/** Controle de faltas: barra até o limite de 25% com marca vermelha (SPEC §5.5). */
export function AbsenceTracker({ course }: { course: Course }) {
  const remaining = remainingAbsences(course);
  const pct = Math.min(100, (course.absences / course.absenceLimit) * 100);
  const over = remaining < 0;

  return (
    <div style={{ background: '#fff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(20,20,45,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: '#9a9aa4', fontWeight: 600 }}>Faltas registradas</div>
          <div style={{ fontSize: 13, color: '#16153a', fontWeight: 600, marginTop: 2 }}>
            {course.absences} aulas perdidas de {course.totalHours}h
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: over ? '#FF5A4D' : '#16153a' }}>
            {course.absences}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#9a9aa4' }}> / {course.absenceLimit}</span>
        </div>
      </div>

      <div style={{ height: 12, borderRadius: 8, background: '#f0f0f3', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
            background: over
              ? 'linear-gradient(90deg,#FF8A3D,#FF5A4D)'
              : 'linear-gradient(90deg,#FFC524,#FF8A3D)',
            borderRadius: 8, transition: 'width .4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute', left: '100%', top: -3, bottom: -3, width: 2,
            background: '#FF5A4D', transform: 'translateX(-2px)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: '#9a9aa4', fontWeight: 600 }}>0 faltas</span>
        <span style={{ fontSize: 11, color: '#FF5A4D', fontWeight: 700 }}>
          Limite 25% · {course.absenceLimit} faltas
        </span>
      </div>

      <div
        style={{
          marginTop: 12,
          background: over ? '#FFEDEC' : '#FFF4E8',
          borderRadius: 14, padding: '10px 12px',
          fontSize: 12, color: over ? '#B3261E' : '#A85A12', fontWeight: 600, lineHeight: 1.35,
        }}
      >
        {over ? (
          <>Limite de faltas ultrapassado — reprovação por frequência.</>
        ) : (
          <>
            Restam <b>{remaining} {remaining === 1 ? 'falta' : 'faltas'}</b> antes de reprovar por frequência.
          </>
        )}
      </div>
    </div>
  );
}
