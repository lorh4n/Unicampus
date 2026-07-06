// Implementação HTTP — usada quando VITE_API_URL está definida.
// Endpoints combinados com o backend (ajustar aqui se o backend mudar caminhos).
import type {
  AdminCourse,
  AdminOverview,
  AdminStudent,
  AppNotification,
  AuthSession,
  Course,
  Curriculum,
  OfferedCourse,
  Professor,
  SearchResult,
  Stats,
  Student,
  Turma,
} from '../../models';
import { http, setToken } from '../http/httpClient';
import type { Repositories } from './types';

export const httpRepositories: Repositories = {
  auth: {
    async login(ra, password) {
      const session = await http.post<AuthSession>('/auth/login', { ra, password });
      setToken(session.token);
      return session;
    },
    async signup(payload) {
      const session = await http.post<AuthSession>('/auth/signup', payload);
      setToken(session.token);
      return session;
    },
    requestPasswordReset: (ra) => http.post<void>('/auth/password-reset', { ra }),
    async logout() {
      setToken(null);
    },
  },

  student: {
    getMe: () => http.get<Student>('/me'),
    updateMe: (changes) => http.put<Student>('/me', changes),
  },

  courses: {
    list: () => http.get<Course[]>('/courses?mine=true'),
    get: (id) => http.get<Course>(`/courses/${id}`),
    create: (payload) => http.post<Course>('/courses', payload),
    update: (id, payload) => http.put<Course>(`/courses/${id}`, payload),
    remove: (id) => http.delete<void>(`/courses/${id}`),
  },

  enrollment: {
    getOfferings: () => http.get<OfferedCourse[]>('/offerings?semester=2026.1'),
    enroll: (codes) => http.post<Course[]>('/enrollments', { codes }),
  },

  schedule: {
    getWeek: () => http.get<Course[]>('/schedule'),
  },

  curriculum: {
    get: () => http.get<Curriculum>('/curriculum'),
  },

  stats: {
    get: () => http.get<Stats>('/stats'),
  },

  notifications: {
    list: () => http.get<AppNotification[]>('/notifications'),
    toggleRead: (id) => http.post<void>(`/notifications/${id}/read`),
    markAllRead: () => http.post<void>('/notifications/read-all'),
  },

  search: {
    query: (q, tab) => http.get<SearchResult[]>(`/search?q=${encodeURIComponent(q)}&tab=${tab}`),
  },

  admin: {
    getOverview: () => http.get<AdminOverview>('/admin/overview'),
    listCourses: () => http.get<AdminCourse[]>('/admin/courses'),
    createCourse: (payload) => http.post<AdminCourse>('/admin/courses', payload),
    updateCourse: (id, payload) => http.put<AdminCourse>(`/admin/courses/${id}`, payload),
    removeCourse: (id) => http.delete<void>(`/admin/courses/${id}`),

    listTurmas: () => http.get<Turma[]>('/admin/turmas'),
    createTurma: (payload) => http.post<Turma>('/admin/turmas', payload),
    updateTurma: (id, payload) => http.put<Turma>(`/admin/turmas/${id}`, payload),
    removeTurma: (id) => http.delete<void>(`/admin/turmas/${id}`),

    listStudents: () => http.get<AdminStudent[]>('/admin/students'),
  },

  professors: {
    list: () => http.get<Professor[]>('/professors'),
    get: (id) => http.get<Professor>(`/professors/${id}`),
    rate: (payload) => http.post<Professor>(`/professors/${payload.professorId}/rate`, payload),
  },

  professorPortal: {
    listMyTurmas: () => http.get<Turma[]>('/professor/turmas'),
    getTurma: (id) => http.get<Turma>(`/professor/turmas/${id}`),
    saveCriteria: (turmaId, payload) => http.put<Turma>(`/professor/turmas/${turmaId}/criteria`, payload),
    setGrade: (turmaId, rosterId, criterionId, grade) =>
      http.put<Turma>(`/professor/turmas/${turmaId}/roster/${rosterId}/grade`, { criterionId, grade }),
    addAbsence: (turmaId, rosterId) =>
      http.post<Turma>(`/professor/turmas/${turmaId}/roster/${rosterId}/absence`),
    getMyScore: () => http.get<Professor>('/professor/me/score'),
  },
};
