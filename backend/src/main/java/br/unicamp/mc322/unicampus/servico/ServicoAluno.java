package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.RegrasAcademicas;
import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.Curriculo;
import br.unicamp.mc322.unicampus.dominio.academico.Disciplina;
import br.unicamp.mc322.unicampus.dominio.academico.EstatisticasAluno;
import br.unicamp.mc322.unicampus.dominio.academico.Matricula;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.excecao.RecursoNaoEncontradoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Casos de uso do aluno. A "disciplina do aluno" ({@code Course} no
 * frontend) não é uma entidade própria: é uma visão derivada da {@link Turma}
 * em que ele está matriculado, então as notas e faltas que o professor lança
 * são as que o aluno vê.
 */
public class ServicoAluno {

    private final BancoDeDados banco;
    private final ServicoAdmin atividades;

    public ServicoAluno(BancoDeDados banco, ServicoAdmin atividades) {
        this.banco = banco;
        this.atividades = atividades;
    }

    // ------------------------------------------------------------------
    // Disciplinas cursadas (derivadas das turmas)
    // ------------------------------------------------------------------

    public List<Respostas.Curso> cursos(Aluno aluno) {
        List<Respostas.Curso> lista = new ArrayList<>();
        for (Turma t : banco.turmas().listar()) {
            t.encontrarMatriculaDoAluno(aluno.getId())
                    .ifPresent(m -> lista.add(montarCurso(t, m)));
        }
        return lista;
    }

    public Respostas.Curso curso(Aluno aluno, String turmaId) {
        Turma t = turmaPorId(turmaId);
        Matricula m = t.encontrarMatriculaDoAluno(aluno.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Você não está matriculado(a) nesta turma"));
        return montarCurso(t, m);
    }

    /** Trancamento: remove a matrícula do aluno na turma. */
    public void trancar(Aluno aluno, String turmaId) {
        Turma t = turmaPorId(turmaId);
        t.desmatricular(aluno.getId());
        banco.turmas().persistir();
        atividades.registrarAtividade("matricula",
                aluno.getName() + " trancou " + t.getCourseCode() + " · " + t.getClassName());
    }

    /** Contador pessoal de faltas do aluno (BUSINESS_RULES.md §4.2). */
    public Respostas.Curso definirFaltasPessoais(Aluno aluno, String turmaId, int valor) {
        Turma t = turmaPorId(turmaId);
        Matricula m = matriculaDe(t, aluno);
        m.setSelfAbsences(valor);
        banco.turmas().persistir();
        return montarCurso(t, m);
    }

    /** Preferência visual do aluno: cor de identificação da disciplina. */
    public Respostas.Curso definirCor(Aluno aluno, String turmaId, Cor cor) {
        Turma t = turmaPorId(turmaId);
        Matricula m = matriculaDe(t, aluno);
        if (cor != null) {
            m.setColor(cor);
        }
        banco.turmas().persistir();
        return montarCurso(t, m);
    }

    // ------------------------------------------------------------------
    // Matrícula em turmas ofertadas
    // ------------------------------------------------------------------

    /** Catálogo de oferecimentos do semestre (um por disciplina com turma ativa). */
    public List<Respostas.Oferta> ofertas() {
        Map<String, Respostas.Oferta> porCodigo = new LinkedHashMap<>();
        for (Turma t : banco.turmas().filtrar(x -> x.getStatus() == StatusOferta.ATIVA)) {
            porCodigo.computeIfAbsent(t.getCourseCode(), code ->
                    new Respostas.Oferta(code, t.getCourseName(), creditosDe(code, t.getTotalHours())));
        }
        return new ArrayList<>(porCodigo.values());
    }

    /** Turmas ativas em que o aluno ainda NÃO está matriculado. */
    public List<Turma> turmasDisponiveis(Aluno aluno) {
        return banco.turmas().filtrar(t -> t.getStatus() == StatusOferta.ATIVA
                && t.encontrarMatriculaDoAluno(aluno.getId()).isEmpty());
    }

    /** Matricula o aluno em uma turma existente (PDD/professor/horário vêm dela). */
    public Respostas.Curso matricularEmTurma(Aluno aluno, String turmaId, Cor cor) {
        Turma t = turmaPorId(turmaId);
        Matricula m = t.matricular(aluno, cor == null ? Cor.paraCodigo(t.getCourseCode()) : cor);
        banco.turmas().persistir();
        atividades.registrarAtividade("matricula",
                aluno.getName() + " matriculou-se em " + t.getCourseCode() + " · " + t.getClassName());
        return montarCurso(t, m);
    }

    /** Onboarding: matricula por códigos de disciplina (primeira turma ativa de cada). */
    public List<Respostas.Curso> matricularPorCodigos(Aluno aluno, List<String> codigos) {
        if (codigos != null) {
            for (String codigo : codigos) {
                banco.turmas().filtrar(t -> t.getStatus() == StatusOferta.ATIVA
                                && t.getCourseCode().equalsIgnoreCase(codigo)
                                && t.encontrarMatriculaDoAluno(aluno.getId()).isEmpty())
                        .stream().findFirst()
                        .ifPresent(t -> {
                            t.matricular(aluno, Cor.paraCodigo(codigo));
                            banco.turmas().persistir();
                        });
            }
        }
        return cursos(aluno);
    }

    // ------------------------------------------------------------------
    // Currículo e estatísticas
    // ------------------------------------------------------------------

    /** Currículo com a regra de integralização aplicada (§4.5). */
    public Curriculo curriculo() {
        Curriculo c = banco.curriculo().get();
        c.aplicarIntegralizacao();
        return c;
    }

    public EstatisticasAluno estatisticas() {
        return banco.estatisticas().get();
    }

    // ------------------------------------------------------------------
    // Montagem da visão do aluno
    // ------------------------------------------------------------------

    private Respostas.Curso montarCurso(Turma t, Matricula m) {
        Double media = t.mediaDoAluno(m);
        int frequencia = RegrasAcademicas.frequenciaPercentual(m.getAbsences(), t.getTotalHours());
        return new Respostas.Curso(
                t.getId(),
                t.getCourseCode(),
                t.getCourseName(),
                creditosDe(t.getCourseCode(), t.getTotalHours()),
                m.getColor(),
                t.getProfessorName(),
                t.getProfessorId(),
                t.getClassName(),
                "cursando",
                media,
                frequencia,
                m.getAbsences(),
                m.getSelfAbsences(),
                t.getAbsenceLimit(),
                t.getTotalHours(),
                t.getCriteria().stream()
                        .map(c -> c.comNotaDoAluno(m.getGrades().get(c.getId())))
                        .toList(),
                t.getSlots());
    }

    private int creditosDe(String courseCode, int totalHours) {
        return banco.disciplinas().filtrar(d -> d.getCode().equalsIgnoreCase(courseCode))
                .stream().findFirst()
                .map(Disciplina::getCredits)
                .orElse(Math.max(2, totalHours / 15));
    }

    private Turma turmaPorId(String id) {
        return banco.turmas().buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada"));
    }

    private Matricula matriculaDe(Turma t, Aluno aluno) {
        return t.encontrarMatriculaDoAluno(aluno.getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Você não está matriculado(a) nesta turma"));
    }
}
