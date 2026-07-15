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

```bash
# 1. Backend (http://localhost:8080/api)
cd backend && ./gradlew run

# 2. Frontend (http://localhost:5173) — em outro terminal
cd frontend
echo 'VITE_API_URL=http://localhost:8080/api' > .env
npm install && npm run dev
```

Contas de demonstração (senha `123456`): aluna `247195` · professora `000101` ·
coordenação `000042`. Sem o `.env`, o frontend roda sozinho em modo mock.

Documentação: [`frontend/README.md`](frontend/README.md) (interface e contrato da API),
[`frontend/BUSINESS_RULES.md`](frontend/BUSINESS_RULES.md) (regras de negócio e papéis),
[`backend/README.md`](backend/README.md) (arquitetura POO, requisitos do enunciado) e
[`backend/docs/`](backend/docs/) (diagramas UML).

## 🏗️ Arquitetura Orientada a Objetos (Backend)

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

**Agregação** — `Turma` agrega `Matricula`s (remover a turma não apaga o aluno, só a associação) e
`CriterioAvaliacao`s (reutilizáveis fora do contexto de uma turma).

**Composição** — não há exemplo forte no projeto atual; `CriterioAvaliacao` e `Matricula` são gerenciados
como listas/mapas, o que caracteriza agregação, não composição estrita.

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
| `UnicampusException` | — | Base de todas as exceções de negócio |
| `ValidacaoException` | 400 | Erros de validação de entrada |
| `PesoInvalidoException` | 400 | Soma dos pesos dos critérios ≠ 100% |
| `MatriculaNaoEncontradaException` | 404 | Matrícula não encontrada |

Usadas em `Turma.definirCriterios()`, `Turma.lancarNota()` e `Turma.matriculaPorId()`.

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
| Associação | `Turma`–`CriterioAvaliacao`/`Matricula`, `Professor`–`TurmaLecionada`, `Disciplina`/`Matricula`–`Cor` |
| Agregação | `Turma` agregando `Matricula` e `CriterioAvaliacao` |
| Composição | Não implementada de forma estrita neste projeto |
| Exceções | `UnicampusException`, `ValidacaoException`, `PesoInvalidoException`, `MatriculaNaoEncontradaException` |
| Persistência em arquivo | `RepositorioJson` + Jackson, formato JSON |
| Interface gráfica | React/TypeScript (frontend), fora do escopo desta seção |
