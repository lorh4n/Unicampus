// Detalhe da turma do professor: define o PDD e lança notas/faltas dos alunos
// matriculados (BUSINESS_RULES.md §2, §4.2, §4.3).
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/States';
import { IconBack, IconClose, IconPlus, IconWarn } from '../components/icons';
import { useToast } from '../context/ToastContext';
import { fmtGrade, fmtSlot } from '../utils/format';
import { criterionAverage, useTurmaDetailViewModel } from '../viewmodels/professor';
import { PASSING_GRADE } from '../domain/rules';

const inputStyle: React.CSSProperties = {
  border: '1.5px solid #e4e4ea', borderRadius: 10, padding: '7px 9px',
  fontSize: 13.5, fontWeight: 800, color: '#16153a', outline: 'none', width: 56, textAlign: 'center',
};

export function ProfessorClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const vm = useTurmaDetailViewModel(id);
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, string>>({});

  if (vm.isLoading) return <ListSkeleton rows={3} height={90} />;
  if (vm.isError || !vm.turma) {
    return (
      <div className="container-narrow">
        <ErrorState onRetry={vm.retry} />
      </div>
    );
  }

  const t = vm.turma;
  const ce = vm.criteriaEditor;

  const draftKey = (rosterId: string, criterionId: string) => `${rosterId}:${criterionId}`;

  const commitGrade = async (rosterId: string, criterionId: string) => {
    const key = draftKey(rosterId, criterionId);
    const raw = gradeDrafts[key];
    if (raw === undefined) return;
    const trimmed = raw.trim().replace(',', '.');
    const grade = trimmed === '' ? null : Math.max(0, Math.min(10, parseFloat(trimmed)));
    await vm.setGrade(rosterId, criterionId, Number.isNaN(grade) ? null : grade);
    setGradeDrafts((d) => {
      const { [key]: _omit, ...rest } = d;
      return rest;
    });
    showToast('Nota lançada');
  };

  return (
    <div>
      <button
        className="pressable"
        onClick={() => navigate('/professor')}
        style={{
          border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, fontWeight: 700, color: '#56565e', padding: 0, marginBottom: 18,
        }}
      >
        <IconBack size={15} /> Voltar para minhas turmas
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em' }}>
          {t.courseCode} · {t.className}
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#8e8e98', fontWeight: 500, marginBottom: 20 }}>
        {t.courseName} — {t.slots.map((s) => fmtSlot(s.weekday, s.start, s.end)).join(' · ')}
      </div>

      {/* PDD */}
      <div className="admin-card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800 }}>Critérios de avaliação (PDD)</div>
          {!ce.isEditing ? (
            <button
              className="pressable"
              onClick={ce.startEditing}
              style={{ border: 'none', background: '#f1f1f4', borderRadius: 10, padding: '7px 14px', fontSize: 12.5, fontWeight: 800, color: '#16153a' }}
            >
              Editar
            </button>
          ) : (
            <span
              style={{
                fontSize: 11.5, fontWeight: 800, borderRadius: 9, padding: '4px 10px',
                color: ce.sumOk ? '#16A085' : '#d9883a',
                background: ce.sumOk ? '#E6F7F2' : '#FBF1E2',
              }}
            >
              {ce.sumOk ? 'Soma 100% ✓' : `Soma ${ce.weightSum}%`}
            </span>
          )}
        </div>

        {!ce.isEditing ? (
          t.criteria.length === 0 ? (
            <div style={{ fontSize: 13, color: '#9a9aa4', fontWeight: 500 }}>
              Você ainda não definiu os critérios desta turma.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {t.criteria.map((c) => (
                <div key={c.id} style={{ background: '#f8f8fa', borderRadius: 12, padding: '9px 13px', fontSize: 13, fontWeight: 700, color: '#16153a' }}>
                  {c.label} <span style={{ color: '#9a9aa4', fontWeight: 800 }}>· {c.weight}%</span>
                </div>
              ))}
            </div>
          )
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {ce.draft.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f8f8fa', borderRadius: 12, padding: '9px 11px' }}>
                  <input
                    value={c.label}
                    aria-label={`Critério ${i + 1}`}
                    onChange={(e) => ce.setLabel(i, e.target.value)}
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, fontWeight: 700, color: '#16153a', minWidth: 0 }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', border: '1.5px solid #e4e4ea', borderRadius: 9, padding: '6px 9px' }}>
                    <input
                      value={Number.isFinite(c.weight) ? c.weight : ''}
                      inputMode="numeric"
                      aria-label={`Peso do critério ${i + 1}`}
                      onChange={(e) => ce.setWeight(i, Math.min(100, parseInt(e.target.value.replace(/\D/g, '') || '0', 10)))}
                      style={{ width: 34, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5, fontWeight: 800, color: '#16153a', textAlign: 'right' }}
                    />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#9a9aa4' }}>%</span>
                  </div>
                  <button
                    className="pressable" aria-label="Remover critério"
                    onClick={() => ce.removeAt(i)}
                    style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <IconClose color="#c4c4cc" size={11} />
                  </button>
                </div>
              ))}
              <button
                className="pressable"
                onClick={ce.add}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#fff',
                  border: '1.5px dashed #d2d2da', borderRadius: 12, padding: 11, fontSize: 13, fontWeight: 800, color: '#74747e',
                }}
              >
                <IconPlus size={13} color="#74747e" /> Adicionar critério
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="pressable"
                onClick={ce.cancel}
                style={{ flex: 1, border: '1.5px solid #d8d8e0', background: '#fff', borderRadius: 12, padding: 12, fontSize: 13.5, fontWeight: 800, color: '#16153a' }}
              >
                Cancelar
              </button>
              <button
                className="pressable"
                onClick={() => ce.save()}
                disabled={!ce.sumOk || ce.saving}
                style={{
                  flex: 1.5, border: 'none', borderRadius: 12, padding: 12, fontSize: 13.5, fontWeight: 800,
                  background: ce.sumOk ? '#16153a' : '#ececef', color: ce.sumOk ? '#fff' : '#b6b6be',
                }}
              >
                {ce.saving ? 'Salvando…' : 'Salvar critérios'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* roster */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px 4px', fontSize: 15.5, fontWeight: 800 }}>
          Alunos matriculados ({t.roster.length})
        </div>
        <div className="admin-table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={thStyle}>ALUNO</th>
                {t.criteria.map((c) => (
                  <th key={c.id} style={thStyle}>{c.label} ({c.weight}%)</th>
                ))}
                <th style={thStyle}>MÉDIA</th>
                <th style={thStyle}>FALTAS</th>
              </tr>
            </thead>
            <tbody>
              {t.roster.map((r) => {
                const avg = criterionAverage(t.criteria, r.grades);
                const over = r.absences > t.absenceLimit;
                return (
                  <tr key={r.id} style={{ borderTop: '1px solid #f4f4f7' }}>
                    <td style={{ ...tdStyle, minWidth: 160 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800 }}>{r.studentName}</div>
                      <div style={{ fontSize: 11.5, color: '#9a9aa4', fontWeight: 600 }}>RA {r.studentRA}</div>
                    </td>
                    {t.criteria.map((c) => {
                      const key = draftKey(r.id, c.id);
                      const value = gradeDrafts[key] ?? (r.grades[c.id] === null || r.grades[c.id] === undefined ? '' : String(r.grades[c.id]));
                      return (
                        <td key={c.id} style={tdStyle}>
                          <input
                            style={inputStyle}
                            value={value}
                            inputMode="decimal"
                            aria-label={`Nota de ${r.studentName} em ${c.label}`}
                            placeholder="—"
                            onChange={(e) => setGradeDrafts((d) => ({ ...d, [key]: e.target.value }))}
                            onBlur={() => commitGrade(r.id, c.id)}
                          />
                        </td>
                      );
                    })}
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: 13.5, fontWeight: 800,
                          color: avg !== null && avg < PASSING_GRADE ? '#FF5A4D' : '#16153a',
                        }}
                      >
                        {fmtGrade(avg)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: over ? '#FF5A4D' : '#16153a' }}>
                          {r.absences}/{t.absenceLimit}
                        </span>
                        {over && <IconWarn color="#FF5A4D" size={14} />}
                        <button
                          className="pressable"
                          aria-label={`Registrar falta de ${r.studentName}`}
                          onClick={() => vm.addAbsence(r.id)}
                          disabled={vm.savingAbsence}
                          style={{
                            border: 'none', background: '#f1f1f4', borderRadius: 8, padding: '5px 9px',
                            fontSize: 11.5, fontWeight: 800, color: '#56565e',
                          }}
                        >
                          + falta
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#9a9aa4', letterSpacing: '0.04em',
  padding: '10px 16px', background: '#fafafb', borderBottom: '1px solid #eeeef2', whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = { padding: '10px 16px', verticalAlign: 'middle' };
