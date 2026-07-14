package br.unicamp.mc322.unicampus.dominio.excecao;

/**
 * Lançada quando um aluno tenta avaliar um professor sem estar
 * matriculado (cursando) em uma turma dele.
 */
public class AvaliacaoNaoPermitidaException extends UnicampusException {

    public AvaliacaoNaoPermitidaException(String mensagem) {
        super(mensagem, 403);
    }
}
