package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.FormatoTempo;
import br.unicamp.mc322.unicampus.dominio.Ids;
import br.unicamp.mc322.unicampus.dominio.academico.AtividadeAdmin;
import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.Disciplina;
import br.unicamp.mc322.unicampus.dominio.academico.HorarioAula;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.excecao.RecursoNaoEncontradoException;
import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;
import br.unicamp.mc322.unicampus.persistencia.Seed;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Casos de uso da coordenação (admin): catálogo de disciplinas, criação de
 * turmas (alocando professor, horário e sala; o PDD é do professor),
 * cadastro de professores e visão geral. O feed de "atividade recente" é
 * alimentado pelos próprios serviços a cada operação relevante.
 */
public class ServicoAdmin {

    private final BancoDeDados banco;

    public ServicoAdmin(BancoDeDados banco) {
        this.banco = banco;
    }

    // ------------------------------------------------------------------
    // Visão geral
    // ------------------------------------------------------------------

    public Respostas.VisaoGeral visaoGeral() {
        long disciplinasAtivas = banco.disciplinas()
                .filtrar(d -> d.getStatus() == StatusOferta.ATIVA).size();
        int turmas = banco.turmas().total();
        Set<String> alunosMatriculados = new HashSet<>();
        banco.turmas().listar().forEach(t ->
                t.getRoster().forEach(m -> alunosMatriculados.add(m.getStudentId())));
        int professores = banco.professores().total();

        List<Respostas.VisaoGeral.Cartao> cards = List.of(
                new Respostas.VisaoGeral.Cartao("Disciplinas ativas", String.valueOf(disciplinasAtivas), "+4", "disciplinas"),
                new Respostas.VisaoGeral.Cartao("Turmas no semestre", String.valueOf(turmas), "+2", "turmas"),
                new Respostas.VisaoGeral.Cartao("Alunos matriculados", String.valueOf(alunosMatriculados.size()), "+3", "alunos"),
                new Respostas.VisaoGeral.Cartao("Professores", String.valueOf(professores), "+0", "professores"));

        List<Respostas.VisaoGeral.PeriodoMatricula> grafico = List.of(
                new Respostas.VisaoGeral.PeriodoMatricula("24.1", "2.9k", 2900),
                new Respostas.VisaoGeral.PeriodoMatricula("24.2", "3.1k", 3100),
                new Respostas.VisaoGeral.PeriodoMatricula("25.1", "3.3k", 3300),
                new Respostas.VisaoGeral.PeriodoMatricula("25.2", "3.5k", 3500),
                new Respostas.VisaoGeral.PeriodoMatricula("26.1", "3.8k", 3847));

        List<Respostas.VisaoGeral.Atividade> atividade = banco.atividades().listar().stream()
                .sorted(Comparator.comparingLong(AtividadeAdmin::getCreatedAt).reversed())
                .limit(8)
                .map(a -> new Respostas.VisaoGeral.Atividade(a.getId(), a.getKind(), a.getText(),
                        FormatoTempo.relativo(a.getCreatedAt())))
                .toList();

        return new Respostas.VisaoGeral(cards, grafico, atividade);
    }

    /** Registra um evento no feed de atividade recente do painel. */
    public void registrarAtividade(String kind, String texto) {
        banco.atividades().adicionar(
                new AtividadeAdmin(Ids.gerar("a"), kind, texto, System.currentTimeMillis()));
    }

    // ------------------------------------------------------------------
    // Catálogo de disciplinas
    // ------------------------------------------------------------------

    public List<Respostas.DisciplinaAdmin> listarDisciplinas() {
        return banco.disciplinas().listar().stream().map(this::montarDisciplina).toList();
    }

    public Respostas.DisciplinaAdmin criarDisciplina(Requisicoes.DisciplinaCatalogo p) {
        validarDisciplina(p);
        if (!banco.disciplinas().filtrar(d -> d.getCode().equalsIgnoreCase(p.code())).isEmpty()) {
            throw new ValidacaoException("Já existe uma disciplina com o código " + p.code());
        }
        Disciplina d = new Disciplina(Ids.gerar("ac"), p.code(), p.name(), p.area(),
                p.credits(), p.color() == null ? Cor.paraCodigo(p.code()) : p.color(),
                StatusOferta.ATIVA);
        banco.disciplinas().adicionar(d);
        registrarAtividade("criacao", "Disciplina " + d.getCode() + " criada por você");
        return montarDisciplina(d);
    }

    public Respostas.DisciplinaAdmin atualizarDisciplina(String id, Requisicoes.DisciplinaCatalogo p) {
        validarDisciplina(p);
        Disciplina d = banco.disciplinas().buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Disciplina não encontrada"));
        d.atualizar(p.code(), p.name(), p.area(), p.credits(),
                p.color() == null ? d.getColor() : p.color());
        banco.disciplinas().persistir();
        return montarDisciplina(d);
    }

    public void removerDisciplina(String id) {
        banco.disciplinas().remover(id);
    }

    private void validarDisciplina(Requisicoes.DisciplinaCatalogo p) {
        if (p.code() == null || p.code().isBlank() || p.name() == null || p.name().isBlank()) {
            throw new ValidacaoException("Código e nome da disciplina são obrigatórios");
        }
        if (p.credits() <= 0) {
            throw new ValidacaoException("Créditos devem ser maiores que zero");
        }
    }

    private Respostas.DisciplinaAdmin montarDisciplina(Disciplina d) {
        List<Turma> turmasDa = banco.turmas()
                .filtrar(t -> t.getCourseCode().equalsIgnoreCase(d.getCode()));
        int alunos = turmasDa.stream().mapToInt(t -> t.getRoster().size()).sum();
        return new Respostas.DisciplinaAdmin(d.getId(), d.getCode(), d.getName(), d.getArea(),
                d.getCredits(), d.getColor(), turmasDa.size(), alunos, d.getStatus());
    }

    // ------------------------------------------------------------------
    // Turmas (alocação de professor e horário; sem PDD)
    // ------------------------------------------------------------------

    public List<Turma> listarTurmas() {
        return banco.turmas().listar();
    }

    public Turma criarTurma(Requisicoes.TurmaAlocacao p) {
        Disciplina d = disciplinaPorCodigo(p.courseCode());
        Professor prof = professorPorId(p.professorId());
        Turma t = new Turma(Ids.gerar("turma"), d,
                p.className() == null || p.className().isBlank() ? "Turma A" : p.className(),
                prof.getId(), prof.getName(), montarSlots(p.slots()), StatusOferta.ATIVA);
        banco.turmas().adicionar(t);
        registrarAtividade("alocacao",
                "Prof. " + prof.getName() + " alocado(a) em " + d.getCode() + " · " + t.getClassName());
        return t;
    }

    public Turma atualizarTurma(String id, Requisicoes.TurmaAlocacao p) {
        Turma t = banco.turmas().buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada"));
        Disciplina d = disciplinaPorCodigo(p.courseCode());
        Professor prof = professorPorId(p.professorId());
        t.realocar(d, p.className(), prof.getId(), prof.getName(), montarSlots(p.slots()));
        banco.turmas().persistir();
        return t;
    }

    public void removerTurma(String id) {
        banco.turmas().remover(id);
    }

    private List<HorarioAula> montarSlots(List<Requisicoes.HorarioNovo> slots) {
        List<HorarioAula> lista = new ArrayList<>();
        if (slots != null) {
            int i = 1;
            for (Requisicoes.HorarioNovo s : slots) {
                lista.add(new HorarioAula("s" + i++, s.weekday(), s.start(), s.end(), s.room()));
            }
        }
        return lista;
    }

    private Disciplina disciplinaPorCodigo(String codigo) {
        return banco.disciplinas().filtrar(d -> d.getCode().equalsIgnoreCase(codigo))
                .stream().findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Disciplina " + codigo + " não está no catálogo"));
    }

    private Professor professorPorId(String id) {
        return banco.professores().buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
    }

    // ------------------------------------------------------------------
    // Professores (cadastro e gestão)
    // ------------------------------------------------------------------

    public Professor criarProfessor(Requisicoes.ProfessorCadastro p) {
        if (p.name() == null || p.name().isBlank()) {
            throw new ValidacaoException("Nome do professor é obrigatório");
        }
        String ra = proximoRaDeProfessor();
        Professor prof = new Professor(Ids.gerar("prof"), p.name().trim(),
                p.email() == null ? "" : p.email().trim(), ra, Seed.SENHA_PADRAO,
                p.department() == null ? "" : p.department().trim(), List.of());
        banco.professores().adicionar(prof);
        registrarAtividade("criacao", "Professor(a) " + prof.getName() + " cadastrado(a)");
        return prof;
    }

    public Professor atualizarProfessor(String id, Requisicoes.ProfessorCadastro p) {
        Professor prof = professorPorId(id);
        if (p.name() != null && !p.name().isBlank()) {
            prof.setName(p.name().trim());
        }
        if (p.email() != null) {
            prof.setEmail(p.email().trim());
        }
        if (p.department() != null) {
            prof.setDepartment(p.department().trim());
        }
        banco.professores().persistir();
        return prof;
    }

    public void removerProfessor(String id) {
        boolean lecionando = !banco.turmas().filtrar(t -> t.lecionadaPor(id)).isEmpty();
        if (lecionando) {
            throw new ValidacaoException(
                    "Este professor está alocado em turmas — realoque as turmas antes de removê-lo");
        }
        banco.professores().remover(id);
    }

    /** RA sequencial para contas de professor criadas pela coordenação. */
    private String proximoRaDeProfessor() {
        int maior = banco.professores().listar().stream()
                .map(Professor::getRa)
                .filter(ra -> ra != null && ra.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max().orElse(100);
        return String.format("%06d", maior + 1);
    }

    // ------------------------------------------------------------------
    // Alunos (visão só leitura)
    // ------------------------------------------------------------------

    public List<Respostas.AlunoAdmin> listarAlunos() {
        return banco.alunos().listar().stream()
                .map(a -> new Respostas.AlunoAdmin(a.getId(), a.getName(), a.getRa(),
                        a.getCourse(), a.getSemester(), a.getCr(), a.getCp()))
                .toList();
    }

    /** Acesso do serviço de aluno para registrar eventos de matrícula. */
    List<Aluno> alunos() {
        return banco.alunos().listar();
    }
}
