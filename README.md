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
