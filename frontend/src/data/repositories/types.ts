// Contratos do Model (camada de dados) — MVVM.
// Os ViewModels dependem só destas interfaces; a escolha mock/HTTP fica em index.ts.
import type {
  AdminCourse,
  AdminCoursePayload,
  AdminOverview,
  AdminStudent,
  AppNotification,
  AuthSession,
  Course,
  CoursePayload,
  Curriculum,
  OfferedCourse,
  Professor,
  ProfessorRatingPayload,
  SearchResult,
  SearchTab,
  Stats,
  Student,
  Turma,
  TurmaCriteriaPayload,
  TurmaPayload,
  UserRole,
} from '../../models';

export interface SignupPayload {
  name: string;
  ra: string;
  course: string;
  enrolledCodes: string[];
}

export interface LoginOptions {
  /** Só no MODO DEV: papel simulado. Em produção quem decide o papel é o backend. */
  devRole?: UserRole;
}

export interface AuthRepository {
  login(ra: string, password: string, options?: LoginOptions): Promise<AuthSession>;
  signup(payload: SignupPayload): Promise<AuthSession>;
  requestPasswordReset(ra: string): Promise<void>;
  logout(): Promise<void>;
}

export interface StudentRepository {
  getMe(): Promise<Student>;
  updateMe(changes: Partial<Pick<Student, 'name' | 'email'>>): Promise<Student>;
}

export interface CourseRepository {
  list(): Promise<Course[]>;
  get(id: string): Promise<Course>;
  create(payload: CoursePayload): Promise<Course>;
  update(id: string, payload: CoursePayload): Promise<Course>;
  remove(id: string): Promise<void>;
}

export interface EnrollmentRepository {
  getOfferings(): Promise<OfferedCourse[]>;
  enroll(codes: string[]): Promise<Course[]>;
}

export interface ScheduleRepository {
  getWeek(): Promise<Course[]>;
}

export interface CurriculumRepository {
  get(): Promise<Curriculum>;
}

export interface StatsRepository {
  get(): Promise<Stats>;
}

export interface NotificationRepository {
  list(): Promise<AppNotification[]>;
  toggleRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
}

export interface SearchRepository {
  query(q: string, tab: SearchTab): Promise<SearchResult[]>;
}

/** Painel Admin (coordenação): catálogo de disciplinas + alocação de turmas + visão de alunos. */
export interface AdminRepository {
  getOverview(): Promise<AdminOverview>;
  listCourses(): Promise<AdminCourse[]>;
  createCourse(payload: AdminCoursePayload): Promise<AdminCourse>;
  updateCourse(id: string, payload: AdminCoursePayload): Promise<AdminCourse>;
  removeCourse(id: string): Promise<void>;

  listTurmas(): Promise<Turma[]>;
  createTurma(payload: TurmaPayload): Promise<Turma>;
  updateTurma(id: string, payload: TurmaPayload): Promise<Turma>;
  removeTurma(id: string): Promise<void>;

  listStudents(): Promise<AdminStudent[]>;
}

/** Catálogo de professores (perfil + score) — lido pelo Admin e pela Busca; avaliado pelo Aluno. */
export interface ProfessorRepository {
  list(): Promise<Professor[]>;
  get(id: string): Promise<Professor>;
  rate(payload: ProfessorRatingPayload): Promise<Professor>;
}

/** Dashboard do Professor: só as próprias turmas — PDD, roster, notas e faltas. */
export interface ProfessorPortalRepository {
  listMyTurmas(): Promise<Turma[]>;
  getTurma(id: string): Promise<Turma>;
  saveCriteria(turmaId: string, payload: TurmaCriteriaPayload): Promise<Turma>;
  setGrade(turmaId: string, rosterId: string, criterionId: string, grade: number | null): Promise<Turma>;
  addAbsence(turmaId: string, rosterId: string): Promise<Turma>;
  getMyScore(): Promise<Professor>;
}

export interface Repositories {
  admin: AdminRepository;
  auth: AuthRepository;
  student: StudentRepository;
  courses: CourseRepository;
  enrollment: EnrollmentRepository;
  schedule: ScheduleRepository;
  curriculum: CurriculumRepository;
  stats: StatsRepository;
  notifications: NotificationRepository;
  search: SearchRepository;
  professors: ProfessorRepository;
  professorPortal: ProfessorPortalRepository;
}
