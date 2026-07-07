package br.unicamp.mc322.unicampus.dominio.excecao;

/**
 * EXCEÇÃO PRÓPRIA (requisito do enunciado): aluno tentando avaliar um
 * professor sem estar matriculado (cursando) em uma turma dele.
 */
public class AvaliacaoNaoPermitidaException extends UnicampusException {

    public AvaliacaoNaoPermitidaException(String mensagem) {
        super(mensagem, 403);
    }
}
