package br.unicamp.mc322.unicampus.dominio.academico;

import br.unicamp.mc322.unicampus.dominio.Identificavel;

/**
 * Disciplina do catálogo global, mantida pela coordenação ({@code AdminCourse}
 * no contrato; professor, horário e PDD pertencem à {@link Turma}).
 * Uma disciplina agrega N turmas: as turmas referenciam o código da
 * disciplina, mas têm ciclo de vida próprio.
 */
public class Disciplina implements Identificavel {

    private String id;
    private String code;
    private String name;
    private String area;
    private int credits;
    private Cor color;
    private StatusOferta status = StatusOferta.RASCUNHO;

    protected Disciplina() {
    }

    public Disciplina(String id, String code, String name, String area, int credits,
                      Cor color, StatusOferta status) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.area = area;
        this.credits = credits;
        this.color = color;
        this.status = status;
    }

    public void atualizar(String code, String name, String area, int credits, Cor color) {
        this.code = code;
        this.name = name;
        this.area = area;
        this.credits = credits;
        this.color = color;
    }

    /** Carga horária total: 15h por crédito (padrão DAC). */
    public int cargaHoraria() {
        return credits * 15;
    }

    @Override
    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getArea() {
        return area;
    }

    public int getCredits() {
        return credits;
    }

    public Cor getColor() {
        return color;
    }

    public StatusOferta getStatus() {
        return status;
    }

    public void setStatus(StatusOferta status) {
        this.status = status;
    }
}
