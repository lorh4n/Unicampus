// Implementação de MODO DEV: dados de exemplo persistidos em localStorage.
// Comportamento idêntico ao esperado do backend (CRUD real entre reloads).
import type {
  AdminCourse,
  AdminCoursePayload,
  AdminStudent,
  AppNotification,
  Course,
  CourseColor,
  CoursePayload,
  Professor,
  ProfessorRatingPayload,
  SearchResult,
  SearchTab,
  Student,
  Turma,
  TurmaCriteriaPayload,
  TurmaPayload,
} from '../../models';
import { setToken } from '../http/httpClient';
import {
  SEED_ADMIN,
  SEED_ADMIN_COURSES,
  SEED_ADMIN_OVERVIEW,
  SEED_ADMIN_STUDENTS,
  SEED_COURSES,
  SEED_CURRICULUM,
  SEED_NOTIFICATIONS,
  SEED_OFFERINGS,
  SEED_PROFESSOR_ACCOUNT,
  SEED_PROFESSORS,
  SEED_STATS,
  SEED_STUDENT,
  SEED_TURMAS,
} from '../mock/seed';
import { delay, loadCollection, saveCollection } from '../mock/store';
import type { Repositories } from './types';

const courses = {
  all: (): Course[] => loadCollection('courses', SEED_COURSES),
  save: (list: Course[]) => saveCollection('courses', list),
};

const notifications = {
  all: (): AppNotification[] => loadCollection('notifications', SEED_NOTIFICATIONS),
  save: (list: AppNotification[]) => saveCollection('notifications', list),
};

const student = {
  get: (): Student => loadCollection('student', SEED_STUDENT),
  save: (s: Student) => saveCollection('student', s),
};

/** Id de quem está logado agora (aluno/professor/admin) — para o portal do professor saber "minhas turmas". */
const currentUser = {
  get: (): string | null => loadCollection<string | null>('currentUserId', null),
  set: (id: string) => saveCollection('currentUserId', id),
};

const adminCourses = {
  all: (): AdminCourse[] => loadCollection('adminCourses', SEED_ADMIN_COURSES),
  save: (list: AdminCourse[]) => saveCollection('adminCourses', list),
};

const turmas = {
  all: (): Turma[] => loadCollection('turmas', SEED_TURMAS),
  save: (list: Turma[]) => saveCollection('turmas', list),
};

const professors = {
  all: (): Professor[] => loadCollection('professors', SEED_PROFESSORS),
  save: (list: Professor[]) => saveCollection('professors', list),
};

function adminCourseFromPayload(id: string, p: AdminCoursePayload, base?: AdminCourse): AdminCourse {
  return {
    id,
    code: p.code,
    name: p.name,
    area: p.area,
    credits: p.credits,
    color: p.color,
    classCount: base?.classCount ?? 0,
    studentCount: base?.studentCount ?? 0,
    status: base?.status ?? 'rascunho',
  };
}

function courseFromPayload(id: string, p: CoursePayload, base?: Course): Course {
  return {
    id,
    code: p.code,
    name: p.name,
    credits: p.credits,
    color: p.color,
    professor: p.professor,
    className: base?.className,
    status: base?.status ?? 'cursando',
    average: base?.average ?? null,
    attendance: base?.attendance ?? null,
    absences: base?.absences ?? 0,
    // limite de 25% da carga: créditos*15h de carga, aulas de 2h
    absenceLimit: base?.absenceLimit ?? Math.max(2, Math.round((p.credits * 15 * 0.25) / 2)),
    totalHours: base?.totalHours ?? p.credits * 15,
    criteria: p.criteria.map((c, i) => {
      const prev = base?.criteria.find((x) => x.label === c.label);
      return {
        id: prev?.id ?? `c${i + 1}-${Date.now()}`,
        label: c.label,
        weight: c.weight,
        grade: prev?.grade ?? null,
        date: prev?.date,
        done: prev?.done ?? false,
      };
    }),
    slots: p.slots.map((s, i) => ({ ...s, id: `s${i + 1}` })),
  };
}

function turmaFromPayload(id: string, p: TurmaPayload, base?: Turma): Turma {
  const course = adminCourses.all().find((c) => c.code === p.courseCode);
  const professor = professors.all().find((pr) => pr.id === p.professorId);
  return {
    id,
    courseCode: p.courseCode,
    courseName: course?.name ?? base?.courseName ?? p.courseCode,
    className: p.className,
    color: course?.color ?? base?.color ?? 'laranja',
    professorId: p.professorId,
    professorName: professor?.name ?? base?.professorName ?? '— a definir —',
    slots: p.slots.map((s, i) => ({ ...s, id: `s${i + 1}` })),
    totalHours: base?.totalHours ?? (course?.credits ?? 4) * 15,
    absenceLimit: base?.absenceLimit ?? Math.max(2, Math.round(((course?.credits ?? 4) * 15 * 0.25) / 2)),
    criteria: base?.criteria ?? [],
    roster: base?.roster ?? [],
    status: base?.status ?? 'rascunho',
  };
}

const CHIP_COLORS: CourseColor[] = ['laranja', 'azul', 'roxo', 'verde', 'rosa'];

function colorFor(code: string): CourseColor {
  const mine = courses.all().find((c) => c.code === code);
  if (mine) return mine.color;
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return CHIP_COLORS[h % CHIP_COLORS.length];
}

function search(q: string, tab: SearchTab): SearchResult[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  if (tab === 'disciplinas') {
    return SEED_CURRICULUM.courses
      .filter((c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
      .slice(0, 12)
      .map((c) => ({
        code: c.code,
        name: c.name,
        detail:
          `${c.credits} créditos` +
          (c.prerequisites.length && c.status === 'bloqueada'
            ? ` · pré: ${c.prerequisites.join(', ')}`
            : ''),
        status: c.status,
        color: c.status === 'bloqueada' ? null : colorFor(c.code),
      }));
  }
  if (tab === 'professores') {
    return professors
      .all()
      .filter((p) => p.name.toLowerCase().includes(term))
      .map((p) => {
        const turma = turmas.all().find((t) => t.professorId === p.id);
        return {
          code: turma?.courseCode ?? '',
          name: `Prof. ${p.name}`,
          detail: turma ? `${turma.courseCode} · ${turma.courseName}` : p.department,
          status: null,
          color: turma?.color ?? null,
          score: p.scores.overall,
          professorId: p.id,
        };
      });
  }
  const rooms = new Map<string, string[]>();
  for (const c of courses.all())
    for (const s of c.slots) {
      if (!s.room.toLowerCase().includes(term)) continue;
      rooms.set(s.room, [...(rooms.get(s.room) ?? []), c.code]);
    }
  return [...rooms.entries()].map(([room, codes]) => ({
    code: room.slice(0, 6),
    name: room,
    detail: [...new Set(codes)].join(' · '),
    status: null,
    color: null,
  }));
}

function findRosterTurma(turmaId: string, rosterId: string) {
  const t = turmas.all().find((x) => x.id === turmaId);
  if (!t) throw new Error('Turma não encontrada');
  const entry = t.roster.find((r) => r.id === rosterId);
  if (!entry) throw new Error('Aluno não encontrado na turma');
  return { t, entry };
}

export const mockRepositories: Repositories = {
  auth: {
    // No modo dev o papel vem do seletor da tela de login (options.devRole);
    // em produção é o backend que devolve o papel do usuário autenticado.
    async login(ra, _password, options) {
      setToken('dev-token');
      if (options?.devRole === 'admin') {
        currentUser.set(SEED_ADMIN.id);
        return delay({ token: 'dev-token', student: { ...SEED_ADMIN } });
      }
      if (options?.devRole === 'professor') {
        currentUser.set(SEED_PROFESSOR_ACCOUNT.id);
        return delay({ token: 'dev-token', student: { ...SEED_PROFESSOR_ACCOUNT } });
      }
      const s = { ...student.get(), ra };
      student.save(s);
      currentUser.set(s.id);
      return delay({ token: 'dev-token', student: s });
    },
    async signup(payload) {
      setToken('dev-token');
      const s: Student = { ...SEED_STUDENT, name: payload.name, ra: payload.ra };
      student.save(s);
      currentUser.set(s.id);
      return delay({ token: 'dev-token', student: s }, 500);
    },
    async requestPasswordReset() {
      return delay(undefined, 600);
    },
    async logout() {
      setToken(null);
    },
  },

  student: {
    getMe: () => delay(student.get()),
    updateMe(changes) {
      const updated = { ...student.get(), ...changes };
      student.save(updated);
      return delay(updated, 400);
    },
  },

  courses: {
    list: () => delay(courses.all()),
    get(id) {
      const found = courses.all().find((c) => c.id === id);
      return found ? delay(found) : Promise.reject(new Error('Disciplina não encontrada'));
    },
    create(payload) {
      const created = courseFromPayload(`c-${Date.now()}`, payload);
      courses.save([...courses.all(), created]);
      return delay(created, 500);
    },
    update(id, payload) {
      const base = courses.all().find((c) => c.id === id);
      const updated = courseFromPayload(id, payload, base);
      courses.save(courses.all().map((c) => (c.id === id ? updated : c)));
      return delay(updated, 500);
    },
    remove(id) {
      courses.save(courses.all().filter((c) => c.id !== id));
      return delay(undefined, 350);
    },
  },

  enrollment: {
    getOfferings: () => delay([...SEED_OFFERINGS]),
    enroll: () => delay(courses.all(), 400),
  },

  schedule: {
    getWeek: () => delay(courses.all()),
  },

  curriculum: {
    get: () => delay(SEED_CURRICULUM),
  },

  stats: {
    get: () => delay(SEED_STATS),
  },

  notifications: {
    list: () => delay(notifications.all(), 250),
    toggleRead(id) {
      notifications.save(
        notifications.all().map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
      );
      return delay(undefined, 60);
    },
    markAllRead() {
      notifications.save(notifications.all().map((n) => ({ ...n, read: true })));
      return delay(undefined, 60);
    },
  },

  search: {
    query: (q, tab) => delay(search(q, tab), 220),
  },

  admin: {
    getOverview: () => delay(SEED_ADMIN_OVERVIEW),
    listCourses: () => delay(adminCourses.all()),
    createCourse(payload) {
      const created = adminCourseFromPayload(`ac-${Date.now()}`, payload);
      adminCourses.save([created, ...adminCourses.all()]);
      return delay(created, 500);
    },
    updateCourse(id, payload) {
      const base = adminCourses.all().find((c) => c.id === id);
      const updated = adminCourseFromPayload(id, payload, base);
      adminCourses.save(adminCourses.all().map((c) => (c.id === id ? updated : c)));
      return delay(updated, 500);
    },
    removeCourse(id) {
      adminCourses.save(adminCourses.all().filter((c) => c.id !== id));
      return delay(undefined, 350);
    },

    listTurmas: () => delay(turmas.all()),
    createTurma(payload) {
      const created = turmaFromPayload(`turma-${Date.now()}`, payload);
      turmas.save([created, ...turmas.all()]);
      return delay(created, 500);
    },
    updateTurma(id, payload) {
      const base = turmas.all().find((t) => t.id === id);
      const updated = turmaFromPayload(id, payload, base);
      turmas.save(turmas.all().map((t) => (t.id === id ? updated : t)));
      return delay(updated, 500);
    },
    removeTurma(id) {
      turmas.save(turmas.all().filter((t) => t.id !== id));
      return delay(undefined, 350);
    },

    listStudents: () => delay(SEED_ADMIN_STUDENTS as AdminStudent[]),
  },

  professors: {
    list: () => delay(professors.all()),
    get(id) {
      const found = professors.all().find((p) => p.id === id);
      return found ? delay(found) : Promise.reject(new Error('Professor não encontrado'));
    },
    rate(payload: ProfessorRatingPayload) {
      const list = professors.all();
      const prof = list.find((p) => p.id === payload.professorId);
      if (!prof) return Promise.reject(new Error('Professor não encontrado'));
      const n = prof.scores.ratingsCount;
      const avg = (old: number, val: number) => (old * n + val) / (n + 1);
      const scores = {
        didactics: avg(prof.scores.didactics, payload.didactics),
        organization: avg(prof.scores.organization, payload.organization),
        accessibility: avg(prof.scores.accessibility, payload.accessibility),
        material: avg(prof.scores.material, payload.material),
        ratingsCount: n + 1,
        overall: 0,
      };
      scores.overall = (scores.didactics + scores.organization + scores.accessibility + scores.material) / 4;
      const updated = { ...prof, scores };
      professors.save(list.map((p) => (p.id === prof.id ? updated : p)));
      return delay(updated, 400);
    },
  },

  professorPortal: {
    listMyTurmas() {
      const me = currentUser.get();
      return delay(turmas.all().filter((t) => t.professorId === me));
    },
    getTurma(id) {
      const found = turmas.all().find((t) => t.id === id);
      return found ? delay(found) : Promise.reject(new Error('Turma não encontrada'));
    },
    saveCriteria(turmaId, payload: TurmaCriteriaPayload) {
      const list = turmas.all();
      const t = list.find((x) => x.id === turmaId);
      if (!t) return Promise.reject(new Error('Turma não encontrada'));
      const criteria = payload.criteria.map((c, i) => {
        const prev = t.criteria[i]?.label === c.label ? t.criteria[i] : undefined;
        return {
          id: prev?.id ?? `${c.label.toLowerCase().replace(/\s+/g, '-')}-${i}`,
          label: c.label,
          weight: c.weight,
          grade: prev?.grade ?? null,
          date: prev?.date,
          done: prev?.done ?? false,
        };
      });
      const updated: Turma = { ...t, criteria };
      turmas.save(list.map((x) => (x.id === turmaId ? updated : x)));
      return delay(updated, 400);
    },
    setGrade(turmaId, rosterId, criterionId, grade) {
      const { t } = findRosterTurma(turmaId, rosterId);
      const roster = t.roster.map((r) =>
        r.id === rosterId ? { ...r, grades: { ...r.grades, [criterionId]: grade } } : r,
      );
      const criteria = t.criteria.map((c) =>
        c.id === criterionId ? { ...c, grade, done: grade !== null } : c,
      );
      const updated: Turma = { ...t, roster, criteria };
      turmas.save(turmas.all().map((x) => (x.id === turmaId ? updated : x)));
      return delay(updated, 300);
    },
    addAbsence(turmaId, rosterId) {
      const { t } = findRosterTurma(turmaId, rosterId);
      const roster = t.roster.map((r) => (r.id === rosterId ? { ...r, absences: r.absences + 1 } : r));
      const updated: Turma = { ...t, roster };
      turmas.save(turmas.all().map((x) => (x.id === turmaId ? updated : x)));
      return delay(updated, 250);
    },
    getMyScore() {
      const me = currentUser.get();
      const found = professors.all().find((p) => p.id === me);
      return found ? delay(found) : Promise.reject(new Error('Professor não encontrado'));
    },
  },
};
