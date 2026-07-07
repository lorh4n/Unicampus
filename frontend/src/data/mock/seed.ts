// Dados de exemplo do modo dev (persona Marina Alves, vindos do protótipo).
// São a carga inicial do MockStore — depois disso os dados vivem no localStorage.
import type {
  AdminCourse,
  AdminOverview,
  AdminStudent,
  AppNotification,
  Course,
  Curriculum,
  CurriculumCourse,
  GradeCriterion,
  OfferedCourse,
  Professor,
  Stats,
  Student,
  Turma,
} from '../../models';

export const SEED_STUDENT: Student = {
  id: 'stu-1',
  role: 'aluno',
  name: 'Marina Alves',
  ra: '247195',
  email: 'm247195@dac.unicamp.br',
  course: 'Ciência da Computação',
  courseCode: '42',
  semester: '2026.1',
  cr: 8.4,
  crDelta: 0.3,
  cp: 0.81,
  creditsCompleted: 152,
  creditsTotal: 188,
};

export const SEED_COURSES: Course[] = [
  {
    id: 'mc322',
    code: 'MC322',
    name: 'Programação Orientada a Objetos',
    credits: 4,
    color: 'laranja',
    professor: 'Esther Colombini',
    professorId: 'prof-colombini',
    className: 'Turma A',
    status: 'cursando',
    average: 7.8,
    attendance: 92,
    absences: 5,
    selfAbsences: 5,
    absenceLimit: 8,
    totalHours: 60,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 30, grade: 8.5, date: '02/04', done: true },
      { id: 'c2', label: 'Prova P2', weight: 30, grade: null, date: '11/06', done: false },
      { id: 'c3', label: 'Trabalho final', weight: 40, grade: 7.2, date: '18/06', done: true },
    ],
    slots: [
      { id: 's1', weekday: 1, start: '08:00', end: '10:00', room: 'CB02' },
      { id: 's2', weekday: 3, start: '08:00', end: '10:00', room: 'CB02' },
      { id: 's3', weekday: 5, start: '08:00', end: '10:00', room: 'Lab LMC' },
    ],
  },
  {
    id: 'ma111',
    code: 'MA111',
    name: 'Cálculo I',
    credits: 6,
    color: 'azul',
    professor: 'Carlos Ramos',
    professorId: 'prof-ramos',
    className: 'Turma C',
    status: 'cursando',
    average: 4.6,
    attendance: 88,
    absences: 3,
    selfAbsences: 4,
    absenceLimit: 11,
    totalHours: 90,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 35, grade: 4.2, date: '08/04', done: true },
      { id: 'c2', label: 'Prova P2', weight: 35, grade: 5.0, date: '27/05', done: true },
      { id: 'c3', label: 'Prova P3', weight: 30, grade: null, date: '24/06', done: false },
    ],
    slots: [
      { id: 's1', weekday: 1, start: '14:00', end: '16:00', room: 'IM02' },
      { id: 's2', weekday: 4, start: '14:00', end: '16:00', room: 'IM02' },
    ],
  },
  {
    id: 'f128',
    code: 'F 128',
    name: 'Física Geral I',
    credits: 4,
    color: 'roxo',
    professor: 'Marina Lemos',
    professorId: 'prof-lemos',
    className: 'Turma B',
    status: 'cursando',
    average: 6.5,
    attendance: 75,
    absences: 6,
    selfAbsences: 6,
    absenceLimit: 8,
    totalHours: 60,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 40, grade: 6.0, date: '10/04', done: true },
      { id: 'c2', label: 'Prova P2', weight: 40, grade: null, date: '19/06', done: false },
      { id: 'c3', label: 'Laboratório', weight: 20, grade: 7.5, date: '12/06', done: true },
    ],
    slots: [
      { id: 's1', weekday: 2, start: '10:00', end: '12:00', room: 'IFGW' },
      { id: 's2', weekday: 3, start: '10:00', end: '12:00', room: 'Lab IFGW' },
    ],
  },
  {
    id: 'mc358',
    code: 'MC358',
    name: 'Projeto e Análise de Algoritmos',
    credits: 4,
    color: 'verde',
    professor: 'João Meidanis',
    professorId: 'prof-meidanis',
    className: 'Turma A',
    status: 'cursando',
    average: 8.2,
    attendance: 96,
    absences: 1,
    selfAbsences: 1,
    absenceLimit: 8,
    totalHours: 60,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 30, grade: 8.0, date: '04/04', done: true },
      { id: 'c2', label: 'Prova P2', weight: 30, grade: null, date: '13/06', done: false },
      { id: 'c3', label: 'Listas', weight: 40, grade: 8.4, date: '30/05', done: true },
    ],
    slots: [
      { id: 's1', weekday: 2, start: '19:00', end: '21:00', room: 'CB09' },
      { id: 's2', weekday: 4, start: '19:00', end: '21:00', room: 'CB09' },
    ],
  },
  {
    id: 'mc404',
    code: 'MC404',
    name: 'Organização Básica de Computadores',
    credits: 4,
    color: 'rosa',
    professor: 'Rodolfo Azevedo',
    professorId: 'prof-azevedo',
    className: 'Turma A',
    status: 'cursando',
    average: 7.0,
    attendance: 90,
    absences: 2,
    selfAbsences: 2,
    absenceLimit: 8,
    totalHours: 60,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 30, grade: 7.5, date: '09/04', done: true },
      { id: 'c2', label: 'Prova P2', weight: 30, grade: null, date: '16/06', done: false },
      { id: 'c3', label: 'Projeto', weight: 40, grade: 6.7, date: '02/06', done: true },
    ],
    slots: [
      { id: 's1', weekday: 3, start: '14:00', end: '16:00', room: 'CB06' },
      { id: 's2', weekday: 5, start: '14:00', end: '16:00', room: 'Lab LSC' },
    ],
  },
  {
    id: 'me323',
    code: 'ME323',
    name: 'Probabilidade e Estatística',
    credits: 6,
    color: 'laranja',
    professor: 'Núbia Santos',
    professorId: 'prof-santos',
    className: 'Turma B',
    status: 'cursando',
    average: null,
    attendance: 100,
    absences: 0,
    selfAbsences: 1,
    absenceLimit: 11,
    totalHours: 90,
    criteria: [
      { id: 'c1', label: 'Prova P1', weight: 30, grade: null, date: '15/04', done: false },
      { id: 'c2', label: 'Prova P2', weight: 30, grade: null, date: '20/05', done: false },
      { id: 'c3', label: 'Prova P3', weight: 40, grade: null, date: '26/06', done: false },
    ],
    slots: [
      { id: 's1', weekday: 2, start: '08:00', end: '10:00', room: 'PB Sala 3' },
      { id: 's2', weekday: 4, start: '08:00', end: '10:00', room: 'PB Sala 3' },
    ],
  },
];

export const SEED_OFFERINGS: OfferedCourse[] = [
  { code: 'MC322', name: 'Programação Orientada a Objetos', credits: 4 },
  { code: 'MC358', name: 'Projeto e Análise de Algoritmos', credits: 4 },
  { code: 'MC404', name: 'Org. Básica de Computadores', credits: 4 },
  { code: 'MA311', name: 'Cálculo III', credits: 4 },
  { code: 'ME323', name: 'Probabilidade e Estatística', credits: 6 },
  { code: 'MC536', name: 'Bancos de Dados', credits: 4 },
  { code: 'F 228', name: 'Física Geral II', credits: 4 },
  { code: 'LA122', name: 'Inglês Instrumental', credits: 2 },
];

const CC = (
  code: string,
  name: string,
  credits: number,
  semester: number,
  status: CurriculumCourse['status'],
  prerequisites: string[] = [],
): CurriculumCourse => ({ code, name, credits, semester, status, prerequisites });

export const SEED_CURRICULUM: Curriculum = {
  courseName: 'Ciência da Computação',
  courseCode: '42',
  progressPercent: 62,
  creditsCompleted: 148,
  creditsTotal: 240,
  forecastSemester: '2028.1',
  courses: [
    CC('MC102', 'Algoritmos e Prog. de Computadores', 6, 1, 'aprovada'),
    CC('MA111', 'Cálculo I', 6, 1, 'aprovada'),
    CC('MA141', 'Geometria Analítica', 6, 1, 'aprovada'),
    CC('F 128', 'Física Geral I', 4, 1, 'aprovada'),
    CC('F 129', 'Física Experimental I', 2, 1, 'aprovada'),
    CC('LA122', 'Inglês Instrumental', 2, 1, 'aprovada'),

    CC('MC202', 'Estruturas de Dados', 6, 2, 'aprovada', ['MC102']),
    CC('MA211', 'Cálculo II', 6, 2, 'aprovada', ['MA111']),
    CC('MA327', 'Álgebra Linear', 6, 2, 'aprovada', ['MA141']),
    CC('F 228', 'Física Geral II', 4, 2, 'aprovada', ['F 128']),
    CC('F 229', 'Física Experimental II', 2, 2, 'aprovada', ['F 129']),

    CC('MC322', 'Prog. Orientada a Objetos', 4, 3, 'cursando', ['MC202']),
    CC('MC358', 'Projeto e Análise de Algoritmos', 4, 3, 'cursando', ['MC202', 'MA327']),
    CC('MC404', 'Org. Básica de Computadores', 4, 3, 'cursando', ['MC102']),
    CC('MA311', 'Cálculo III', 4, 3, 'aprovada', ['MA211']),
    CC('ME323', 'Probabilidade e Estatística', 6, 3, 'aprovada', ['MA211']),

    CC('MC536', 'Bancos de Dados', 4, 4, 'disponivel', ['MC202']),
    CC('MC458', 'Análise de Algoritmos II', 4, 4, 'bloqueada', ['MC358']),
    CC('MC426', 'Engenharia de Software', 4, 4, 'bloqueada', ['MC322']),
    CC('MO401', 'Arquitetura de Computadores', 4, 4, 'bloqueada', ['MC404']),
    CC('MC613', 'Linguagens Formais e Autômatos', 6, 4, 'bloqueada', ['MC358']),

    CC('MC658', 'Inteligência Artificial', 4, 5, 'bloqueada', ['MC358']),
    CC('MO431', 'Sistemas Operacionais', 4, 5, 'bloqueada', ['MO401']),
    CC('MC558', 'Estruturas de Dados II', 4, 5, 'bloqueada', ['MC458']),
    CC('EA513', 'Circuitos Lógicos', 4, 5, 'bloqueada', ['MC404']),

    CC('MC886', 'Aprendizado de Máquina', 4, 6, 'bloqueada', ['MC658']),
    CC('MC723', 'Redes de Computadores', 4, 6, 'bloqueada', ['MO431']),
    CC('MC750', 'Construção de Interfaces', 4, 6, 'bloqueada', ['MC322']),
    CC('MS512', 'Cálculo Numérico', 4, 6, 'bloqueada', ['MA311']),

    CC('MC920', 'Processamento de Imagens', 4, 7, 'bloqueada', ['MC886']),
    CC('MC832', 'Sistemas Distribuídos', 4, 7, 'bloqueada', ['MC723']),
    CC('OPT 1', 'Optativa / Eletiva', 4, 7, 'bloqueada'),

    CC('MC030', 'Trabalho de Conclusão de Curso', 6, 8, 'bloqueada', ['MC426']),
    CC('OPT 2', 'Optativa / Eletiva', 4, 8, 'bloqueada'),
    CC('AA200', 'Atividades Acad. e de Extensão', 4, 8, 'bloqueada'),
  ],
};

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1', kind: 'falta', group: 'Hoje',
    title: 'F 128 — falta registrada',
    desc: '6 de 8 faltas. Restam 2 antes de reprovar por frequência.',
    time: 'há 2h', read: false,
  },
  {
    id: 'n2', kind: 'nota', group: 'Hoje',
    title: 'MA111 — nota abaixo da média',
    desc: 'Sua média em Cálculo I caiu para 4,6.',
    time: 'há 5h', read: false,
  },
  {
    id: 'n3', kind: 'prazo', group: 'Esta semana',
    title: 'MC322 — entrega do trabalho final',
    desc: 'Prazo 18/06 · faltam 5 dias.',
    time: 'ontem', read: false,
  },
  {
    id: 'n4', kind: 'sistema', group: 'Esta semana',
    title: 'Matrícula 2026.2 aberta',
    desc: 'Ajuste de matrícula a partir de 28/07.',
    time: '2 dias', read: true,
  },
];

// ---------------------------------------------------------------------------
// Painel Admin — coordenação (persona Roberta Campos, do design do Admin Web)
// ---------------------------------------------------------------------------

export const SEED_ADMIN: Student = {
  id: 'admin-1',
  role: 'admin',
  title: 'Coordenação · IC',
  name: 'Roberta Campos',
  ra: '000042',
  email: 'roberta@ic.unicamp.br',
  course: 'Instituto de Computação',
  courseCode: '42',
  semester: '2026.1',
  cr: 0,
  crDelta: 0,
  cp: 0,
  creditsCompleted: 0,
  creditsTotal: 0,
};

// ---------------------------------------------------------------------------
// Painel Professor — conta de login (id bate com um Professor de SEED_PROFESSORS
// abaixo, para que "minhas turmas" tenha dados de demonstração já no primeiro acesso).
// ---------------------------------------------------------------------------

export const SEED_PROFESSOR_ACCOUNT: Student = {
  id: 'prof-colombini',
  role: 'professor',
  title: 'Professor(a) · IC',
  name: 'Esther Colombini',
  ra: '000101',
  email: 'esther@ic.unicamp.br',
  course: 'Instituto de Computação',
  courseCode: '42',
  semester: '2026.1',
  cr: 0,
  crDelta: 0,
  cp: 0,
  creditsCompleted: 0,
  creditsTotal: 0,
};

const START_SCORE = (): Professor['scores'] => ({
  didactics: 5.0, organization: 5.0, accessibility: 5.0, material: 5.0,
  overall: 5.0, ratingsCount: 0,
});

const teach = (semester: string, courseCode: string, courseName: string, className: string): Professor['history'][number] =>
  ({ semester, courseCode, courseName, className });

export const SEED_PROFESSORS: Professor[] = [
  {
    id: 'prof-colombini', name: 'Esther Colombini', email: 'esther@ic.unicamp.br',
    department: 'Instituto de Computação', scores: START_SCORE(),
    history: [
      teach('2025.2', 'MC322', 'Programação Orientada a Objetos', 'Turma B'),
      teach('2025.1', 'MC322', 'Programação Orientada a Objetos', 'Turma A'),
      teach('2024.2', 'MC102', 'Algoritmos e Prog. de Computadores', 'Turma D'),
    ],
  },
  {
    id: 'prof-ramos', name: 'Carlos Ramos', email: 'carlos.ramos@ime.unicamp.br',
    department: 'Instituto de Matemática', scores: START_SCORE(),
    history: [
      teach('2025.2', 'MA111', 'Cálculo I', 'Turma A'),
      teach('2025.1', 'MA211', 'Cálculo II', 'Turma C'),
    ],
  },
  {
    id: 'prof-lemos', name: 'Marina Lemos', email: 'marina.lemos@ifi.unicamp.br',
    department: 'Instituto de Física', scores: START_SCORE(),
    history: [teach('2025.2', 'F 128', 'Física Geral I', 'Turma A')],
  },
  {
    id: 'prof-meidanis', name: 'João Meidanis', email: 'meidanis@ic.unicamp.br',
    department: 'Instituto de Computação', scores: START_SCORE(),
    history: [
      teach('2025.2', 'MC358', 'Projeto e Análise de Algoritmos', 'Turma B'),
      teach('2025.1', 'MC458', 'Projeto e Análise de Algoritmos II', 'Turma A'),
    ],
  },
  {
    id: 'prof-azevedo', name: 'Rodolfo Azevedo', email: 'rodolfo@ic.unicamp.br',
    department: 'Instituto de Computação', scores: START_SCORE(),
    history: [teach('2025.1', 'MC404', 'Organização Básica de Computadores', 'Turma A')],
  },
  {
    id: 'prof-santos', name: 'Núbia Santos', email: 'nubia.santos@ime.unicamp.br',
    department: 'Instituto de Matemática', scores: START_SCORE(),
    history: [teach('2025.2', 'ME323', 'Probabilidade e Estatística', 'Turma A')],
  },
  {
    id: 'prof-dias', name: 'Ana Dias', email: 'ana.dias@ime.unicamp.br',
    department: 'Instituto de Matemática', scores: START_SCORE(), history: [],
  },
  {
    id: 'prof-rezende', name: 'Pedro Rezende', email: 'rezende@ic.unicamp.br',
    department: 'Instituto de Computação', scores: START_SCORE(), history: [],
  },
  {
    id: 'prof-tavares', name: 'Luís Tavares', email: 'luis.tavares@fee.unicamp.br',
    department: 'Faculdade de Engenharia Elétrica', scores: START_SCORE(), history: [],
  },
];

export const SEED_ADMIN_COURSES: AdminCourse[] = [
  { id: 'ac1', code: 'MC322', name: 'Prog. Orientada a Objetos', area: 'Computação', credits: 4, color: 'laranja', classCount: 2, studentCount: 84, status: 'ativa' },
  { id: 'ac2', code: 'MA111', name: 'Cálculo I', area: 'Matemática', credits: 6, color: 'azul', classCount: 4, studentCount: 210, status: 'ativa' },
  { id: 'ac3', code: 'F 128', name: 'Física Geral I', area: 'Física', credits: 4, color: 'roxo', classCount: 3, studentCount: 156, status: 'ativa' },
  { id: 'ac4', code: 'MC358', name: 'Fund. Matemáticos da Computação', area: 'Computação', credits: 4, color: 'verde', classCount: 2, studentCount: 92, status: 'ativa' },
  { id: 'ac5', code: 'MC404', name: 'Organização de Computadores', area: 'Computação', credits: 4, color: 'rosa', classCount: 1, studentCount: 48, status: 'rascunho' },
  { id: 'ac6', code: 'MA311', name: 'Cálculo III', area: 'Matemática', credits: 4, color: 'laranja', classCount: 2, studentCount: 88, status: 'ativa' },
  { id: 'ac7', code: 'MC102', name: 'Algoritmos e Prog. de Computadores', area: 'Computação', credits: 6, color: 'azul', classCount: 5, studentCount: 312, status: 'ativa' },
  { id: 'ac8', code: 'EA513', name: 'Circuitos Elétricos', area: 'Engenharia', credits: 4, color: 'roxo', classCount: 2, studentCount: 76, status: 'rascunho' },
  { id: 'ac9', code: 'ME323', name: 'Probabilidade e Estatística', area: 'Matemática', credits: 6, color: 'laranja', classCount: 3, studentCount: 140, status: 'ativa' },
  { id: 'ac10', code: 'MC536', name: 'Bases de Dados', area: 'Computação', credits: 4, color: 'azul', classCount: 2, studentCount: 96, status: 'ativa' },
  { id: 'ac11', code: 'LA122', name: 'Inglês Instrumental', area: 'Linguística', credits: 2, color: 'roxo', classCount: 6, studentCount: 180, status: 'ativa' },
];

const crit = (label: string, weight: number, grade: number | null = null): GradeCriterion => ({
  id: `${label.toLowerCase().replace(/\s+/g, '-')}`, label, weight, grade, done: grade !== null,
});

/** Turmas — professor aloca Admin; PDD e roster (notas/faltas) são do professor. */
export const SEED_TURMAS: Turma[] = [
  {
    id: 'turma-mc322-a',
    courseCode: 'MC322', courseName: 'Programação Orientada a Objetos', className: 'Turma A',
    color: 'laranja', professorId: 'prof-colombini', professorName: 'Esther Colombini',
    slots: [
      { id: 's1', weekday: 1, start: '08:00', end: '10:00', room: 'CB02' },
      { id: 's2', weekday: 3, start: '08:00', end: '10:00', room: 'CB02' },
    ],
    totalHours: 60, absenceLimit: 8,
    criteria: [crit('Prova P1', 30, 8.5), crit('Prova P2', 30), crit('Trabalho final', 40, 7.2)],
    roster: [
      { id: 'r1', studentName: 'Marina Alves', studentRA: '247195', grades: { 'prova-p1': 8.5, 'prova-p2': null, 'trabalho-final': 7.2 }, absences: 5 },
      { id: 'r2', studentName: 'Bruno Castro', studentRA: '251034', grades: { 'prova-p1': 6.0, 'prova-p2': null, 'trabalho-final': 6.5 }, absences: 2 },
      { id: 'r3', studentName: 'Camila Reis', studentRA: '248871', grades: { 'prova-p1': 9.2, 'prova-p2': null, 'trabalho-final': 8.8 }, absences: 0 },
      { id: 'r4', studentName: 'Diego Fontes', studentRA: '253312', grades: { 'prova-p1': 4.5, 'prova-p2': null, 'trabalho-final': 5.0 }, absences: 7 },
    ],
    status: 'ativa',
  },
  {
    id: 'turma-ma111-c',
    courseCode: 'MA111', courseName: 'Cálculo I', className: 'Turma C',
    color: 'azul', professorId: 'prof-ramos', professorName: 'Carlos Ramos',
    slots: [
      { id: 's1', weekday: 1, start: '14:00', end: '16:00', room: 'IM02' },
      { id: 's2', weekday: 4, start: '14:00', end: '16:00', room: 'IM02' },
    ],
    totalHours: 90, absenceLimit: 11,
    criteria: [crit('Prova P1', 35, 4.2), crit('Prova P2', 35, 5.0), crit('Prova P3', 30)],
    roster: [
      { id: 'r1', studentName: 'Marina Alves', studentRA: '247195', grades: { 'prova-p1': 4.2, 'prova-p2': 5.0, 'prova-p3': null }, absences: 3 },
      { id: 'r2', studentName: 'Bruno Castro', studentRA: '251034', grades: { 'prova-p1': 7.0, 'prova-p2': 6.5, 'prova-p3': null }, absences: 1 },
    ],
    status: 'ativa',
  },
  {
    id: 'turma-mc358-a',
    courseCode: 'MC358', courseName: 'Projeto e Análise de Algoritmos', className: 'Turma A',
    color: 'verde', professorId: 'prof-meidanis', professorName: 'João Meidanis',
    slots: [
      { id: 's1', weekday: 2, start: '19:00', end: '21:00', room: 'CB09' },
      { id: 's2', weekday: 4, start: '19:00', end: '21:00', room: 'CB09' },
    ],
    totalHours: 60, absenceLimit: 8,
    criteria: [crit('Prova P1', 30, 8.0), crit('Prova P2', 30), crit('Listas', 40, 8.4)],
    roster: [
      { id: 'r1', studentName: 'Marina Alves', studentRA: '247195', grades: { 'prova-p1': 8.0, 'prova-p2': null, listas: 8.4 }, absences: 1 },
    ],
    status: 'ativa',
  },
  {
    id: 'turma-mc404-a',
    courseCode: 'MC404', courseName: 'Organização Básica de Computadores', className: 'Turma A',
    color: 'rosa', professorId: 'prof-azevedo', professorName: 'Rodolfo Azevedo',
    slots: [
      { id: 's1', weekday: 3, start: '14:00', end: '16:00', room: 'CB06' },
      { id: 's2', weekday: 5, start: '14:00', end: '16:00', room: 'Lab LSC' },
    ],
    totalHours: 60, absenceLimit: 8,
    criteria: [crit('Prova P1', 30, 7.5), crit('Prova P2', 30), crit('Projeto', 40, 6.7)],
    roster: [
      { id: 'r1', studentName: 'Marina Alves', studentRA: '247195', grades: { 'prova-p1': 7.5, 'prova-p2': null, projeto: 6.7 }, absences: 2 },
      { id: 'r2', studentName: 'Elisa Nogueira', studentRA: '246650', grades: { 'prova-p1': 8.8, 'prova-p2': null, projeto: 9.0 }, absences: 0 },
    ],
    status: 'ativa',
  },
  {
    id: 'turma-me323-b',
    courseCode: 'ME323', courseName: 'Probabilidade e Estatística', className: 'Turma B',
    color: 'laranja', professorId: 'prof-santos', professorName: 'Núbia Santos',
    slots: [
      { id: 's1', weekday: 2, start: '08:00', end: '10:00', room: 'PB Sala 3' },
      { id: 's2', weekday: 4, start: '08:00', end: '10:00', room: 'PB Sala 3' },
    ],
    totalHours: 90, absenceLimit: 11,
    criteria: [crit('Prova P1', 30), crit('Prova P2', 30), crit('Prova P3', 40)],
    roster: [
      { id: 'r1', studentName: 'Marina Alves', studentRA: '247195', grades: { 'prova-p1': null, 'prova-p2': null, 'prova-p3': null }, absences: 0 },
    ],
    status: 'ativa',
  },
  // Turmas ofertadas em que a Marina ainda NÃO está matriculada — aparecem em "Matricular-se".
  {
    id: 'turma-mc536-a',
    courseCode: 'MC536', courseName: 'Bases de Dados', className: 'Turma A',
    color: 'azul', professorId: 'prof-rezende', professorName: 'Pedro Rezende',
    slots: [
      { id: 's1', weekday: 1, start: '16:00', end: '18:00', room: 'CB03' },
      { id: 's2', weekday: 3, start: '16:00', end: '18:00', room: 'CB03' },
    ],
    totalHours: 60, absenceLimit: 8,
    criteria: [crit('Prova', 40), crit('Projeto de BD', 60)],
    roster: [],
    status: 'ativa',
  },
  {
    id: 'turma-la122-e',
    courseCode: 'LA122', courseName: 'Inglês Instrumental', className: 'Turma E',
    color: 'roxo', professorId: 'prof-tavares', professorName: 'Luís Tavares',
    slots: [{ id: 's1', weekday: 5, start: '10:00', end: '12:00', room: 'IEL 12' }],
    totalHours: 30, absenceLimit: 4,
    criteria: [crit('Participação', 40), crit('Prova final', 60)],
    roster: [],
    status: 'ativa',
  },
];

export const SEED_ADMIN_OVERVIEW: AdminOverview = {
  cards: [
    { label: 'Disciplinas ativas', value: '42', delta: '+4', kind: 'disciplinas' },
    { label: 'Turmas no semestre', value: '96', delta: '+12', kind: 'turmas' },
    { label: 'Alunos matriculados', value: '3.847', delta: '+218', kind: 'alunos' },
    { label: 'Professores', value: '128', delta: '+0', kind: 'professores' },
  ],
  enrollmentChart: [
    { period: '24.1', label: '2.9k', value: 2900 },
    { period: '24.2', label: '3.1k', value: 3100 },
    { period: '25.1', label: '3.3k', value: 3300 },
    { period: '25.2', label: '3.5k', value: 3500 },
    { period: '25.2', label: '3.6k', value: 3640 },
    { period: '26.1', label: '3.8k', value: 3847 },
  ],
  activity: [
    { id: 'a1', kind: 'criacao', text: 'Disciplina MC404 criada por você', time: 'há 12 min' },
    { id: 'a2', kind: 'alocacao', text: 'Prof. Carlos Ramos alocado em MA111 · Turma D', time: 'há 1 h' },
    { id: 'a3', kind: 'matricula', text: '18 novas matrículas em MC102', time: 'há 3 h' },
    { id: 'a4', kind: 'criterios', text: 'Critérios de F 128 atualizados', time: 'ontem' },
  ],
};

export const SEED_ADMIN_STUDENTS: AdminStudent[] = [
  { id: 'as1', name: 'Marina Alves', ra: '247195', course: 'Ciência da Computação', semester: '2026.1', cr: 8.4, cp: 0.81 },
  { id: 'as2', name: 'Bruno Castro', ra: '251034', course: 'Ciência da Computação', semester: '2026.1', cr: 7.1, cp: 0.68 },
  { id: 'as3', name: 'Camila Reis', ra: '248871', course: 'Engenharia de Computação', semester: '2026.1', cr: 9.0, cp: 0.92 },
  { id: 'as4', name: 'Diego Fontes', ra: '253312', course: 'Ciência da Computação', semester: '2026.1', cr: 5.8, cp: 0.55 },
  { id: 'as5', name: 'Elisa Nogueira', ra: '246650', course: 'Matemática Aplicada', semester: '2026.1', cr: 8.9, cp: 0.88 },
  { id: 'as6', name: 'Felipe Souza', ra: '252190', course: 'Física', semester: '2026.1', cr: 7.6, cp: 0.71 },
  { id: 'as7', name: 'Gabriela Lima', ra: '249904', course: 'Ciência da Computação', semester: '2026.1', cr: 8.2, cp: 0.79 },
  { id: 'as8', name: 'Henrique Melo', ra: '254028', course: 'Engenharia Elétrica', semester: '2026.1', cr: 6.9, cp: 0.63 },
];

export const SEED_STATS: Stats = {
  crHistory: [
    { semester: '24.1', cr: 7.6 },
    { semester: '24.2', cr: 7.9 },
    { semester: '25.1', cr: 8.0 },
    { semester: '25.2', cr: 8.1 },
    { semester: '26.1', cr: 8.4 },
  ],
  avgAttendance: 87,
  approvedCount: 24,
};
