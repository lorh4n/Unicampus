// Drawer "Nova turma" — Admin aloca disciplina/professor/horário/sala.
// PDD fica de fora: o professor define os critérios depois (BUSINESS_RULES.md §4.3).
import { useState } from 'react';
import type { Turma } from '../models';
import { fmtSlot, WEEKDAYS_SHORT } from '../utils/format';
import { useToast } from '../context/ToastContext';
import { IconClose } from '../components/icons';
import { useAdminTurmaFormViewModel, type AdminSlotDraft } from '../viewmodels/adminTurmas';

const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '19:00', '21:00'];
const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 800, color: '#56565e', marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: '100%', border: '1.5px solid #e4e4ea', borderRadius: 12, padding: '12px 13px',
  fontSize: 14, fontWeight: 700, color: '#16153a', outline: 'none',
};

export function AdminTurmaDrawer({ turma, onClose }: { turma: Turma | null; onClose: () => void }) {
  const { showToast } = useToast();
  const vm = useAdminTurmaFormViewModel(turma, onClose);
  const [showSlotEditor, setShowSlotEditor] = useState(false);
  const [slotDraft, setSlotDraft] = useState<AdminSlotDraft>({ weekday: 1, start: '14:00', end: '16:00', room: '' });

  const save = async () => {
    await vm.save();
    showToast(vm.isEdit ? 'Turma atualizada' : 'Turma criada — o professor já pode montar o PDD');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90 }}>
      <div className="sheet-scrim" style={{ position: 'absolute' }} onClick={onClose} />
      <div className="admin-drawer">
        <div style={{ flex: 'none', padding: '24px 28px', borderBottom: '1px solid #eeeef2', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>
              {vm.isEdit ? `Editar ${turma?.className}` : 'Nova turma'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#8e8e98', marginTop: 2 }}>
              Aloca disciplina, professor, horário e sala
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
            <div style={label}>Disciplina</div>
            <select style={inputStyle} value={vm.courseCode} onChange={(e) => vm.setCourseCode(e.target.value)}>
              {vm.courses.map((c) => (
                <option key={c.id} value={c.code}>{c.code} · {c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14 }}>
            <div>
              <div style={label}>Turma</div>
              <input style={inputStyle} placeholder="Turma A" value={vm.className} onChange={(e) => vm.setClassName(e.target.value)} />
            </div>
            <div>
              <div style={label}>Professor</div>
              <select style={inputStyle} value={vm.professorId} onChange={(e) => vm.setProfessorId(e.target.value)}>
                {vm.professors.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ ...label, marginBottom: 9 }}>Horários</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {vm.slots.list.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, background: '#f1f1f4',
                    borderRadius: 11, padding: '9px 12px', fontSize: 12.5, fontWeight: 700, color: '#16153a',
                  }}
                >
                  {fmtSlot(s.weekday, s.start, s.end)} · {s.room || '—'}
                  <button
                    className="pressable" aria-label="Remover horário"
                    onClick={() => vm.slots.removeAt(i)}
                    style={{ border: 'none', background: 'transparent', padding: 0, display: 'flex' }}
                  >
                    <IconClose color="#9a9aa4" size={10} />
                  </button>
                </div>
              ))}
              <button
                className="pressable"
                onClick={() => setShowSlotEditor((v) => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: '#fff',
                  border: '1.5px dashed #d2d2da', borderRadius: 11, padding: '9px 12px',
                  fontSize: 12.5, fontWeight: 800, color: '#74747e',
                }}
              >
                + Adicionar
              </button>
            </div>
            {showSlotEditor && (
              <div className="float-in" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                <select
                  style={{ ...inputStyle, width: 84, padding: 10 }} aria-label="Dia"
                  value={slotDraft.weekday}
                  onChange={(e) => setSlotDraft((d) => ({ ...d, weekday: parseInt(e.target.value, 10) as AdminSlotDraft['weekday'] }))}
                >
                  {[1, 2, 3, 4, 5].map((wd) => <option key={wd} value={wd}>{WEEKDAYS_SHORT[wd]}</option>)}
                </select>
                <select
                  style={{ ...inputStyle, width: 90, padding: 10 }} aria-label="Início"
                  value={slotDraft.start}
                  onChange={(e) => setSlotDraft((d) => ({ ...d, start: e.target.value }))}
                >
                  {HOURS.slice(0, -1).map((h) => <option key={h}>{h}</option>)}
                </select>
                <select
                  style={{ ...inputStyle, width: 90, padding: 10 }} aria-label="Fim"
                  value={slotDraft.end}
                  onChange={(e) => setSlotDraft((d) => ({ ...d, end: e.target.value }))}
                >
                  {HOURS.slice(1).map((h) => <option key={h}>{h}</option>)}
                </select>
                <input
                  style={{ ...inputStyle, flex: 1, minWidth: 80, padding: 10 }} placeholder="Sala"
                  aria-label="Sala"
                  value={slotDraft.room}
                  onChange={(e) => setSlotDraft((d) => ({ ...d, room: e.target.value }))}
                />
                <button
                  className="pressable"
                  onClick={() => {
                    if (parseInt(slotDraft.end, 10) <= parseInt(slotDraft.start, 10)) return;
                    vm.slots.add({ ...slotDraft, room: slotDraft.room.trim() || '—' });
                    setShowSlotEditor(false);
                  }}
                  style={{ border: 'none', background: '#16153a', color: '#fff', fontWeight: 800, fontSize: 13, borderRadius: 12, padding: '10px 16px' }}
                >
                  OK
                </button>
              </div>
            )}
          </div>

          <div style={{ background: '#f8f8fa', borderRadius: 14, padding: 14, fontSize: 12.5, color: '#74747e', fontWeight: 500, lineHeight: 1.5 }}>
            O PDD (critérios de avaliação) desta turma é definido pelo próprio professor
            no dashboard dele, depois de alocado.
          </div>
        </div>

        <div style={{ flex: 'none', padding: '18px 28px', borderTop: '1px solid #eeeef2', display: 'flex', gap: 12 }}>
          {vm.isEdit && (
            <button
              className="pressable"
              onClick={async () => {
                await vm.removeTurma();
                showToast('Turma removida');
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
            {vm.saving ? 'Salvando…' : 'Salvar turma'}
          </button>
        </div>
      </div>
    </div>
  );
}
