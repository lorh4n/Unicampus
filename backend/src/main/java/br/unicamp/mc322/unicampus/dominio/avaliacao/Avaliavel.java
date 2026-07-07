package br.unicamp.mc322.unicampus.dominio.avaliacao;

/**
 * INTERFACE (requisito do enunciado) — contrato de quem pode receber
 * avaliações de alunos. Implementada por {@code Professor}, que recalcula
 * suas médias de forma incremental a cada avaliação recebida.
 */
public interface Avaliavel {

    /** Incorpora uma nova avaliação, recalculando as médias incrementais. */
    void receberAvaliacao(AvaliacaoProfessor avaliacao);

    /** Média geral atual (média dos quatro critérios). */
    double notaGeral();
}
