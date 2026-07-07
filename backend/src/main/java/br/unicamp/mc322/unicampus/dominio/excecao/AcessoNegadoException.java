package br.unicamp.mc322.unicampus.dominio.excecao;

/** Usuário autenticado, mas sem permissão para a operação (HTTP 403). */
public class AcessoNegadoException extends UnicampusException {

    public AcessoNegadoException(String mensagem) {
        super(mensagem, 403);
    }
}
