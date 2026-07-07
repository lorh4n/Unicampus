package br.unicamp.mc322.unicampus.dominio.excecao;

/**
 * EXCEÇÃO PRÓPRIA (requisito do enunciado): lançada quando os pesos do PDD
 * (critérios de avaliação de uma turma) não somam 100%.
 */
public class PesoInvalidoException extends ValidacaoException {

    public PesoInvalidoException(int somaAtual) {
        super("Os pesos do PDD devem somar 100% (soma atual: " + somaAtual + "%)");
    }
}
