package br.unicamp.mc322.unicampus.api.dto;

import br.unicamp.mc322.unicampus.dominio.academico.Cor;

import java.util.List;

/**
 * Corpos de requisição aceitos pela API, espelhando os payloads definidos em
 * {@code frontend/src/models/index.ts} e {@code data/repositories/types.ts}.
 */
public final class Requisicoes {

    private Requisicoes() {
    }

    public record Login(String ra, String password) {
    }

    public record Cadastro(String name, String ra, String course, String password,
                           List<String> enrolledCodes, List<Concluida> completed) {

        /** Disciplina já cursada e sua nota final (0–10), informada no cadastro. */
        public record Concluida(String code, double grade) {
        }
    }

    public record ResetSenha(String ra) {
    }

    public record AtualizarPerfil(String name, String email) {
    }

    /** Payload legado do CourseForm — só a cor é preferência do aluno. */
    public record CursoAluno(Cor color) {
    }

    public record ContadorFaltas(int value) {
    }

    public record MatricularCodigos(List<String> codes) {
    }

    public record MatricularTurma(String turmaId, Cor color) {
    }

    public record DisciplinaCatalogo(String code, String area, String name, int credits, Cor color) {
    }

    public record HorarioNovo(int weekday, String start, String end, String room) {
    }

    public record TurmaAlocacao(String courseCode, String className, String professorId,
                                List<HorarioNovo> slots) {
    }

    public record CriterioPeso(String label, int weight) {
    }

    public record CriteriosPdd(List<CriterioPeso> criteria) {
    }

    public record NotaLancamento(String criterionId, Double grade) {
    }

    public record AvaliacaoEnvio(String professorId, double didactics, double organization,
                                 double accessibility, double material) {
    }

    public record ProfessorCadastro(String name, String email, String department) {
    }
}
