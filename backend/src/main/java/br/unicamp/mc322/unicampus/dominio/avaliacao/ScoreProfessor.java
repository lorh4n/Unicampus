package br.unicamp.mc322.unicampus.dominio.avaliacao;

import br.unicamp.mc322.unicampus.dominio.RegrasAcademicas;

/**
 * Placar de avaliação de um professor (BUSINESS_RULES.md §4.4).
 * Todo professor começa com 5,0 em cada critério; cada avaliação recebida
 * atualiza as médias de forma INCREMENTAL (sem guardar as notas individuais):
 * novaMedia = (mediaAtual × total + notaDoAluno) / (total + 1).
 */
public class ScoreProfessor {

    private double didactics;
    private double organization;
    private double accessibility;
    private double material;
    private double overall;
    private int ratingsCount;

    protected ScoreProfessor() {
    }

    /** Estado inicial: 5,0 em tudo, nenhuma avaliação recebida. */
    public static ScoreProfessor inicial() {
        ScoreProfessor s = new ScoreProfessor();
        s.didactics = 5.0;
        s.organization = 5.0;
        s.accessibility = 5.0;
        s.material = 5.0;
        s.overall = 5.0;
        s.ratingsCount = 0;
        return s;
    }

    /** Incorpora uma avaliação usando a média incremental dos 4 critérios. */
    public void incorporar(AvaliacaoProfessor a) {
        didactics = RegrasAcademicas.mediaIncremental(didactics, ratingsCount, a.didactics());
        organization = RegrasAcademicas.mediaIncremental(organization, ratingsCount, a.organization());
        accessibility = RegrasAcademicas.mediaIncremental(accessibility, ratingsCount, a.accessibility());
        material = RegrasAcademicas.mediaIncremental(material, ratingsCount, a.material());
        ratingsCount++;
        overall = (didactics + organization + accessibility + material) / 4.0;
    }

    public double getDidactics() {
        return didactics;
    }

    public double getOrganization() {
        return organization;
    }

    public double getAccessibility() {
        return accessibility;
    }

    public double getMaterial() {
        return material;
    }

    public double getOverall() {
        return overall;
    }

    public int getRatingsCount() {
        return ratingsCount;
    }
}
