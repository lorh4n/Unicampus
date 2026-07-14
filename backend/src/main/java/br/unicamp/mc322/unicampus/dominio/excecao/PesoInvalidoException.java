package br.unicamp.mc322.unicampus.dominio.excecao;

/**
 * Lançada quando os pesos do PDD (critérios de avaliação de uma turma)
 * não somam 100%.
 */
public class PesoInvalidoException extends ValidacaoException {

    public PesoInvalidoException(int somaAtual) {
        super("Os pesos do PDD devem somar 100% (soma atual: " + somaAtual + "%)");
    }
}
