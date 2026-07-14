package br.unicamp.mc322.unicampus.dominio.avaliacao;

import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;

/**
 * Avaliação enviada por um aluno para um professor: nota de 0 a 5 em
 * cada um dos quatro critérios.
 */
public record AvaliacaoProfessor(
        String professorId,
        double didactics,
        double organization,
        double accessibility,
        double material) {

    public AvaliacaoProfessor {
        validar("Didática", didactics);
        validar("Organização", organization);
        validar("Acessibilidade", accessibility);
        validar("Material didático", material);
    }

    private static void validar(String criterio, double nota) {
        if (nota < 0 || nota > 5) {
            throw new ValidacaoException(criterio + ": nota deve estar entre 0,0 e 5,0");
        }
    }
}
