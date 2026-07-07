// Modelos de dados — contrato com o backend (SPEC.md §3).

/**
 * Papel do usuário — decidido pelo BACKEND na autenticação.
 * O frontend só roteia: aluno → /app, professor → /professor, admin (coordenação) → /admin.
 * Ver BUSINESS_RULES.md para o que cada papel pode fazer.
 */
export type UserRole = 'aluno' | 'professor' | 'admin';

export interface Student {
  /** Papel retornado pelo backend no login/cadastro. */
  role: UserRole;
  /** Cargo exibido no painel admin (ex.: "Coordenação · IC"). */
  title?: string;
  id: string;
  name: string;          // "Marina Alves"
  ra: string;            // "247195"
  email?: string;        // "m247195@dac.unicamp.br"
  course: string;        // "Ciência da Computação"
  courseCode: string;    // "42"
  semester: string;      // "2026.1"
  cr: number;            // coeficiente de rendimento, ex 8.4
  crDelta: number;       // variação vs semestre anterior, ex +0.3
  cp: number;            // coeficiente de progressão, ex 0.81
  creditsCompleted: number; // 152
  creditsTotal: number;     // 188 (janela do CP)
}

export type CourseStatus = 'aprovada' | 'cursando' | 'disponivel' | 'bloqueada';
export type CourseColor = 'laranja' | 'azul' | 'roxo' | 'verde' | 'rosa';

export interface GradeCriterion {
  id: string;
  label: string;        // "Prova P1"
  weight: number;       // 0..100 (soma deve dar 100)
  grade: number | null; // nota lançada; null = a realizar
  date?: string;        // "02/04"
  done: boolean;        // realizada/parcial vs a realizar
}

export interface ClassSlot {
  id: string;
  weekday: 1 | 2 | 3 | 4 | 5; // Seg..Sex
  start: string;              // "14:00"
  end: string;                // "16:00"
  room: string;               // "CB02"
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  color: CourseColor;
  professor?: string;
  professorId?: string; // vínculo com o perfil do professor (para avaliar/consultar)
  className?: string;
  status: CourseStatus;
  average: number | null;
  attendance: number | null;
  /** Faltas oficiais lançadas pelo professor. */
  absences: number;
  /** Controle pessoal do aluno — enquanto o professor não lança no sistema (BUSINESS_RULES.md §4.2). */
  selfAbsences: number;
  absenceLimit: number;
  totalHours: number;
  criteria: GradeCriterion[];
  slots: ClassSlot[];
}

export interface CurriculumCourse {
  code: string;
  name: string;
  credits: number;
  semester: number; // 1..8
  status: CourseStatus;
  prerequisites: string[];
}

export interface Curriculum {
  courseName: string;
  courseCode: string;
  progressPercent: number;
  creditsCompleted: number;
  creditsTotal: number;
  forecastSemester: string;
  courses: CurriculumCourse[];
}

export interface OfferedCourse {
  code: string;
  name: string;
  credits: number;
}

export type NotificationKind = 'falta' | 'nota' | 'prazo' | 'sistema';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  group: 'Hoje' | 'Esta semana';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export interface SemesterStat {
  semester: string; // "24.1"
  cr: number;
}

export interface Stats {
  crHistory: SemesterStat[];
  avgAttendance: number;  // 87
  approvedCount: number;  // 24
}

export interface SearchResult {
  code: string;
  name: string;
  detail: string;              // "6 créditos · Prof. Ramos"
  status: CourseStatus | null; // null p/ professores/salas
  color: CourseColor | null;
  score?: number;               // média geral do professor (aba Professores)
  professorId?: string;        // p/ navegar até a avaliação (aba Professores)
}

export type SearchTab = 'disciplinas' | 'professores' | 'salas';

export interface AuthSession {
  token: string;
  student: Student;
}

// ---------------------------------------------------------------------------
// Avaliação de professores (BUSINESS_RULES.md §4.4)
// Todo professor começa com nota 5,0 em cada critério; a nota final é a média
// incremental de todas as avaliações recebidas de alunos que cursam a disciplina.
// ---------------------------------------------------------------------------

export interface ProfessorScore {
  didactics: number;      // 0.0 – 5.0
  organization: number;   // 0.0 – 5.0
  accessibility: number;  // 0.0 – 5.0
  material: number;       // 0.0 – 5.0
  overall: number;        // média dos 4 acima
  ratingsCount: number;   // quantas avaliações recebidas
}

/** Uma turma que o professor lecionou/leciona — usado no histórico do perfil. */
export interface ProfessorTeaching {
  semester: string;    // "2026.1"
  courseCode: string;  // "MC322"
  courseName: string;
  className: string;   // "Turma A"
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  scores: ProfessorScore;
  /** Semestres anteriores lecionados (o semestre atual é derivado das turmas ativas). */
  history: ProfessorTeaching[];
}

/** Perfil público consultável (busca → clique): professor + o que leciona por semestre. */
export interface ProfessorProfile {
  professor: Professor;
  current: ProfessorTeaching[]; // semestre corrente (derivado das turmas ativas dele)
  pastBySemester: Array<{ semester: string; items: ProfessorTeaching[] }>;
}

/** Admin cria/edita o cadastro de um professor (é o "pai de tudo"). */
export interface ProfessorPayload {
  name: string;
  email: string;
  department: string;
}

export interface ProfessorRatingPayload {
  professorId: string;
  didactics: number;
  organization: number;
  accessibility: number;
  material: number;
}

// ---------------------------------------------------------------------------
// Painel Admin (coordenação) — catálogo global e alocação (BUSINESS_RULES.md §3)
// ---------------------------------------------------------------------------

export type AdminCourseStatus = 'ativa' | 'rascunho';

/** Disciplina do catálogo — só dados de catálogo; turma/professor/PDD são entidades à parte. */
export interface AdminCourse {
  id: string;
  code: string;
  name: string;
  area: string;          // "Computação"
  credits: number;
  color: CourseColor;
  classCount: number;    // nº de turmas ofertadas (derivado)
  studentCount: number;  // alunos matriculados somando as turmas (derivado)
  status: AdminCourseStatus;
}

export interface AdminCoursePayload {
  code: string;
  area: string;
  name: string;
  credits: number;
  color: CourseColor;
}

export interface AdminStudent {
  id: string;
  name: string;
  ra: string;
  course: string;
  semester: string;
  cr: number;
  cp: number;
}

// ---------------------------------------------------------------------------
// Turma — oferecimento de uma disciplina num semestre.
// Admin aloca professor/horário/sala; o PROFESSOR define o PDD (critérios) e
// lança notas/faltas dos alunos da própria turma (BUSINESS_RULES.md §2, §4.2, §4.3).
// ---------------------------------------------------------------------------

/** Aluno matriculado numa turma, do ponto de vista do professor que a leciona. */
export interface RosterEntry {
  id: string;
  studentName: string;
  studentRA: string;
  grades: Record<string, number | null>; // criterionId -> nota lançada pelo professor
  absences: number;
}

export interface Turma {
  id: string;
  courseCode: string;
  courseName: string;
  className: string;   // "Turma A"
  color: CourseColor;
  professorId: string;
  professorName: string;
  slots: ClassSlot[];
  totalHours: number;
  absenceLimit: number;
  criteria: GradeCriterion[]; // PDD — definido e editado pelo professor
  roster: RosterEntry[];      // alunos matriculados (dados de demonstração)
  status: AdminCourseStatus;
}

/** Usado pelo Admin ao criar/editar a alocação da turma — sem PDD. */
export interface TurmaPayload {
  courseCode: string;
  className: string;
  professorId: string;
  slots: Array<Omit<ClassSlot, 'id'>>;
}

/** Usado pelo Professor para definir/editar o PDD da própria turma. */
export interface TurmaCriteriaPayload {
  criteria: Array<Pick<GradeCriterion, 'label' | 'weight'>>;
}

export interface AdminStatCard {
  label: string;   // "Disciplinas ativas"
  value: string;   // "42"
  delta: string;   // "+4"
  kind: 'disciplinas' | 'turmas' | 'alunos' | 'professores';
}

export interface EnrollmentPeriod {
  period: string;  // "24.1"
  label: string;   // "2.9k"
  value: number;   // 2900
}

export interface AdminActivity {
  id: string;
  kind: 'criacao' | 'alocacao' | 'matricula' | 'criterios';
  text: string;
  time: string;
}

export interface AdminOverview {
  cards: AdminStatCard[];
  enrollmentChart: EnrollmentPeriod[];
  activity: AdminActivity[];
}
