// Drawer "Novo professor" / edição — só o Admin cadastra e gere professores.
// O score (avaliação) NÃO é editável aqui: vem dos alunos (BUSINESS_RULES.md §4.4).
import type { Professor } from '../models';
import { useToast } from '../context/ToastContext';
import { IconClose } from '../components/icons';
import { useAdminProfessorFormViewModel } from '../viewmodels/adminProfessores';

const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 800, color: '#56565e', marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid #e4e4ea', borderRadius: 12, padding: '12px 13px',
  fontSize: 14, fontWeight: 700, color: '#16153a', outline: 'none',
};

const DEPARTMENTS = [
  'Instituto de Computação',
  'Instituto de Matemática',
  'Instituto de Física',
  'Faculdade de Engenharia Elétrica',
  'Instituto de Estudos da Linguagem',
];

export function AdminProfessorDrawer({ professor, onClose }: { professor: Professor | null; onClose: () => void }) {
  const { showToast } = useToast();
  const vm = useAdminProfessorFormViewModel(professor, onClose);

  const save = async () => {
    await vm.save();
    showToast(vm.isEdit ? 'Professor atualizado' : 'Professor cadastrado');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
      <div className="sheet-scrim" style={{ position: 'absolute' }} onClick={onClose} />
      <div className="admin-drawer">
        <div style={{ flex: 'none', padding: '24px 28px', borderBottom: '1px solid #eeeef2', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>
              {vm.isEdit ? 'Editar professor' : 'Novo professor'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#8e8e98', marginTop: 2 }}>
              {vm.isEdit ? 'Atualize o cadastro do docente' : 'Cadastre um docente no sistema'}
            </div>
          </div>
          <button
            className="pressable" aria-label="Fechar" onClick={onClose}
            style={{ width: 38, height: 38, borderRadius: 11, border: 'none', background: '#f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconClose size={13} />
          </button>
        </div>

        <div className="scrollarea" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={label}>Nome completo</div>
            <input style={inputStyle} placeholder="Esther Colombini" value={vm.name} onChange={(e) => vm.setName(e.target.value)} />
          </div>
          <div>
            <div style={label}>E-mail institucional</div>
            <input style={inputStyle} type="email" placeholder="docente@unicamp.br" value={vm.email} onChange={(e) => vm.setEmail(e.target.value)} />
          </div>
          <div>
            <div style={label}>Departamento / Unidade</div>
            <input style={inputStyle} list="admin-departments" placeholder="Instituto de Computação" value={vm.department} onChange={(e) => vm.setDepartment(e.target.value)} />
            <datalist id="admin-departments">
              {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          {vm.isEdit && (
            <div style={{ background: '#f8f8fa', borderRadius: 14, padding: 14, fontSize: 12.5, color: '#74747e', fontWeight: 500, lineHeight: 1.5 }}>
              O score de avaliação é calculado a partir das notas dos alunos e não pode ser
              editado aqui.
            </div>
          )}
        </div>

        <div style={{ flex: 'none', padding: '18px 28px', borderTop: '1px solid #eeeef2', display: 'flex', gap: 12 }}>
          {vm.isEdit && (
            <button
              className="pressable"
              onClick={async () => {
                await vm.removeProfessor();
                showToast('Professor removido');
              }}
              disabled={vm.removing}
              style={{ border: '1.5px solid #FFD3CF', background: '#fff', borderRadius: 14, padding: '14px 16px', fontSize: 14.5, fontWeight: 800, color: '#FF5A4D' }}
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
              flex: 1.6, border: 'none', borderRadius: 14, padding: 14, fontSize: 14.5, fontWeight: 800,
              background: vm.isValid ? '#FFC524' : '#ececef',
              color: vm.isValid ? '#16153a' : '#b6b6be',
              boxShadow: vm.isValid ? '0 8px 20px rgba(255,197,36,0.4)' : 'none',
            }}
          >
            {vm.saving ? 'Salvando…' : 'Salvar professor'}
          </button>
        </div>
      </div>
    </div>
  );
}
