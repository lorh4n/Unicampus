package br.unicamp.mc322.unicampus.dominio.excecao;

/**
 * Raiz da hierarquia de exceções do sistema. Cada subclasse informa o
 * status HTTP com que deve ser respondida, então a camada de API trata
 * qualquer erro de negócio da mesma forma.
 */
public class UnicampusException extends RuntimeException {

    private final int statusHttp;

    public UnicampusException(String mensagem, int statusHttp) {
        super(mensagem);
        this.statusHttp = statusHttp;
    }

    public int getStatusHttp() {
        return statusHttp;
    }
}
