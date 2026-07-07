# Unicampus — Backend (Java + Gradle)

Backend do trabalho final de **MC322A/B — Programação Orientada a Objetos**: API REST em
Java que serve o frontend web (`../frontend`). Servidor HTTP leve com **Javalin**,
JSON com **Jackson**, persistência em **arquivos JSON** e testes com **JUnit 5**.

## Rodando

Pré-requisito: JDK 17+ (o projeto compila com `--release 17`).

```bash
cd backend
./gradlew run          # sobe a API em http://localhost:8080/api
./gradlew test         # roda os testes unitários (JUnit 5)
./gradlew build        # compila + testa + empacota
```

Na primeira execução, o diretório `data/` é criado com a carga de demonstração
(mesmos dados do modo mock do frontend). Depois disso **os arquivos em `data/` são a
fonte de verdade**: todo lançamento de nota, matrícula, avaliação etc. é gravado em
disco e sobrevive a reinícios. Para "resetar" a demonstração, apague `data/`.

Variáveis de ambiente opcionais: `PORT` (padrão `8080`) e `UNICAMPUS_DATA_DIR` (padrão `data`).

### Contas de demonstração (senha `123456`)

| Papel | RA | Quem |
|---|---|---|
| Aluna | `247195` | Marina Alves |
| Professora | `000101` | Esther Colombini (leciona MC322 · Turma A) |
| Coordenação (admin) | `000042` | Roberta Campos |

Os demais alunos do seed (`251034`, `248871`, `253312`, …) e professores (`000102`…`000109`)
também logam com `123456`.

### Ligando o frontend

```bash
cd ../frontend
echo 'VITE_API_URL=http://localhost:8080/api' > .env
npm run dev
```

Com a URL definida o frontend abandona os mocks e passa a chamar esta API
(o seletor "Entrar como" da tela de login some — o papel passa a vir do backend).
CORS já está liberado para `http://localhost:5173`.

## Arquitetura

```
src/main/java/br/unicamp/mc322/unicampus/
  dominio/            # regras de negócio puras — sem HTTP, sem arquivo
    pessoa/           # Pessoa (abstrata) → Aluno, Professor, Coordenador
    academico/        # Disciplina, Turma, Matricula, CriterioAvaliacao, HorarioAula,
                      # Curriculo, ItemCurriculo, EstatisticasAluno, enums (Cor, Status...)
    notificacao/      # Notificacao (abstrata) → Falta, Nota, Prazo, Sistema
    avaliacao/        # Avaliavel (interface), AvaliacaoProfessor, ScoreProfessor
    alerta/           # GeradorDeAlerta (interface)
    excecao/          # UnicampusException e as exceções próprias do sistema
    RegrasAcademicas  # fórmulas (média ponderada, nota necessária, faltas...)
  persistencia/       # Repositorio<T> (interface) + RepositorioJson (arquivos JSON),
                      # BancoDeDados (agregador), Seed (carga inicial), Visoes/Mapeadores
  servico/            # casos de uso por papel (Aluno, Admin, ProfessorPortal,
                      # Professores/avaliação, Busca, Notificações, Autenticação)
  api/                # ApiServer (rotas Javalin, auth Bearer, papéis, erros→HTTP) + DTOs
  Main.java
```

Fluxo de uma requisição: `ApiServer` (HTTP) → `servico/` (caso de uso) → `dominio/`
(regra de negócio) → `persistencia/` (grava em arquivo). Nenhuma regra vive na API.

**Decisão central do modelo:** a "disciplina do aluno" (`Course` no frontend) não é uma
entidade — é uma **visão derivada** da `Turma` em que ele está matriculado. A nota que o
professor lança no roster é exatamente a que o aluno vê no dashboard (fonte única de
verdade, resolvendo a pendência §5.2 do `frontend/BUSINESS_RULES.md`).

## Requisitos do enunciado — onde cada um está

| Requisito | Onde |
|---|---|
| **Classes abstratas (≥ 2)** | `Pessoa` (→ Aluno/Professor/Coordenador) e `Notificacao` (→ Falta/Nota/Prazo/Sistema) |
| **Interfaces (≥ 3)** | `Repositorio<T>` (persistência), `Avaliavel` (professor recebe avaliação), `GeradorDeAlerta` (turma gera alertas), `Identificavel` (contrato de id) |
| **Polimorfismo** | `Pessoa.montarPerfilSessao()` e `getPapel()` (login trata qualquer papel sem `if` de tipo); `Notificacao.getKind()` (o JSON sai do tipo concreto); `UnicampusException.getStatusHttp()` (cada exceção conhece seu status HTTP) |
| **Relacionamentos** | `Turma` **compõe** `Matricula` e `CriterioAvaliacao` (não existem fora dela); `Disciplina` **agrega** turmas (via código); `Turma` **associa-se** a `Professor` |
| **Exceções próprias (≥ 2)** | `PesoInvalidoException` (PDD ≠ 100%), `AvaliacaoNaoPermitidaException`, `MatriculaNaoEncontradaException`, além de `ValidacaoException`, `AutenticacaoException`, `AcessoNegadoException`, `RecursoNaoEncontradoException` — todas sob `UnicampusException` |
| **Arquivos (leitura e gravação)** | `RepositorioJson`/`DocumentoJson`: cada coleção vive num arquivo JSON em `data/`, lido ao iniciar e regravado a cada mutação (inclui a hierarquia polimórfica de `Notificacao`) |
| **Testes unitários** | `src/test/java` — 25 testes: regras acadêmicas, invariantes da Turma (PDD=100%, notas/faltas, alertas), média incremental do professor, permissão de avaliação, round-trip de persistência |
| **Interface gráfica** | o frontend web em `../frontend` (React), que consome esta API |

## Regras de negócio garantidas no servidor

- **Só o professor da turma** lança nota/falta (`403` para turma de outro professor).
- **PDD é do professor** e deve **somar 100%** (`PesoInvalidoException` → `400`);
  o Admin só aloca disciplina + professor + horário/sala ao criar a turma.
- **Avaliação de professor**: só aluno **matriculado em turma ativa** daquele professor
  (`AvaliacaoNaoPermitidaException` → `403`); score começa em 5,0 e usa **média
  incremental** `(média×total + nota) / (total+1)`.
- **Limite de faltas** = 25% da carga horária (aulas de 2h, mínimo 2); reprova se
  `faltas > limite`. Ao registrar falta/nota, a turma (`GeradorDeAlerta`) emite
  notificações para o aluno (restam ≤ 2 faltas, ou média < 5,0) sem duplicar.
- **Integralização**: disciplina `bloqueada` vira `disponivel` quando todos os
  pré-requisitos estão `aprovada` (`Curriculo.aplicarIntegralizacao()`).
- **Senha nunca sai pela API**: visões Jackson separam o que vai para arquivo
  (`Visoes.Interna`) do que sai pela rede (`Visoes.Publica`).

## Endpoints

Todos sob `/api`, autenticados por `Authorization: Bearer <token>` (exceto `/auth/*`).
Erros voltam como `{ "message": "..." }` com o status HTTP adequado.

| Método | Endpoint | Papel | Descrição |
|---|---|---|---|
| POST | `/auth/login` · `/auth/signup` | — | `{token, student}`; `student.role` decide o dashboard |
| POST | `/auth/password-reset` | — | valida o RA (MVP) |
| GET · PUT | `/me` | todos | perfil da sessão |
| GET | `/courses` · `/courses/:id` | aluno | disciplinas cursadas (derivadas das turmas) |
| PUT | `/courses/:id` | aluno | preferências (cor) |
| DELETE | `/courses/:id` | aluno | trancar matrícula |
| PUT | `/courses/:id/self-absences` | aluno | contador pessoal de faltas |
| GET | `/offerings` | aluno | oferecimentos do semestre |
| POST | `/enrollments` | aluno | matrícula por códigos (onboarding) |
| GET | `/enrollments/available` | aluno | turmas ativas sem matrícula do aluno |
| POST | `/enrollments/turma` | aluno | matricular-se em turma `{turmaId, color}` |
| GET | `/schedule` · `/curriculum` · `/stats` | aluno | grade, integralização, estatísticas |
| GET · POST | `/notifications` (+`/:id/read`, `/read-all`) | todos | notificações do usuário |
| GET | `/search?q=&tab=` | todos | disciplinas / professores / salas |
| GET | `/professors` · `/professors/:id` · `/professors/:id/profile` | todos | catálogo e perfil público |
| POST | `/professors/:id/rate` | aluno | avaliar (média incremental) |
| POST · PUT · DELETE | `/professors` · `/professors/:id` | admin | CRUD de professores |
| GET | `/professor/turmas` · `/professor/turmas/:id` | professor | só as próprias turmas |
| PUT | `/professor/turmas/:id/criteria` | professor | definir PDD (soma 100%) |
| PUT | `/professor/turmas/:id/roster/:rid/grade` | professor | lançar nota |
| POST | `/professor/turmas/:id/roster/:rid/absence` | professor | registrar falta |
| GET | `/professor/me/score` | professor | score recebido (só leitura) |
| GET | `/admin/overview` | admin | cards derivados + feed de atividade real |
| GET · POST · PUT · DELETE | `/admin/courses` (+`/:id`) | admin | catálogo de disciplinas |
| GET · POST · PUT · DELETE | `/admin/turmas` (+`/:id`) | admin | turmas (professor+horário; **sem PDD**) |
| GET | `/admin/students` | admin | alunos (só leitura) |

## UML

O diagrama de classes (Mermaid + PlantUML) está em [`docs/`](docs/) —
`docs/diagrama-classes.md` renderiza direto no GitHub/VSCode.
