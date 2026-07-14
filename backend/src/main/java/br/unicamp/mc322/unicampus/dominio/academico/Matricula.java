package br.unicamp.mc322.unicampus.dominio.academico;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Matrícula de um aluno em uma turma ({@code RosterEntry} no contrato).
 * Só existe dentro de uma {@link Turma}: guarda as notas lançadas pelo
 * professor, as faltas oficiais e os dados que são preferência do aluno
 * (cor de identificação e contador pessoal de faltas).
 */
public class Matricula {

    private String id;
    private String studentId;
    private String studentName;
    private String studentRA;
    private Map<String, Double> grades = new HashMap<>();
    private int absences;
    private int selfAbsences;
    private Cor color = Cor.LARANJA;

    protected Matricula() {
    }

    public Matricula(String id, String studentId, String studentName, String studentRA,
                     Map<String, Double> grades, int absences, Cor color) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRA = studentRA;
        this.grades = new HashMap<>(grades);
        this.absences = absences;
        this.selfAbsences = absences;
        this.color = color;
    }

    /** Matrícula nova: todas as notas dos critérios da turma ainda por lançar. */
    public static Matricula nova(String id, String studentId, String studentName, String studentRA,
                                 List<CriterioAvaliacao> criterios, Cor color) {
        Map<String, Double> semNotas = new HashMap<>();
        for (CriterioAvaliacao c : criterios) {
            semNotas.put(c.getId(), null);
        }
        return new Matricula(id, studentId, studentName, studentRA, semNotas, 0, color);
    }

    /** Professor lança (ou remove, com {@code null}) a nota de um critério. */
    public void lancarNota(String criterionId, Double nota) {
        grades.put(criterionId, nota);
    }

    /** Professor registra uma falta oficial. */
    public void registrarFalta() {
        absences++;
    }

    public String getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentRA() {
        return studentRA;
    }

    public Map<String, Double> getGrades() {
        return grades;
    }

    public int getAbsences() {
        return absences;
    }

    public int getSelfAbsences() {
        return selfAbsences;
    }

    /** Contador pessoal do aluno (enquanto o professor não lança no sistema). */
    public void setSelfAbsences(int valor) {
        this.selfAbsences = Math.max(0, valor);
    }

    public Cor getColor() {
        return color;
    }

    public void setColor(Cor color) {
        this.color = color;
    }
}
