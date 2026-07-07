package br.unicamp.mc322.unicampus.dominio.pessoa;

/**
 * Especialização de {@link Pessoa}: estudante com vida acadêmica (CR, CP,
 * créditos). É quem se matricula em turmas, visualiza notas/faltas (lançadas
 * pelo professor) e avalia professores das disciplinas que está cursando.
 */
public class Aluno extends Pessoa {

    private String course;
    private String courseCode;
    private String semester;
    private double cr;
    private double crDelta;
    private double cp;
    private int creditsCompleted;
    private int creditsTotal;

    protected Aluno() {
    }

    public Aluno(String id, String name, String email, String ra, String senha,
                 String course, String courseCode, String semester,
                 double cr, double crDelta, double cp,
                 int creditsCompleted, int creditsTotal) {
        super(id, name, email, ra, senha);
        this.course = course;
        this.courseCode = courseCode;
        this.semester = semester;
        this.cr = cr;
        this.crDelta = crDelta;
        this.cp = cp;
        this.creditsCompleted = creditsCompleted;
        this.creditsTotal = creditsTotal;
    }

    @Override
    public Papel getPapel() {
        return Papel.ALUNO;
    }

    @Override
    public PerfilSessao montarPerfilSessao() {
        return new PerfilSessao(getPapel(), null, getId(), getName(), getRa(), getEmail(),
                course, courseCode, semester, cr, crDelta, cp, creditsCompleted, creditsTotal);
    }

    public String getCourse() {
        return course;
    }

    public String getSemester() {
        return semester;
    }

    public double getCr() {
        return cr;
    }

    public double getCp() {
        return cp;
    }
}
