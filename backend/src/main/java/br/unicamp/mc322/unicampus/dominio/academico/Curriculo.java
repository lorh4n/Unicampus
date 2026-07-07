package br.unicamp.mc322.unicampus.dominio.academico;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Árvore de integralização do curso ({@code Curriculum} no contrato).
 * Implementa a regra oficial: uma disciplina BLOQUEADA fica DISPONÍVEL quando
 * todos os pré-requisitos estão APROVADOS (BUSINESS_RULES.md §4.5).
 */
public class Curriculo {

    private String courseName;
    private String courseCode;
    private int progressPercent;
    private int creditsCompleted;
    private int creditsTotal;
    private String forecastSemester;
    private List<ItemCurriculo> courses = new ArrayList<>();

    protected Curriculo() {
    }

    public Curriculo(String courseName, String courseCode, int progressPercent,
                     int creditsCompleted, int creditsTotal, String forecastSemester,
                     List<ItemCurriculo> courses) {
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.progressPercent = progressPercent;
        this.creditsCompleted = creditsCompleted;
        this.creditsTotal = creditsTotal;
        this.forecastSemester = forecastSemester;
        this.courses = new ArrayList<>(courses);
    }

    /**
     * Aplica a regra de integralização: destrava (BLOQUEADA → DISPONÍVEL) toda
     * disciplina cujos pré-requisitos já estão todos APROVADOS.
     */
    public void aplicarIntegralizacao() {
        Map<String, ItemCurriculo> porCodigo = courses.stream()
                .collect(Collectors.toMap(ItemCurriculo::getCode, Function.identity()));
        for (ItemCurriculo item : courses) {
            if (item.getStatus() != StatusIntegralizacao.BLOQUEADA) {
                continue;
            }
            boolean liberada = item.getPrerequisites().stream().allMatch(codigo -> {
                ItemCurriculo pre = porCodigo.get(codigo);
                return pre != null && pre.getStatus() == StatusIntegralizacao.APROVADA;
            });
            if (liberada && !item.getPrerequisites().isEmpty()) {
                item.setStatus(StatusIntegralizacao.DISPONIVEL);
            }
        }
    }

    public String getCourseName() {
        return courseName;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public int getProgressPercent() {
        return progressPercent;
    }

    public int getCreditsCompleted() {
        return creditsCompleted;
    }

    public int getCreditsTotal() {
        return creditsTotal;
    }

    public String getForecastSemester() {
        return forecastSemester;
    }

    public List<ItemCurriculo> getCourses() {
        return courses;
    }
}
