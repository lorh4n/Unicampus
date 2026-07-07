# Unicampus — Diagrama de Classes (UML)

> Renderiza direto no GitHub e no VSCode (extensão Markdown Preview Mermaid).
> A versão PlantUML (para o relatório) está em [`diagrama-classes.puml`](diagrama-classes.puml).

## Domínio — pessoas, turmas e avaliação

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

## Notificações (polimorfismo) e exceções

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

## Persistência e camadas

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

**Fluxo típico** (professor lança falta): `PUT/POST /api/professor/turmas/:id/...` →
`ApiServer` valida token e papel → `ServicoProfessorPortal` confere que a turma é do
professor → `Turma.registrarFalta()` (domínio) → `Repositorio.persistir()` grava
`turmas.json` → `Turma.gerarAlertas()` (interface `GeradorDeAlerta`) produz uma
`NotificacaoFalta` para o aluno → gravada em `notificacoes.json`.
