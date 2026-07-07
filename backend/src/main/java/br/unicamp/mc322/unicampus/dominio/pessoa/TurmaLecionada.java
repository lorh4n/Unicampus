package br.unicamp.mc322.unicampus.dominio.pessoa;

/** Item do histórico docente: uma turma lecionada em um semestre. */
public record TurmaLecionada(
        String semester,
        String courseCode,
        String courseName,
        String className) {
}
