package br.unicamp.mc322.unicampus.api;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.excecao.AcessoNegadoException;
import br.unicamp.mc322.unicampus.dominio.excecao.UnicampusException;
import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Coordenador;
import br.unicamp.mc322.unicampus.dominio.pessoa.Pessoa;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;
import br.unicamp.mc322.unicampus.persistencia.Mapeadores;
import br.unicamp.mc322.unicampus.servico.ServicoAdmin;
import br.unicamp.mc322.unicampus.servico.ServicoAluno;
import br.unicamp.mc322.unicampus.servico.ServicoAutenticacao;
import br.unicamp.mc322.unicampus.servico.ServicoBusca;
import br.unicamp.mc322.unicampus.servico.ServicoNotificacoes;
import br.unicamp.mc322.unicampus.servico.ServicoProfessorPortal;
import br.unicamp.mc322.unicampus.servico.ServicoProfessores;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import io.javalin.json.JavalinJackson;

/**
 * Camada HTTP (Javalin) da API REST consumida pelo frontend. Faz apenas
 * roteamento, autenticação por token Bearer, checagem de papel e tradução
 * de exceções para status HTTP; as regras de negócio ficam nos serviços.
 */
public class ApiServer {

    private final ServicoAutenticacao auth;
    private final ServicoAluno alunoSrv;
    private final ServicoAdmin adminSrv;
    private final ServicoProfessorPortal portalSrv;
    private final ServicoProfessores professoresSrv;
    private final ServicoBusca buscaSrv;
    private final ServicoNotificacoes notificacoesSrv;
    private final BancoDeDados banco;

    public ApiServer(BancoDeDados banco) {
        this.banco = banco;
        this.auth = new ServicoAutenticacao(banco);
        this.adminSrv = new ServicoAdmin(banco);
        this.alunoSrv = new ServicoAluno(banco, adminSrv);
        this.notificacoesSrv = new ServicoNotificacoes(banco);
        this.portalSrv = new ServicoProfessorPortal(banco, notificacoesSrv, adminSrv);
        this.professoresSrv = new ServicoProfessores(banco);
        this.buscaSrv = new ServicoBusca(banco);
    }

    public Javalin iniciar(int porta) {
        Javalin app = Javalin.create(config -> {
            config.showJavalinBanner = false;
            config.jsonMapper(new JavalinJackson().updateMapper(Mapeadores::configurarApi));
            // CORS liberado para o dev do Vite (5173) e demais origens de demonstração
            config.bundledPlugins.enableCors(cors -> cors.addRule(regra -> {
                regra.anyHost();
            }));
        });

        configurarErros(app);
        configurarAutenticacao(app);
        registrarRotas(app);

        app.start(porta);
        return app;
    }

    // ------------------------------------------------------------------
    // Middleware
    // ------------------------------------------------------------------

    private void configurarAutenticacao(Javalin app) {
        app.before("/api/*", ctx -> {
            if (ctx.method() == HandlerType.OPTIONS || ctx.path().startsWith("/api/auth/")) {
                return;
            }
            // o catálogo de oferecimentos é público: a tela de cadastro consulta antes do login
            if (ctx.method() == HandlerType.GET && ctx.path().equals("/api/offerings")) {
                return;
            }
            String header = ctx.header("Authorization");
            String token = header != null && header.startsWith("Bearer ")
                    ? header.substring("Bearer ".length())
                    : null;
            ctx.attribute("usuario", auth.resolver(token));
        });
    }

    private void configurarErros(Javalin app) {
        // cada exceção de negócio define seu próprio status HTTP
        app.exception(UnicampusException.class, (e, ctx) ->
                ctx.status(e.getStatusHttp()).json(new Respostas.Mensagem(e.getMessage())));
        app.exception(Exception.class, (e, ctx) ->
                ctx.status(500).json(new Respostas.Mensagem("Erro interno: " + e.getMessage())));
    }

    private Pessoa usuario(Context ctx) {
        return ctx.attribute("usuario");
    }

    private Aluno aluno(Context ctx) {
        if (usuario(ctx) instanceof Aluno a) {
            return a;
        }
        throw new AcessoNegadoException("Operação exclusiva de alunos");
    }

    private Professor professor(Context ctx) {
        if (usuario(ctx) instanceof Professor p) {
            return p;
        }
        throw new AcessoNegadoException("Operação exclusiva de professores");
    }

    private void exigirAdmin(Context ctx) {
        if (!(usuario(ctx) instanceof Coordenador)) {
            throw new AcessoNegadoException("Operação exclusiva da coordenação");
        }
    }

    // ------------------------------------------------------------------
    // Rotas
    // ------------------------------------------------------------------

    private void registrarRotas(Javalin app) {
        app.get("/", ctx -> ctx.result("Unicampus API - MC322. Endpoints sob /api."));

        // ---- Autenticação -------------------------------------------------
        app.post("/api/auth/login", ctx ->
                ctx.json(auth.login(ctx.bodyAsClass(Requisicoes.Login.class))));
        app.post("/api/auth/signup", ctx ->
                ctx.json(auth.cadastrar(ctx.bodyAsClass(Requisicoes.Cadastro.class))));
        app.post("/api/auth/password-reset", ctx -> {
            auth.solicitarResetDeSenha(ctx.bodyAsClass(Requisicoes.ResetSenha.class).ra());
            ctx.status(204);
        });

        // ---- Perfil (qualquer papel) -------------------------------------
        app.get("/api/me", ctx -> ctx.json(usuario(ctx).montarPerfilSessao()));
        app.put("/api/me", ctx -> {
            Requisicoes.AtualizarPerfil req = ctx.bodyAsClass(Requisicoes.AtualizarPerfil.class);
            Pessoa p = usuario(ctx);
            if (req.name() != null && !req.name().isBlank()) {
                p.setName(req.name().trim());
            }
            if (req.email() != null && !req.email().isBlank()) {
                p.setEmail(req.email().trim());
            }
            persistirPessoa(p);
            ctx.json(p.montarPerfilSessao());
        });

        // ---- Aluno: disciplinas (derivadas das turmas) ---------------------
        app.get("/api/courses", ctx -> ctx.json(alunoSrv.cursos(aluno(ctx))));
        app.get("/api/courses/{id}", ctx ->
                ctx.json(alunoSrv.curso(aluno(ctx), ctx.pathParam("id"))));
        app.post("/api/courses", ctx -> {
            throw new ValidacaoException(
                    "Criação livre de disciplina foi descontinuada — matricule-se em uma turma ofertada");
        });
        app.put("/api/courses/{id}", ctx -> {
            Requisicoes.CursoAluno req = ctx.bodyAsClass(Requisicoes.CursoAluno.class);
            ctx.json(alunoSrv.definirCor(aluno(ctx), ctx.pathParam("id"), req.color()));
        });
        app.delete("/api/courses/{id}", ctx -> {
            alunoSrv.trancar(aluno(ctx), ctx.pathParam("id"));
            ctx.status(204);
        });
        app.put("/api/courses/{id}/self-absences", ctx -> {
            Requisicoes.ContadorFaltas req = ctx.bodyAsClass(Requisicoes.ContadorFaltas.class);
            ctx.json(alunoSrv.definirFaltasPessoais(aluno(ctx), ctx.pathParam("id"), req.value()));
        });

        // ---- Aluno: matrícula ----------------------------------------------
        app.get("/api/offerings", ctx -> ctx.json(alunoSrv.ofertas()));
        app.post("/api/enrollments", ctx -> {
            Requisicoes.MatricularCodigos req = ctx.bodyAsClass(Requisicoes.MatricularCodigos.class);
            ctx.json(alunoSrv.matricularPorCodigos(aluno(ctx), req.codes()));
        });
        app.get("/api/enrollments/available", ctx ->
                ctx.json(alunoSrv.turmasDisponiveis(aluno(ctx))));
        app.post("/api/enrollments/turma", ctx -> {
            Requisicoes.MatricularTurma req = ctx.bodyAsClass(Requisicoes.MatricularTurma.class);
            ctx.json(alunoSrv.matricularEmTurma(aluno(ctx), req.turmaId(), req.color()));
        });

        // ---- Aluno: grade, currículo, estatísticas -------------------------
        app.get("/api/schedule", ctx -> ctx.json(alunoSrv.cursos(aluno(ctx))));
        app.get("/api/curriculum", ctx -> ctx.json(alunoSrv.curriculo()));
        app.get("/api/stats", ctx -> ctx.json(alunoSrv.estatisticas()));

        // ---- Notificações (qualquer papel) ---------------------------------
        app.get("/api/notifications", ctx -> ctx.json(notificacoesSrv.listar(usuario(ctx))));
        app.post("/api/notifications/{id}/read", ctx -> {
            notificacoesSrv.alternarLida(usuario(ctx), ctx.pathParam("id"));
            ctx.status(204);
        });
        app.post("/api/notifications/read-all", ctx -> {
            notificacoesSrv.marcarTodasLidas(usuario(ctx));
            ctx.status(204);
        });

        // ---- Busca ----------------------------------------------------------
        app.get("/api/search", ctx -> ctx.json(buscaSrv.buscar(usuario(ctx),
                ctx.queryParam("q"), ctx.queryParam("tab"))));

        // ---- Professores: catálogo público + avaliação ----------------------
        app.get("/api/professors", ctx -> ctx.json(professoresSrv.listar()));
        app.get("/api/professors/{id}", ctx ->
                ctx.json(professoresSrv.porId(ctx.pathParam("id"))));
        app.get("/api/professors/{id}/profile", ctx ->
                ctx.json(professoresSrv.perfil(ctx.pathParam("id"))));
        app.post("/api/professors/{id}/rate", ctx -> {
            Requisicoes.AvaliacaoEnvio corpo = ctx.bodyAsClass(Requisicoes.AvaliacaoEnvio.class);
            Requisicoes.AvaliacaoEnvio envio = new Requisicoes.AvaliacaoEnvio(
                    ctx.pathParam("id"), corpo.didactics(), corpo.organization(),
                    corpo.accessibility(), corpo.material());
            ctx.json(professoresSrv.avaliar(aluno(ctx), envio));
        });

        // ---- Professores: cadastro (só coordenação) --------------------------
        app.post("/api/professors", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.criarProfessor(ctx.bodyAsClass(Requisicoes.ProfessorCadastro.class)));
        });
        app.put("/api/professors/{id}", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.atualizarProfessor(ctx.pathParam("id"),
                    ctx.bodyAsClass(Requisicoes.ProfessorCadastro.class)));
        });
        app.delete("/api/professors/{id}", ctx -> {
            exigirAdmin(ctx);
            adminSrv.removerProfessor(ctx.pathParam("id"));
            ctx.status(204);
        });

        // ---- Portal do professor (só as próprias turmas) ---------------------
        app.get("/api/professor/turmas", ctx -> ctx.json(portalSrv.minhasTurmas(professor(ctx))));
        app.get("/api/professor/turmas/{id}", ctx ->
                ctx.json(portalSrv.minhaTurma(professor(ctx), ctx.pathParam("id"))));
        app.put("/api/professor/turmas/{id}/criteria", ctx ->
                ctx.json(portalSrv.salvarCriterios(professor(ctx), ctx.pathParam("id"),
                        ctx.bodyAsClass(Requisicoes.CriteriosPdd.class))));
        app.put("/api/professor/turmas/{id}/roster/{rosterId}/grade", ctx ->
                ctx.json(portalSrv.lancarNota(professor(ctx), ctx.pathParam("id"),
                        ctx.pathParam("rosterId"),
                        ctx.bodyAsClass(Requisicoes.NotaLancamento.class))));
        app.post("/api/professor/turmas/{id}/roster/{rosterId}/absence", ctx ->
                ctx.json(portalSrv.registrarFalta(professor(ctx), ctx.pathParam("id"),
                        ctx.pathParam("rosterId"))));
        app.get("/api/professor/me/score", ctx -> ctx.json(portalSrv.meuScore(professor(ctx))));

        // ---- Painel da coordenação -------------------------------------------
        app.get("/api/admin/overview", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.visaoGeral());
        });
        app.get("/api/admin/courses", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.listarDisciplinas());
        });
        app.post("/api/admin/courses", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.criarDisciplina(ctx.bodyAsClass(Requisicoes.DisciplinaCatalogo.class)));
        });
        app.put("/api/admin/courses/{id}", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.atualizarDisciplina(ctx.pathParam("id"),
                    ctx.bodyAsClass(Requisicoes.DisciplinaCatalogo.class)));
        });
        app.delete("/api/admin/courses/{id}", ctx -> {
            exigirAdmin(ctx);
            adminSrv.removerDisciplina(ctx.pathParam("id"));
            ctx.status(204);
        });
        app.get("/api/admin/turmas", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.listarTurmas());
        });
        app.post("/api/admin/turmas", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.criarTurma(ctx.bodyAsClass(Requisicoes.TurmaAlocacao.class)));
        });
        app.put("/api/admin/turmas/{id}", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.atualizarTurma(ctx.pathParam("id"),
                    ctx.bodyAsClass(Requisicoes.TurmaAlocacao.class)));
        });
        app.delete("/api/admin/turmas/{id}", ctx -> {
            exigirAdmin(ctx);
            adminSrv.removerTurma(ctx.pathParam("id"));
            ctx.status(204);
        });
        app.get("/api/admin/students", ctx -> {
            exigirAdmin(ctx);
            ctx.json(adminSrv.listarAlunos());
        });
    }

    /** Persiste a pessoa no repositório correspondente ao seu tipo concreto. */
    private void persistirPessoa(Pessoa p) {
        if (p instanceof Aluno) {
            banco.alunos().persistir();
        } else if (p instanceof Professor) {
            banco.professores().persistir();
        } else {
            banco.coordenadores().persistir();
        }
    }
}
