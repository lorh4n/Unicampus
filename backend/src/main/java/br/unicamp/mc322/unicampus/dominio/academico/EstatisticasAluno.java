package br.unicamp.mc322.unicampus.dominio.academico;

import java.util.List;

/** Estatísticas históricas do aluno ({@code Stats} no contrato). */
public record EstatisticasAluno(
        List<SemestreCr> crHistory,
        int avgAttendance,
        int approvedCount) {

    /** Um ponto do histórico de CR ({@code SemesterStat}). */
    public record SemestreCr(String semester, double cr) {
    }
}
