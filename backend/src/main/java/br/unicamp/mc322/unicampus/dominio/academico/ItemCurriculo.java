package br.unicamp.mc322.unicampus.dominio.academico;

import java.util.ArrayList;
import java.util.List;

/** Uma disciplina na árvore de integralização ({@code CurriculumCourse}). */
public class ItemCurriculo {

    private String code;
    private String name;
    private int credits;
    private int semester;
    private StatusIntegralizacao status;
    private List<String> prerequisites = new ArrayList<>();

    protected ItemCurriculo() {
    }

    public ItemCurriculo(String code, String name, int credits, int semester,
                         StatusIntegralizacao status, List<String> prerequisites) {
        this.code = code;
        this.name = name;
        this.credits = credits;
        this.semester = semester;
        this.status = status;
        this.prerequisites = new ArrayList<>(prerequisites);
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getCredits() {
        return credits;
    }

    public int getSemester() {
        return semester;
    }

    public StatusIntegralizacao getStatus() {
        return status;
    }

    public void setStatus(StatusIntegralizacao status) {
        this.status = status;
    }

    public List<String> getPrerequisites() {
        return prerequisites;
    }
}
