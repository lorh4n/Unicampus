import type { CourseColor } from '../../models';
import { courseGradient, courseSolid } from '../../theme/tokens';

const ALL: CourseColor[] = ['laranja', 'azul', 'roxo', 'verde', 'rosa'];

/** 5 swatches de cor de identificação; selecionado ganha anel (tela CourseForm). */
export function ColorPicker({ value, onChange }: { value: CourseColor; onChange: (c: CourseColor) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {ALL.map((c) => (
        <button
          key={c}
          type="button"
          className="pressable"
          aria-label={`Cor ${c}`}
          aria-pressed={c === value}
          onClick={() => onChange(c)}
          style={{
            width: 34, height: 34, borderRadius: '50%', border: 'none', padding: 0,
            background: courseGradient(c),
            boxShadow: c === value ? `0 0 0 3px #fff, 0 0 0 5px ${courseSolid(c)}` : 'none',
          }}
        />
      ))}
    </div>
  );
}
