<p align="center">
  <img src="docs/media/banner.png" alt="Unicampus — app de gestão acadêmica da Unicamp" />
</p>

# Unicampus — Gestão Acadêmica (MC322 · Trabalho Final)

App de gestão acadêmica da Unicamp com três papéis — **Aluno**, **Professor** e
**Coordenação (Admin)** — cada um com seu próprio dashboard.

| Parte | Pasta | Stack |
|---|---|---|
| Frontend (interface web) | [`frontend/`](frontend/) | React + Vite + TypeScript (MVVM) |
| Backend (API REST) | [`backend/`](backend/) | Java 17 + Gradle + Javalin (POO, arquivos JSON, JUnit 5) |

## 🎬 Demo

<p align="center">
<img src="docs/media/teaser.gif" alt="Trailer: login com RA e dashboard da aluna" width="840" />
</p>

<p align="center">
  🎥 <b><a href="video-apresentacao/out/UnicampusTrailer.mp4">Assista ao trailer completo em 1080p</a></b> — todas as funcionalidades em 60 segundos.
</p>

| 📱 Matrícula em poucos toques | 📱 Avaliação de professores |
| :---: | :---: |
| <img src="docs/media/matricula.gif" width="270" alt="Fluxo de matrícula com bottom sheet e cor de identificação"> | <img src="docs/media/avaliar.gif" width="270" alt="Avaliando professor com sliders"> |

| 🧑‍🏫 Professor — lançamento de notas | 🏛️ Coordenação — gestão de turmas |
| :---: | :---: |
| <img src="docs/media/prof-nota.gif" width="420" alt="Professor lançando nota direto na tabela da turma"> | <img src="docs/media/admin-drawer.gif" width="420" alt="Drawer de edição de turma no painel admin"> |

<details>
<summary>📸 Mais telas do app (aluno)</summary>
<p align="center">
<img src="docs/media/m-grade.png" width="240" alt="Grade horária semanal">
<img src="docs/media/m-stats.png" width="240" alt="Estatísticas e evolução do CR">
<img src="docs/media/m-integralizacao.png" width="240" alt="Árvore de integralização">
</p>
</details>


## Rodando o sistema completo

### Pré-requisitos

| Parte | Requisito | Observação |
|---|---|---|
| **Backend** | **JDK 17+** (Java 17) | Único requisito. O **Gradle não precisa ser instalado** — o wrapper `./gradlew` baixa a versão certa (9.4.1) na primeira execução. Deixe a **porta 8080** livre. |
| **Frontend** | **Node.js 18+** (recomendado 20 LTS) e **npm** | Vem com o Node. Deixe a **porta 5173** livre. |

Verifique com `java -version` (deve mostrar 17 ou superior) e `node -v` (18 ou superior).
No Windows use `gradlew.bat run` no lugar de `./gradlew run`.

### Passos

```bash
# 1. Backend (http://localhost:8080/api)
cd backend && ./gradlew run

# 2. Frontend (http://localhost:5173) — em outro terminal
cd frontend
echo 'VITE_API_URL=http://localhost:8080/api' > .env
npm install && npm run dev
```

Depois abra **http://localhost:5173** no navegador.

Contas de demonstração (senha `123456`): aluna `247195` · professora `000101` ·
coordenação `000042`. Sem o `.env`, o frontend roda sozinho em modo mock.

Documentação: [`frontend/README.md`](frontend/README.md) (interface e contrato da API),
[`frontend/BUSINESS_RULES.md`](frontend/BUSINESS_RULES.md) (regras de negócio e papéis),
[`backend/README.md`](backend/README.md) (arquitetura POO, requisitos do enunciado) e
[`backend/docs/`](backend/docs/) (diagramas UML).

## 🏗️ Arquitetura Orientada a Objetos (Backend)

### Diagrama de classes (UML)

Renderiza direto aqui no GitHub. A versão PlantUML (para o relatório) está em
[`backend/docs/diagrama-classes.puml`](backend/docs/diagrama-classes.puml).

#### Domínio — pessoas, turmas e avaliação

```mermaid
classDiagram
    direction TB

    class Identificavel {
        <<interface>>
        +getId() String
    }

    class Pessoa {
        <<abstract>>
        -id: String
        -name: String
        -email: String
        -ra: String
        -senha: String
        +getPapel()* Papel
        +montarPerfilSessao()* PerfilSessao
        +senhaConfere(tentativa) boolean
    }

    class Aluno {
        -course: String
        -semester: String
        -cr: double
        -cp: double
        -creditsCompleted: int
        +getPapel() Papel
        +montarPerfilSessao() PerfilSessao
    }

    class Professor {
        -department: String
        -scores: ScoreProfessor
        -history: List~TurmaLecionada~
        +receberAvaliacao(avaliacao)
        +notaGeral() double
    }

    class Coordenador {
        -title: String
        -department: String
    }

    class Avaliavel {
        <<interface>>
        +receberAvaliacao(avaliacao)
        +notaGeral() double
    }

    class ScoreProfessor {
        -didactics: double
        -organization: double
        -accessibility: double
        -material: double
        -overall: double
        -ratingsCount: int
        +incorporar(avaliacao)
    }

    class GeradorDeAlerta {
        <<interface>>
        +gerarAlertas() List~Notificacao~
    }

    class Disciplina {
        -code: String
        -name: String
        -area: String
        -credits: int
        -color: Cor
        -status: StatusOferta
        +cargaHoraria() int
    }

    class Turma {
        -courseCode: String
        -className: String
        -professorId: String
        -totalHours: int
        -absenceLimit: int
        -status: StatusOferta
        +definirCriterios(criterios)
        +lancarNota(matriculaId, criterioId, nota)
        +registrarFalta(matriculaId)
        +matricular(aluno, cor) Matricula
        +mediaDoAluno(matricula) Double
        +gerarAlertas() List~Notificacao~
    }

    class Matricula {
        -studentId: String
        -grades: Map~String,Double~
        -absences: int
        -selfAbsences: int
        -color: Cor
        +lancarNota(criterioId, nota)
        +registrarFalta()
    }

    class CriterioAvaliacao {
        -label: String
        -weight: int
        -grade: Double
        -done: boolean
        +comNotaDoAluno(nota) CriterioAvaliacao
    }

    class HorarioAula {
        <<record>>
        +weekday: int
        +start: String
        +end: String
        +room: String
    }

    class RegrasAcademicas {
        <<utility>>
        +mediaPonderada(criterios, notas)$ Double
        +notaNecessaria(criterios, notas)$ Double
        +mediaIncremental(media, total, nota)$ double
        +limiteDeFaltas(cargaHoraria)$ int
        +reprovadoPorFrequencia(faltas, limite)$ boolean
    }

    Identificavel <|.. Pessoa
    Identificavel <|.. Turma
    Identificavel <|.. Disciplina

    Pessoa <|-- Aluno : herança
    Pessoa <|-- Professor
    Pessoa <|-- Coordenador
    Avaliavel <|.. Professor : implementa
    Professor *-- ScoreProfessor : composição

    GeradorDeAlerta <|.. Turma : implementa
    Disciplina o-- Turma : agregação (1..*)
    Turma *-- Matricula : composição (roster)
    Turma *-- CriterioAvaliacao : composição (PDD)
    Turma *-- HorarioAula
    Aluno ..> Matricula : origina
    Turma ..> RegrasAcademicas : usa
```

#### Notificações (polimorfismo) e exceções

```mermaid
classDiagram
    direction TB

    class Notificacao {
        <<abstract>>
        -id: String
        -ownerId: String
        -title: String
        -desc: String
        -read: boolean
        -createdAt: long
        +getKind()* String
        +getGroup() String
        +getTime() String
        +alternarLida()
    }

    class NotificacaoFalta {
        +getKind() "falta"
    }
    class NotificacaoNota {
        +getKind() "nota"
    }
    class NotificacaoPrazo {
        +getKind() "prazo"
    }
    class NotificacaoSistema {
        +getKind() "sistema"
    }

    Notificacao <|-- NotificacaoFalta
    Notificacao <|-- NotificacaoNota
    Notificacao <|-- NotificacaoPrazo
    Notificacao <|-- NotificacaoSistema

    class UnicampusException {
        -statusHttp: int
        +getStatusHttp() int
    }
    class ValidacaoException {
        400
    }
    class PesoInvalidoException {
        400 — PDD não soma 100%
    }
    class AvaliacaoNaoPermitidaException {
        403 — aluno não cursa com o professor
    }
    class MatriculaNaoEncontradaException {
        404
    }
    class AutenticacaoException {
        401
    }
    class AcessoNegadoException {
        403
    }
    class RecursoNaoEncontradoException {
        404
    }

    RuntimeException <|-- UnicampusException
    UnicampusException <|-- ValidacaoException
    ValidacaoException <|-- PesoInvalidoException
    UnicampusException <|-- AvaliacaoNaoPermitidaException
    UnicampusException <|-- MatriculaNaoEncontradaException
    UnicampusException <|-- AutenticacaoException
    UnicampusException <|-- AcessoNegadoException
    UnicampusException <|-- RecursoNaoEncontradoException
```

#### Persistência e camadas

```mermaid
classDiagram
    direction LR

    class Repositorio~T~ {
        <<interface>>
        +listar() List~T~
        +buscarPorId(id) Optional~T~
        +filtrar(criterio) List~T~
        +adicionar(entidade)
        +remover(id)
        +persistir()
    }

    class RepositorioJson~T~ {
        -arquivo: Path
        -cache: List~T~
        lê o arquivo no construtor;
        regrava a cada mutação
    }

    class BancoDeDados {
        +alunos() Repositorio~Aluno~
        +professores() Repositorio~Professor~
        +turmas() Repositorio~Turma~
        +disciplinas() Repositorio~Disciplina~
        +notificacoes() Repositorio~Notificacao~
    }

    class ApiServer {
        rotas Javalin /api/*
        token Bearer + papel
        exceção → status HTTP
    }

    class Servicos {
        ServicoAutenticacao
        ServicoAluno
        ServicoAdmin
        ServicoProfessorPortal
        ServicoProfessores
        ServicoBusca
        ServicoNotificacoes
    }

    Repositorio <|.. RepositorioJson
    BancoDeDados *-- RepositorioJson : um arquivo JSON por coleção
    ApiServer --> Servicos : delega
    Servicos --> BancoDeDados : consulta e persiste
```

O backend é organizado em pacotes com responsabilidades bem definidas:

| Pacote | Responsabilidade |
|---|---|
| `dominio` | Regras de negócio, identificação de entidades, formatação de tempo |
| `dominio.academico` | Disciplinas, turmas, matrículas, critérios de avaliação |
| `dominio.alerta` | Interface para geração de alertas |
| `dominio.avaliacao` | Avaliação de professores |
| `dominio.excecao` | Exceções de negócio personalizadas |
| `dominio.notificacao` | Estruturas de notificações do sistema |
| `dominio.pessoa` | Papéis de usuário (Aluno, Professor, Coordenador) |
| `persistencia` | Leitura/gravação de dados em JSON |
| `servico` | Orquestração da lógica de negócio |

**Principais classes:** `Pessoa` (abstrata, base de `Aluno`/`Professor`/`Coordenador`) ·
`Disciplina` · `Turma` (professor, critérios, matrículas) · `Matricula` (notas e faltas) ·
`CriterioAvaliacao` · `Notificacao` (abstrata) · `RepositorioJson` · `RegrasAcademicas` ·
`ServicoProfessorPortal`.

### Herança

- **`Pessoa`** → `Aluno`, `Professor`, `Coordenador` — atributos comuns (id, name, email, ra) e método abstrato `getPapel()`.
- **`Notificacao`** → `NotificacaoFalta`, `NotificacaoNota`, `NotificacaoPrazo`, `NotificacaoSistema` — atributos comuns (id, ownerId, desc, group, time, createdAt).

Evita duplicar código entre classes de mesma natureza, modela a relação "é um(a)" e habilita polimorfismo.

### Interfaces

| Interface | Método(s) | Implementada por | Por quê |
|---|---|---|---|
| `Identificavel` | `getId()` | `Pessoa`, `Disciplina`, `Turma`, `Notificacao`, `AtividadeAdmin` | Identificador único para busca, coleções e persistência genérica |
| `GeradorDeAlerta` | `gerarAlertas()` | `Turma` | Desacopla geração de alertas de quem os consome |
| `Avaliavel` | `receberAvaliacao()`, `notaGeral()` | `Professor` | Padroniza como entidades avaliáveis recebem e calculam notas |
| `Repositorio<T extends Identificavel>` | CRUD básico | `RepositorioJson` | Abstrai o mecanismo de persistência |

### Polimorfismo

- `getPapel()` — abstrato em `Pessoa`, sobrescrito por subclasse; descobre o papel em tempo de execução.
- `getId()` — via `Identificavel`; permite `RepositorioJson<T extends Identificavel>` operar de forma genérica.
- `gerarAlertas()` — via `GeradorDeAlerta`; o serviço chama sem conhecer os detalhes internos de `Turma`.
- `receberAvaliacao()` / `notaGeral()` — via `Avaliavel`; trata `Professor` genericamente num contexto de avaliação.

### Associação, agregação e composição

**Associação** — `Turma` ↔ `List<CriterioAvaliacao>`/`List<Matricula>`; `Professor` ↔ `List<TurmaLecionada>`;
`Disciplina`/`Matricula` ↔ `Cor`.

**Agregação** — `Disciplina` agrega `Turma`s: a disciplina existe no catálogo independente de ter
turma no semestre, e uma turma referencia a disciplina sem ser "destruída" com ela.

**Composição** — partes que só existem dentro do todo e são criadas por ele:

- `Professor` **compõe** `ScoreProfessor` — criado no construtor (`ScoreProfessor.inicial()`) e sem vida
  fora do professor.
- `Turma` **compõe** seu `roster` de `Matricula`, os `CriterioAvaliacao` do PDD e os `HorarioAula` —
  todos criados pela própria `Turma` (`Matricula.nova(...)`) e sem sentido fora dela.
- `BancoDeDados` **compõe** os `RepositorioJson` (um por coleção), instanciados no seu construtor.

No diagrama de classes acima essas relações aparecem como `*--`.

### Encapsulamento

Atributos de domínio são `private`, com acesso controlado por getters/setters que validam estado:

- `Pessoa.trocarSenha(nova)` — encapsula a troca de senha
- `Matricula.lancarNota(...)` / `registrarFalta()` — controlam notas e faltas
- `CriterioAvaliacao.setGrade(grade)` — atualiza nota e status `done` juntos
- `Turma.definirCriterios(...)` — valida soma dos pesos = 100% antes de aceitar (`PesoInvalidoException`)
- `Turma.lancarNota(...)` — valida nota (0–10) e existência do critério antes de repassar à `Matricula`

### Tratamento de exceções

| Exceção | HTTP | Uso |
|---|---|---|
| `UnicampusException` | — | Base de todas as exceções de negócio (guarda o status HTTP) |
| `ValidacaoException` | 400 | Erros de validação de entrada |
| `PesoInvalidoException` | 400 | Soma dos pesos dos critérios (PDD) ≠ 100% |
| `AvaliacaoNaoPermitidaException` | 403 | Aluno tenta avaliar professor de quem não cursa |
| `MatriculaNaoEncontradaException` | 404 | Matrícula não encontrada na turma |
| `AutenticacaoException` | 401 | Token ausente/expirado ou credenciais inválidas |
| `AcessoNegadoException` | 403 | Papel sem permissão para a operação |
| `RecursoNaoEncontradoException` | 404 | Entidade inexistente |

Todas herdam de `UnicampusException`, que carrega o status HTTP — o `ApiServer` traduz a exceção
para a resposta correta num único ponto. Usadas em `Turma.definirCriterios()`, `Turma.lancarNota()`,
`Turma.matriculaPorId()` e na camada de autenticação/autorização.

### Persistência

- `RepositorioJson<T extends Identificavel>` mantém cache em memória, carrega do JSON na inicialização
  (ou usa `seed` se o arquivo não existir).
- `ObjectMapper` (Jackson) serializa/desserializa; `Mapeadores.java` configura para ignorar propriedades
  desconhecidas e serializar campos privados diretamente.
- `persistir()` grava o cache no arquivo. `ServicoProfessorPortal` chama `banco.turmas().persistir()`
  após operações que alteram estado (lançar nota, registrar falta).

### Padrões de projeto

| Padrão | Onde aparece |
|---|---|
| Repository | `RepositorioJson`, abstraindo persistência de entidades `Identificavel` |
| Factory Method (simplificado) | `Ids.gerar(prefixo)`, `Cor.deRotulo(rotulo)`, `StatusIntegralizacao.deRotulo(rotulo)` |
| Strategy (implícito) | `getPapel()` variando comportamento por subclasse em tempo de execução |
| Value Object | `Cor`, `StatusOferta`, `StatusIntegralizacao` — enums imutáveis, comparados por valor |
| Utility Class | `FormatoTempo`, `Ids`, `RegrasAcademicas`, `Mapeadores` |

### Requisitos da disciplina — resumo

| Requisito | Onde está |
|---|---|
| Interfaces | `Identificavel`, `GeradorDeAlerta`, `Avaliavel`, `Repositorio` |
| Classes abstratas | `Pessoa`, `Notificacao` |
| Polimorfismo | `getPapel()`, `getId()`, `gerarAlertas()`, `receberAvaliacao()` |
| Associação | `Professor`–`TurmaLecionada`, `Disciplina`/`Matricula`–`Cor`, `Turma`–`professorId` |
| Agregação | `Disciplina` agregando `Turma`s |
| Composição | `Professor`→`ScoreProfessor`, `Turma`→`Matricula`/`CriterioAvaliacao`/`HorarioAula`, `BancoDeDados`→`RepositorioJson` |
| Exceções | `UnicampusException`, `ValidacaoException`, `PesoInvalidoException`, `MatriculaNaoEncontradaException` |
| Persistência em arquivo | `RepositorioJson` + Jackson, formato JSON |
| Interface gráfica | React/TypeScript (frontend), fora do escopo desta seção |
