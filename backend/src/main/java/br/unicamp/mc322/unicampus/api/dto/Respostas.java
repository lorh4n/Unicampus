package br.unicamp.mc322.unicampus.api.dto;

import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.CriterioAvaliacao;
import br.unicamp.mc322.unicampus.dominio.academico.HorarioAula;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.pessoa.PerfilSessao;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.dominio.pessoa.TurmaLecionada;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Corpos de resposta da API, espelhando os modelos de
 * {@code frontend/src/models/index.ts} (mesmos nomes de campo).
 */
public final class Respostas {

    private Respostas() {
    }

    /** {@code AuthSession} do contrato. */
    public record Sessao(String token, PerfilSessao student) {
    }

    /** {@code Course} do contrato — a visão do ALUNO sobre uma turma cursada. */
    public record Curso(
            String id,
            String code,
            String name,
            int credits,
            Cor color,
            String professor,
            String professorId,
            String className,
            String status,
            Double average,
            Integer attendance,
            int absences,
            int selfAbsences,
            int absenceLimit,
            int totalHours,
            List<CriterioAvaliacao> criteria,
            List<HorarioAula> slots) {
    }

    /** {@code OfferedCourse} do contrato. */
    public record Oferta(String code, String name, int credits) {
    }

    /** {@code AdminCourse} do contrato (contadores derivados das turmas). */
    public record DisciplinaAdmin(
            String id,
            String code,
            String name,
            String area,
            int credits,
            Cor color,
            int classCount,
            int studentCount,
            StatusOferta status) {
    }

    /** {@code AdminStudent} do contrato. */
    public record AlunoAdmin(String id, String name, String ra, String course,
                             String semester, double cr, double cp) {
    }

    /** {@code SearchResult} do contrato. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ResultadoBusca(
            String code,
            String name,
            String detail,
            String status,
            Cor color,
            Double score,
            String professorId) {
    }

    /** {@code ProfessorProfile} do contrato. */
    public record PerfilProfessor(
            Professor professor,
            List<TurmaLecionada> current,
            List<SemestreLecionado> pastBySemester) {

        public record SemestreLecionado(String semester, List<TurmaLecionada> items) {
        }
    }

    /** {@code AdminOverview} do contrato. */
    public record VisaoGeral(List<Cartao> cards, List<PeriodoMatricula> enrollmentChart,
                             List<Atividade> activity) {

        public record Cartao(String label, String value, String delta, String kind) {
        }

        public record PeriodoMatricula(String period, String label, int value) {
        }

        public record Atividade(String id, String kind, String text, String time) {
        }
    }

    public record Mensagem(String message) {
    }
}
