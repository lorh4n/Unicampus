package br.unicamp.mc322.unicampus.dominio.excecao;

/** Falha de autenticação: credenciais inválidas ou token ausente/expirado (HTTP 401). */
public class AutenticacaoException extends UnicampusException {

    public AutenticacaoException(String mensagem) {
        super(mensagem, 401);
    }
}
