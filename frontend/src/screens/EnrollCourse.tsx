// Matrícula do aluno em turmas ofertadas. Professor, PDD e horários vêm prontos
// da turma; o aluno só escolhe a cor de identificação (BUSINESS_RULES.md §1).
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { ListSkeleton } from '../components/common/Skeleton';
import { EmptyState, ErrorState } from '../components/common/States';
import { BottomSheet } from '../components/common/BottomSheet';
import { ColorPicker } from '../components/course/ColorPicker';
import { useToast } from '../context/ToastContext';
import { courseGradient } from '../theme/tokens';
import { fmtSlot } from '../utils/format';
import type { CourseColor, Turma } from '../models';
import { useEnrollViewModel } from '../viewmodels/useEnrollViewModel';

export function EnrollCourse() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useEnrollViewModel();
  const [selected, setSelected] = useState<Turma | null>(null);
  const [color, setColor] = useState<CourseColor>('laranja');

  const open = (t: Turma) => {
    setSelected(t);
    setColor(t.color);
  };

  const confirm = async () => {
    if (!selected) return;
    await vm.enroll(selected.id, color);
    showToast('Matrícula realizada');
    setSelected(null);
    setTimeout(() => navigate('/app/inicio'), 600);
  };

  return (
    <div className="container-narrow">
      <PageHeader back title="Matricular-se" subtitle="Turmas ofertadas em 2026.1" />

      {vm.isLoading ? (
        <ListSkeleton rows={4} height={92} />
      ) : vm.isError ? (
        <ErrorState onRetry={vm.retry} />
      ) : vm.turmas.length === 0 ? (
        <EmptyState
          title="Você já está em todas as turmas ofertadas"
          subtitle="Não há novas turmas disponíveis para matrícula no momento."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {vm.turmas.map((t, i) => (
            <div
              key={t.id}
              className="pressable-row float-in"
              role="button"
              onClick={() => open(t)}
              style={{
                background: '#fff', borderRadius: 20, padding: 16, display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 4px 14px rgba(20,20,45,0.05)', animationDelay: `${i * 0.06}s`,
              }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: 16, background: courseGradient(t.color),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 'none',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{t.courseCode}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#16153a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.courseName}
                </div>
                <div style={{ fontSize: 12, color: '#8e8e98', fontWeight: 500, marginTop: 1 }}>
                  {t.className} · Prof. {t.professorName}
                </div>
                <div style={{ fontSize: 11.5, color: '#a8a8b2', fontWeight: 600, marginTop: 3 }}>
                  {t.slots.map((s) => fmtSlot(s.weekday, s.start, s.end)).join(' · ')}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12, fontWeight: 800, color: '#16A085', background: '#E6F7F2',
                  borderRadius: 20, padding: '6px 12px', flex: 'none',
                }}
              >
                Matricular
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet
        open={!!selected}
        title={selected ? `Matricular em ${selected.courseCode}` : ''}
        subtitle={selected ? `${selected.courseName} · ${selected.className}` : ''}
        confirmLabel={vm.enrolling ? 'Matriculando…' : 'Confirmar matrícula'}
        onCancel={() => setSelected(null)}
        onConfirm={confirm}
      >
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#74747e', marginBottom: 10, textAlign: 'center' }}>
            Escolha uma cor de identificação
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
