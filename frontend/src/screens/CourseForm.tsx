import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { BottomSheet } from '../components/common/BottomSheet';
import { ColorPicker } from '../components/course/ColorPicker';
import { IconClose, IconLogout } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { FORM_HOURS, useCourseFormViewModel, type SlotDraft } from '../viewmodels/useCourseFormViewModel';
import { fmtSlot, WEEKDAYS_SHORT } from '../utils/format';

export function CourseForm() {
  const { id } = useParams(); // presente = modo edição
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useCourseFormViewModel(id);

  const [showSlotEditor, setShowSlotEditor] = useState(false);
  const [slotDraft, setSlotDraft] = useState<SlotDraft>({ weekday: 2, start: '14:00', end: '16:00', room: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (await vm.submit()) {
      setSuccess(true);
      showToast(vm.isEdit ? 'Alterações salvas' : 'Disciplina adicionada');
      setTimeout(() => navigate(-1), 900);
    }
  };

  const addSlot = () => {
    if (parseInt(slotDraft.end, 10) <= parseInt(slotDraft.start, 10)) return;
    vm.slots.add(slotDraft);
    setShowSlotEditor(false);
  };

  return (
    <div className="container-narrow">
      <PageHeader
        back
        title={vm.isEdit ? 'Editar disciplina' : 'Nova disciplina'}
        right={
          vm.isEdit ? (
            <button
              className="pressable" aria-label="Remover disciplina"
              onClick={() => setConfirmDelete(true)}
              style={{ border: 'none', background: 'transparent', color: '#FF5A4D', fontSize: 13, fontWeight: 800 }}
            >
              Excluir
            </button>
          ) : undefined
        }
      />

      {/* código + créditos */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 130, flex: 'none' }}>
          <label className="field-label" htmlFor="cf-code" style={{ display: 'block' }}>Código</label>
          <input
            id="cf-code" className="input" value={vm.fields.code} placeholder="MC358" style={{ fontWeight: 700 }}
            onChange={(e) => vm.fields.setCode(e.target.value.toUpperCase())}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="field-label" htmlFor="cf-credits" style={{ display: 'block' }}>Créditos</label>
          <select
            id="cf-credits" className="input" value={vm.fields.credits} style={{ fontWeight: 700 }}
            onChange={(e) => vm.fields.setCredits(parseInt(e.target.value, 10))}
          >
            {[2, 4, 6, 8].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="field-label" htmlFor="cf-name" style={{ display: 'block' }}>Nome da disciplina</label>
        <input
          id="cf-name" className="input" value={vm.fields.name} placeholder="Projeto e Análise de Algoritmos"
          onChange={(e) => vm.fields.setName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label className="field-label" htmlFor="cf-prof" style={{ display: 'block' }}>Professor(a) — opcional</label>
        <input
          id="cf-prof" className="input" value={vm.fields.professor} placeholder="Nome do docente"
          onChange={(e) => vm.fields.setProfessor(e.target.value)}
        />
      </div>

      {/* cor */}
      <div style={{ marginBottom: 18 }}>
        <div className="field-label" style={{ marginBottom: 8 }}>Cor de identificação</div>
        <ColorPicker value={vm.fields.color} onChange={vm.fields.setColor} />
      </div>

      {/* horários */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="field-label" style={{ marginBottom: 0 }}>Horários</div>
        <span
          className="pressable-row" role="button"
          style={{ fontSize: 12, fontWeight: 700, color: '#16A085' }}
          onClick={() => setShowSlotEditor((v) => !v)}
        >
          + Adicionar
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: showSlotEditor ? 10 : 20 }}>
        {vm.slots.list.length === 0 && !showSlotEditor && (
          <span style={{ fontSize: 12.5, color: '#9a9aa4', fontWeight: 500 }}>
            Nenhum horário — adicione pelo menos um.
          </span>
        )}
        {vm.slots.list.map((s, i) => (
          <div
            key={i}
            style={{
              background: '#fff', border: '1.5px solid #e8e8ee', borderRadius: 14,
              padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: '#16153a' }}>
              {fmtSlot(s.weekday, s.start, s.end)}
            </span>
            <span style={{ fontSize: 12, color: '#9a9aa4' }}>· {s.room}</span>
            <button
              className="pressable" aria-label="Remover horário"
              onClick={() => vm.slots.removeAt(i)}
              style={{ border: 'none', background: 'transparent', padding: 0, display: 'flex' }}
            >
              <IconClose color="#9a9aa4" size={10} />
            </button>
          </div>
        ))}
      </div>

      {showSlotEditor && (
        <div
          className="float-in"
          style={{
            background: '#fff', borderRadius: 16, padding: 12, marginBottom: 20,
            boxShadow: '0 4px 14px rgba(20,20,45,0.05)', display: 'flex', flexWrap: 'wrap', gap: 8,
          }}
        >
          <select
            className="input" style={{ width: 90, padding: 10 }}
            aria-label="Dia da semana"
            value={slotDraft.weekday}
            onChange={(e) => setSlotDraft((d) => ({ ...d, weekday: parseInt(e.target.value, 10) as SlotDraft['weekday'] }))}
          >
            {[1, 2, 3, 4, 5].map((wd) => (
              <option key={wd} value={wd}>{WEEKDAYS_SHORT[wd]}</option>
            ))}
          </select>
          <select
            className="input" style={{ width: 92, padding: 10 }}
            aria-label="Início"
            value={slotDraft.start}
            onChange={(e) => setSlotDraft((d) => ({ ...d, start: e.target.value }))}
          >
            {FORM_HOURS.slice(0, -1).map((h) => <option key={h}>{h}</option>)}
          </select>
          <select
            className="input" style={{ width: 92, padding: 10 }}
            aria-label="Fim"
            value={slotDraft.end}
            onChange={(e) => setSlotDraft((d) => ({ ...d, end: e.target.value }))}
          >
            {FORM_HOURS.slice(1).map((h) => <option key={h}>{h}</option>)}
          </select>
          <input
            className="input" style={{ flex: 1, minWidth: 90, padding: 10 }} placeholder="Sala"
            aria-label="Sala"
            value={slotDraft.room}
            onChange={(e) => setSlotDraft((d) => ({ ...d, room: e.target.value }))}
          />
          <button
            className="pressable"
            onClick={addSlot}
            style={{
              border: 'none', background: '#16153a', color: '#fff', fontWeight: 700,
              fontSize: 13, borderRadius: 12, padding: '10px 16px',
            }}
          >
            OK
          </button>
        </div>
      )}

      {/* critérios */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#16153a' }}>Critérios de avaliação</div>
        <div
          style={{
            fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: vm.criteria.sumOk ? '#E6F7F2' : '#FFEDEC',
            color: vm.criteria.sumOk ? '#16A085' : '#FF5A4D',
          }}
        >
          Soma {vm.criteria.weightSum}%
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: '6px 16px', marginBottom: 12, boxShadow: '0 4px 14px rgba(20,20,45,0.05)' }}>
        {vm.criteria.list.map((c, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0',
              borderBottom: i < vm.criteria.list.length - 1 ? '1px solid #f0f0f3' : 'none',
            }}
          >
            <input
              value={c.label}
              aria-label={`Nome do critério ${i + 1}`}
              onChange={(e) => vm.criteria.setLabel(i, e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', fontSize: 14, fontWeight: 700,
                color: '#16153a', background: 'transparent', minWidth: 0,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f4f4f7', borderRadius: 10, padding: '7px 10px' }}>
              <input
                value={Number.isFinite(c.weight) ? c.weight : ''}
                inputMode="numeric"
                aria-label={`Peso do critério ${i + 1}`}
                onChange={(e) => vm.criteria.setWeight(i, parseInt(e.target.value || '0', 10))}
                style={{
                  width: 30, border: 'none', outline: 'none', fontSize: 14, fontWeight: 800,
                  color: '#16153a', background: 'transparent', textAlign: 'right',
                }}
              />
              <span style={{ fontSize: 12, color: '#9a9aa4', fontWeight: 700 }}>%</span>
            </div>
            {vm.criteria.list.length > 1 && (
              <button
                className="pressable" aria-label="Remover critério"
                onClick={() => vm.criteria.removeAt(i)}
                style={{ border: 'none', background: 'transparent', padding: 0, display: 'flex' }}
              >
                <IconClose color="#c4c4cc" size={11} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div
        className="pressable-row"
        role="button"
        onClick={vm.criteria.add}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 12,
          border: '1.5px dashed #cfcfd6', borderRadius: 16, marginBottom: 20,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15">
          <line x1="7.5" y1="2" x2="7.5" y2="13" stroke="#9a9aa4" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="7.5" x2="13" y2="7.5" stroke="#9a9aa4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#9a9aa4' }}>Adicionar critério</span>
      </div>

      {vm.validation.touched && !vm.validation.isValid && (
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#FF5A4D', marginBottom: 12, lineHeight: 1.4 }}>
          {vm.validation.errors.join(' ')}
        </div>
      )}

      <PrimaryButton
        onClick={submit}
        loading={vm.isSaving}
        success={success}
        disabled={vm.validation.touched && !vm.validation.isValid}
      >
        Salvar disciplina
      </PrimaryButton>

      <BottomSheet
        open={confirmDelete}
        icon={<IconLogout size={22} />}
        danger
        title="Remover disciplina?"
        subtitle={`${vm.fields.code} será removida das suas disciplinas e da grade.`}
        confirmLabel="Remover"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await vm.removeCourse();
          setConfirmDelete(false);
          showToast('Disciplina removida');
          navigate('/app/inicio');
        }}
      />
    </div>
  );
}
