package br.unicamp.mc322.unicampus.dominio.excecao;

/** Recurso inexistente (HTTP 404). */
public class RecursoNaoEncontradoException extends UnicampusException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem, 404);
    }
}
