// ViewModel do formulário de disciplina (criar/editar).
import { useEffect, useState } from 'react';
import type { ClassSlot, CourseColor } from '../models';
import { useCourseQuery, useRemoveCourseMutation, useSaveCourseMutation } from './queries';

export interface CriterionDraft {
  label: string;
  weight: number;
}

export type SlotDraft = Omit<ClassSlot, 'id'>;

export const FORM_HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '19:00', '21:00'];

export function useCourseFormViewModel(id: string | undefined) {
  const existing = useCourseQuery(id);
  const save = useSaveCourseMutation(id);
  const remove = useRemoveCourseMutation();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(4);
  const [professor, setProfessor] = useState('');
  const [color, setColor] = useState<CourseColor>('verde');
  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [criteria, setCriteria] = useState<CriterionDraft[]>([
    { label: 'Prova P1', weight: 30 },
    { label: 'Prova P2', weight: 30 },
    { label: 'Trabalho final', weight: 40 },
  ]);
  const [touched, setTouched] = useState(false);

  // pré-preenche no modo edição
  useEffect(() => {
    const c = existing.data;
    if (id && c) {
      setCode(c.code);
      setName(c.name);
      setCredits(c.credits);
      setProfessor(c.professor ?? '');
      setColor(c.color);
      setSlots(c.slots.map(({ weekday, start, end, room }) => ({ weekday, start, end, room })));
      setCriteria(c.criteria.map((cr) => ({ label: cr.label, weight: cr.weight })));
    }
  }, [id, existing.data]);

  const weightSum = criteria.reduce((a, c) => a + (Number.isFinite(c.weight) ? c.weight : 0), 0);
  const sumOk = weightSum === 100;
  const isValid = code.trim().length > 0 && name.trim().length > 0 && slots.length > 0 && sumOk;

  const errors: string[] = [];
  if (!code.trim()) errors.push('Informe o código.');
  if (!name.trim()) errors.push('Informe o nome.');
  if (slots.length === 0) errors.push('Adicione pelo menos um horário.');
  if (!sumOk) errors.push('Os pesos precisam somar 100%.');

  const submit = async (): Promise<boolean> => {
    setTouched(true);
    if (!isValid) return false;
    await save.mutateAsync({
      code: code.trim(),
      name: name.trim(),
      credits,
      color,
      professor: professor.trim() || undefined,
      criteria: criteria.map((c) => ({ label: c.label, weight: c.weight })),
      slots,
    });
    return true;
  };

  return {
    isEdit: !!id,
    fields: {
      code, setCode,
      name, setName,
      credits, setCredits,
      professor, setProfessor,
      color, setColor,
    },
    slots: {
      list: slots,
      add: (s: SlotDraft) => setSlots((list) => [...list, { ...s, room: s.room.trim() || '—' }]),
      removeAt: (i: number) => setSlots((list) => list.filter((_, j) => j !== i)),
    },
    criteria: {
      list: criteria,
      setLabel: (i: number, label: string) =>
        setCriteria((list) => list.map((x, j) => (j === i ? { ...x, label } : x))),
      setWeight: (i: number, weight: number) =>
        setCriteria((list) => list.map((x, j) => (j === i ? { ...x, weight } : x))),
      add: () => setCriteria((list) => [...list, { label: `Critério ${list.length + 1}`, weight: 0 }]),
      removeAt: (i: number) => setCriteria((list) => list.filter((_, j) => j !== i)),
      weightSum,
      sumOk,
    },
    validation: { isValid, errors, touched },
    submit,
    isSaving: save.isPending,
    removeCourse: async () => {
      if (id) await remove.mutateAsync(id);
    },
  };
}
