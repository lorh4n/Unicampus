package br.unicamp.mc322.unicampus.dominio.academico;

/**
 * Um critério do PDD de uma turma ({@code GradeCriterion} no contrato):
 * rótulo e peso (0..100). Os campos {@code grade}/{@code done} existem para o
 * PDD "de referência" da turma; a nota de cada aluno fica na {@link Matricula}.
 * Um critério não existe fora da sua turma.
 */
public class CriterioAvaliacao {

    private String id;
    private String label;
    private int weight;
    private Double grade;
    private String date;
    private boolean done;

    protected CriterioAvaliacao() {
    }

    public CriterioAvaliacao(String id, String label, int weight, Double grade, String date, boolean done) {
        this.id = id;
        this.label = label;
        this.weight = weight;
        this.grade = grade;
        this.date = date;
        this.done = done;
    }

    /** Critério novo (sem nota lançada), com id derivado do rótulo. */
    public static CriterioAvaliacao novo(String label, int weight) {
        return new CriterioAvaliacao(idParaRotulo(label), label, weight, null, null, false);
    }

    public static String idParaRotulo(String label) {
        return label.trim().toLowerCase().replaceAll("\\s+", "-");
    }

    public String getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public int getWeight() {
        return weight;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
        this.done = grade != null;
    }

    public String getDate() {
        return date;
    }

    public boolean isDone() {
        return done;
    }

    /** Cópia com a nota de um aluno específico (visão do aluno sobre o PDD). */
    public CriterioAvaliacao comNotaDoAluno(Double notaDoAluno) {
        return new CriterioAvaliacao(id, label, weight, notaDoAluno, date, notaDoAluno != null);
    }
}
