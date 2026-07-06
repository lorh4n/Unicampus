import type { Course } from '../../models';
import { courseGradient } from '../../theme/tokens';
import { fmtGrade, fmtPercent } from '../../utils/format';
import { PASSING_GRADE } from '../../domain/rules';

/** Card-capa da disciplina (~152×208): número marca d'água, média e presença. */
export function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const watermark = course.code.replace(/\D/g, '') || course.code;
  const lowGrade = course.average !== null && course.average < PASSING_GRADE;
  const lowAttendance = course.attendance !== null && course.attendance < 80;
  return (
    <div
      className="pressable"
      role="button"
      aria-label={`${course.code} — ${course.name}`}
      onClick={onClick}
      style={{
        width: '100%', height: 208, borderRadius: 22,
        background: courseGradient(course.color, 165),
        padding: 16, display: 'flex', flexDirection: 'column',
        boxShadow: `0 12px 26px rgba(20,20,45,0.22)`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', right: -22, top: -10, fontSize: 120, fontWeight: 800,
          color: 'rgba(255,255,255,0.14)', lineHeight: 1, pointerEvents: 'none',
        }}
      >
        {watermark}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', zIndex: 1 }}>
        {course.code}
      </div>
      <div
        style={{
          fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)',
          marginTop: 4, lineHeight: 1.25, zIndex: 1,
        }}
      >
        {course.name}
      </div>
      <div
        style={{
          marginTop: 'auto', background: 'rgba(255,255,255,0.18)', borderRadius: 14,
          padding: '9px 11px', display: 'flex', justifyContent: 'space-between', zIndex: 1,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>MÉDIA</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: lowGrade ? '#FFD9D5' : '#fff' }}>
            {fmtGrade(course.average)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>PRESENÇA</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: lowAttendance ? '#FFD9D5' : '#fff' }}>
            {fmtPercent(course.attendance)}
          </div>
        </div>
      </div>
    </div>
  );
}
