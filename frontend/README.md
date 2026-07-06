# Unicampus — Frontend

App web de **gestão acadêmica** para estudantes, professores e coordenação da Unicamp —
trabalho final de **MC322A/B (Programação Orientada a Objetos)**. Este repositório contém
só o frontend; o **backend em Java** (Gradle) é a próxima etapa e é o que este documento
existe para orientar.

Interface responsiva (mobile-first: cara de app no celular; sidebar/grids no desktop).

Stack: **React + Vite + TypeScript** · react-router-dom · TanStack Query · Plus Jakarta Sans.

## Rodando

```bash
cd frontend
npm install
npm run dev        # abre em http://localhost:5173
```

Build de produção: `npm run build` (gera `dist/`; visualize com `npm run preview`).

Por padrão o app roda em **modo dev com dados mockados** (`localStorage`, sem backend). A
tela de login mostra um seletor "Entrar como Aluno/Professor/Admin" só nesse modo — ele some
sozinho assim que o backend estiver ligado (ver "Ligando o backend" abaixo).

## Papéis do sistema

Três papéis, três dashboards, permissões diferentes:

| Papel | Rotas | Pode fazer |
|---|---|---|
| **Aluno** | `/app/*` | Ver notas/faltas/grade (só leitura), simular nota necessária, avaliar o professor da disciplina que cursa, ver integralização. |
| **Professor** | `/professor/*` | Só as próprias turmas: define o PDD (critérios de avaliação), lança nota e falta dos alunos matriculados. Não vê o catálogo global. |
| **Admin** (coordenação) | `/admin/*` | Catálogo de disciplinas, criação de turmas (aloca professor/horário/sala — **sem** PDD), listagem de professores (score só leitura) e alunos. |

O **papel vem do backend** no login/cadastro (`AuthSession.student.role`); o frontend só
roteia para a área certa.

### Regras de negócio que o backend precisa replicar

- **Quem lança nota/falta:** só o professor da turma. O aluno só visualiza; o simulador de
  notas é uma calculadora local que nunca persiste.
- **Quem define o PDD (critérios de avaliação):** o **professor**, na própria turma — não o
  Admin. O Admin só aloca professor + horário + sala ao criar a turma.
- **Avaliação de professores:** todo professor começa com nota **5,0** em cada critério
  (Didática, Organização, Acessibilidade, Material didático). Só avalia quem tem a
  disciplina cadastrada e **cursando**. A nota é a média incremental de todas as avaliações:
  `novaMedia = (mediaAtual × totalAvaliações + notaDoAluno) / (totalAvaliações + 1)`; a
  média geral é a média dos 4 critérios.
- **Faltas:** reprovação quando `faltas > absenceLimit` (25% da carga horária).
- **Integralização:** disciplina `bloqueada` vira `disponivel` quando todos os
  `prerequisites` estão `aprovada`.
- **PDD sempre soma 100%** (validar no backend, não só no frontend).

## Arquitetura (MVVM)

```
src/
  screens/        # View — nunca chama rede diretamente
  admin/          # View do painel Admin (layout, disciplinas, turmas, professores, alunos)
  professor/      # View do painel Professor (layout, turmas, lançar nota/falta, score)
  components/     # layout/ (shell, nav), common/, course/, grade/
  viewmodels/     # ViewModel — hooks React Query + regras de tela (queries.ts, admin.ts, professor.ts...)
  domain/         # regras de negócio puras (rules.ts) — sem React, fáceis de testar
  data/
    repositories/ # Model — contratos (types.ts) + impl. mock (localStorage) + impl. HTTP
    http/         # cliente fetch único (httpClient.ts) — baseURL, token, timeout, 401
    mock/         # seed.ts (dados de exemplo) + store.ts (persistência em localStorage)
  context/        # AuthContext (sessão) e ToastContext
  models/         # tipos TS = contrato de dados com o backend
  theme/ utils/    # tokens de design e formatação pt-BR
```

**Regra de ouro:** telas só falam com `viewmodels/`, que só falam com `data/repositories/`.
Trocar mock por HTTP é mexer só em `data/repositories/httpRepositories.ts` — nenhuma tela muda.

## Ligando o backend

1. Copie `.env.example` para `.env` e defina `VITE_API_URL` (ex.: `http://localhost:8080/api`).
2. Com a URL definida, `isDevMode` (em `src/data/http/httpClient.ts`) vira `false` e todos os
   repositórios passam a usar `httpRepositories.ts` (chamadas HTTP reais) em vez dos mocks —
   automaticamente, sem tocar em nenhuma tela.
3. O token é salvo no `localStorage` e enviado como `Authorization: Bearer <token>`; uma
   resposta `401` derruba a sessão (evento `unicampus:unauthorized`).
4. Os formatos exatos dos objetos (`Student`, `Course`, `Turma`, `Professor`, etc.) estão em
   `src/models/index.ts` — é o contrato que o backend precisa implementar.

### Endpoints esperados

| Método | Endpoint | Retorno |
|---|---|---|
| POST | `/auth/login`, `/auth/signup` | `{ token, student }` — `student.role` decide o dashboard |
| POST | `/auth/password-reset` | — |
| GET / PUT | `/me` | `Student` |
| GET | `/offerings?semester=2026.1` | `OfferedCourse[]` |
| POST | `/enrollments` | `Course[]` |
| GET | `/courses?mine=true`, `/courses/:id` | `Course[]`, `Course` |
| POST / PUT / DELETE | `/courses`, `/courses/:id` | `Course` |
| GET | `/schedule` | `Course[]` (com `slots`) |
| GET | `/curriculum` | `Curriculum` |
| GET | `/stats` | `Stats` |
| GET / POST | `/notifications` (+ `/read-all`, `/:id/read`) | `AppNotification[]` |
| GET | `/search?q=&tab=` | `SearchResult[]` |
| GET | `/admin/overview` | `AdminOverview` |
| GET / POST / PUT / DELETE | `/admin/courses`, `/admin/courses/:id` | `AdminCourse` (catálogo — sem professor/horário) |
| GET / POST / PUT / DELETE | `/admin/turmas`, `/admin/turmas/:id` | `Turma` (professor + horário; **sem PDD**) |
| GET | `/admin/students` | `AdminStudent[]` |
| GET | `/professors`, `/professors/:id` | `Professor[]`, `Professor` |
| POST | `/professors/:id/rate` | `Professor` (recalcula a média incremental) |
| GET | `/professor/turmas`, `/professor/turmas/:id` | `Turma[]`, `Turma` (só as do professor logado) |
| PUT | `/professor/turmas/:id/criteria` | `Turma` (professor define o PDD) |
| PUT | `/professor/turmas/:id/roster/:rosterId/grade` | `Turma` (lançar nota `{criterionId, grade}`) |
| POST | `/professor/turmas/:id/roster/:rosterId/absence` | `Turma` (registrar falta) |
| GET | `/professor/me/score` | `Professor` (score do professor logado, só leitura) |

---

## Tarefas para o backend (Java + Gradle)

Este projeto é da disciplina **MC322 — Programação Orientada a Objetos**; a correção olha
principalmente para **conceitos de POO bem aplicados** (40% da nota), não só a API
funcionar. Os requisitos abaixo vêm direto do enunciado — vale a pena satisfazê-los de forma
explícita e visível no código, não só "por acaso".

### Setup
- Projeto Java com **Gradle**, aberto no **VSCode** (extensão Java + Gradle for Java).
- Servidor HTTP simples expondo os endpoints acima em JSON (Javalin ou Spark são leves e
  suficientes; Spring Boot também serve se o grupo preferir — não é exigido pelo enunciado).
- Configurar **CORS** liberando `http://localhost:5173` (dev do Vite) e a origem de produção.

### Requisitos obrigatórios do enunciado (Seção 2 do PDF)
- **Relacionamentos com ênfase em polimorfismo** — o próprio domínio já sugere isso:
  - `Pessoa` (abstrata) → `Aluno`, `Professor`, `Coordenador` (associação/generalização);
    cada um sabe montar seu próprio "resumo de sessão" (`AuthSession.student`) de forma
    polimórfica.
  - `Curso` (catálogo) **agrega** N `Turma`; `Turma` **compõe** os `RosterEntry` (aluno
    matriculado não existe fora da turma) e os `CriterioAvaliacao` do PDD.
  - `Notificacao` (abstrata) → `NotificacaoFalta`, `NotificacaoNota`, `NotificacaoPrazo`,
    `NotificacaoSistema` (bate com `NotificationKind` do frontend) — cada uma sabe formatar
    sua própria mensagem/ícone, uso natural de polimorfismo.
- **2 classes abstratas** — `Pessoa` e `Notificacao` acima já cobrem isso; ou alternativamente
  uma abstração de `CriterioAvaliacao`/`Avaliavel` se fizer mais sentido para o grupo.
- **3 interfaces** — sugestões que já casam com regras existentes no frontend:
  - `Persistivel` (ou `Repositorio<T>`) — contrato de leitura/gravação em arquivo (ver abaixo).
  - `Avaliavel` — implementada por `Professor` (recebe `Avaliacao` de aluno, recalcula média).
  - `GeradorDeAlerta` — implementada por quem gera os alertas do dashboard (faltas perto do
    limite, nota abaixo de 5,0) e pelas `Notificacao`.
- **Tratamento de exceção (mín. 2 exceções próprias)** — sugestões diretas das regras já
  validadas no frontend, que precisam ser garantidas no backend também:
  - `PesoInvalidoException` — PDD de uma turma não soma 100%.
  - `AvaliacaoNaoPermitidaException` — aluno tentando avaliar professor de disciplina que
    não está `cursando`, ou que não tem matrícula na turma.
  - Outras candidatas: `MatriculaNaoEncontradaException`, `LimiteDeFaltasExcedidoException`.
- **Arquivos (leitura e gravação)** — **este é o ponto mais fácil de esquecer**: o enunciado
  pede que o sistema **leia e grave elementos em arquivo**, não necessariamente num banco de
  dados. Caminho mais simples e mais alinhado ao curso: persistir `Aluno`, `Professor`,
  `Turma`, `Curso` etc. como **arquivos JSON** em disco (`Jackson`/`Gson` para
  serializar/desserializar, ou até `Serializable` binário), lidos ao iniciar o servidor e
  gravados a cada alteração. Isso satisfaz o requisito diretamente e evita a complexidade de
  subir um banco só para o trabalho — um banco real é opcional, não obrigatório aqui.
- **Testes unitários** — JUnit 5, cobrindo pelo menos as regras de negócio de
  `domain/rules.ts` reimplementadas em Java (nota necessária no simulador, faltas restantes,
  média incremental do professor, soma do PDD).
- **Interface gráfica** — já coberta por este frontend web; não precisa fazer nada a mais
  aqui além de servir a API que ele consome.

### Ordem sugerida
1. Modelar as entidades (`Pessoa`/`Aluno`/`Professor`/`Coordenador`, `Curso`, `Turma`,
   `CriterioAvaliacao`, `RosterEntry`, `Notificacao`) e a camada de persistência em arquivo.
2. Auth simples (login devolve token + `Student` com `role` correto) — pode ser um token
   opaco em memória para começar, não precisa ser JWT real no MVP.
3. Endpoints do Aluno (`/me`, `/courses`, `/schedule`, `/curriculum`, `/stats`,
   `/notifications`, `/search`).
4. Endpoints do Professor (`/professor/turmas/*`) — validar que só o professor dono da
   turma pode lançar nota/falta.
5. Endpoints do Admin (`/admin/*`) — catálogo, turmas, alunos.
6. Endpoints de avaliação de professor (`/professors/*`) com a fórmula de média incremental.
7. Testes unitários das regras de negócio.
8. Trocar `VITE_API_URL` no frontend e testar o fluxo ponta a ponta pelos três papéis.
