package br.unicamp.mc322.unicampus.dominio.excecao;

/** Dados de entrada inválidos (HTTP 400). */
public class ValidacaoException extends UnicampusException {

    public ValidacaoException(String mensagem) {
        super(mensagem, 400);
    }
}
