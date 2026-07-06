// Drawer lateral "Nova disciplina" do painel admin — só dados de catálogo
// (código, área, nome, créditos, cor). Turma/professor/horários ficam em
// Admin → Turmas; PDD é definido pelo professor (BUSINESS_RULES.md §4.3).
import type { AdminCourse } from '../models';
import { courseGradients, courseSolid } from '../theme/tokens';
import { useToast } from '../context/ToastContext';
import { IconCheck, IconClose } from '../components/icons';
import { useAdminCourseFormViewModel } from '../viewmodels/admin';

const CREDIT_OPTIONS = [2, 3, 4, 6];

const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 800, color: '#56565e', marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid #e4e4ea', borderRadius: 12, padding: '12px 13px',
  fontSize: 14, fontWeight: 700, color: '#16153a', outline: 'none',
};

export function AdminCourseDrawer({ course, onClose }: { course: AdminCourse | null; onClose: () => void }) {
  const { showToast } = useToast();
  const vm = useAdminCourseFormViewModel(course, onClose);

  const save = async () => {
    await vm.save();
    showToast(vm.isEdit ? 'Disciplina atualizada' : 'Disciplina criada com sucesso');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
      <div className="sheet-scrim" style={{ position: 'absolute' }} onClick={onClose} />
      <div className="admin-drawer">
        <div style={{ flex: 'none', padding: '24px 28px', borderBottom: '1px solid #eeeef2', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>
              {vm.isEdit ? `Editar ${course?.code}` : 'Nova disciplina'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#8e8e98', marginTop: 2 }}>
              {vm.isEdit ? 'Atualize a disciplina no catálogo 2026.1' : 'Cadastre uma disciplina no catálogo 2026.1'}
            </div>
          </div>
          <button
            className="pressable" aria-label="Fechar" onClick={onClose}
            style={{
              width: 38, height: 38, borderRadius: 11, border: 'none', background: '#f1f1f4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <IconClose size={13} />
          </button>
        </div>

        <div className="scrollarea" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={label}>Código</div>
              <input
                style={inputStyle} placeholder="MC322" value={vm.code}
                onChange={(e) => vm.setCode(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <div style={label}>Sigla / Área</div>
              <input
                style={inputStyle} placeholder="Computação" value={vm.area}
                onChange={(e) => vm.setArea(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div style={label}>Nome da disciplina</div>
            <input
              style={inputStyle} placeholder="Programação Orientada a Objetos" value={vm.name}
              onChange={(e) => vm.setName(e.target.value)}
            />
          </div>

          <div>
            <div style={{ ...label, marginBottom: 9 }}>Créditos</div>
            <div style={{ display: 'flex', gap: 9 }}>
              {CREDIT_OPTIONS.map((n) => {
                const sel = vm.credits === n;
                return (
                  <button
                    key={n}
                    className="pressable"
                    onClick={() => vm.setCredits(n)}
                    style={{
                      flex: 1, borderRadius: 12, padding: 11, fontSize: 15, fontWeight: 800,
                      border: `1.5px solid ${sel ? '#16153a' : '#e4e4ea'}`,
                      background: sel ? '#16153a' : '#fff',
                      color: sel ? '#fff' : '#56565e',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ ...label, marginBottom: 9 }}>Cor de identificação</div>
            <div style={{ display: 'flex', gap: 11 }}>
              {(Object.keys(courseGradients) as Array<keyof typeof courseGradients>).map((k) => {
                const [a, b] = courseGradients[k];
                const sel = vm.color === k;
                return (
                  <button
                    key={k}
                    className="pressable"
                    aria-label={`Cor ${k}`}
                    onClick={() => vm.setColor(k)}
                    style={{
                      width: 44, height: 44, borderRadius: 13, border: 'none',
                      background: `linear-gradient(150deg, ${a}, ${b})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: sel ? `0 0 0 3px #fff, 0 0 0 5px ${courseSolid(k)}` : 'none',
                    }}
                  >
                    {sel && <IconCheck size={15} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: '#f8f8fa', borderRadius: 14, padding: 14, fontSize: 12.5,
              color: '#74747e', fontWeight: 500, lineHeight: 1.5,
            }}
          >
            Turma (professor, horários e sala) e o PDD (critérios de avaliação) são
            definidos depois em <b>Turmas</b> — o professor aloca-se e monta os próprios
            critérios de avaliação.
          </div>
        </div>

        <div style={{ flex: 'none', padding: '18px 28px', borderTop: '1px solid #eeeef2', display: 'flex', gap: 12 }}>
          {vm.isEdit && (
            <button
              className="pressable"
              onClick={async () => {
                await vm.removeCourse();
                showToast('Disciplina removida do catálogo');
              }}
              disabled={vm.removing}
              style={{
                border: '1.5px solid #FFD3CF', background: '#fff', borderRadius: 14, padding: '14px 16px',
                fontSize: 14.5, fontWeight: 800, color: '#FF5A4D',
              }}
            >
              Excluir
            </button>
          )}
          <button
            className="pressable"
            onClick={onClose}
            style={{ flex: 1, border: '1.5px solid #d8d8e0', background: '#fff', borderRadius: 14, padding: 14, fontSize: 14.5, fontWeight: 800, color: '#16153a' }}
          >
            Cancelar
          </button>
          <button
            className="pressable"
            onClick={save}
            disabled={!vm.isValid || vm.saving}
            style={{
              flex: 1.6, border: 'none', borderRadius: 14, padding: 14,
              fontSize: 14.5, fontWeight: 800,
              background: vm.isValid ? '#FFC524' : '#ececef',
              color: vm.isValid ? '#16153a' : '#b6b6be',
              boxShadow: vm.isValid ? '0 8px 20px rgba(255,197,36,0.4)' : 'none',
            }}
          >
            {vm.saving ? 'Salvando…' : 'Salvar disciplina'}
          </button>
        </div>
      </div>
    </div>
  );
}
