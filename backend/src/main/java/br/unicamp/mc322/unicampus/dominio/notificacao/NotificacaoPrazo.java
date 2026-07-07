package br.unicamp.mc322.unicampus.dominio.notificacao;

/** Aviso de prazo de entrega/avaliação se aproximando. */
public class NotificacaoPrazo extends Notificacao {

    protected NotificacaoPrazo() {
    }

    public NotificacaoPrazo(String id, String ownerId, String courseCode, String tarefa,
                            String prazo, long createdAt) {
        super(id, ownerId,
                courseCode + " — " + tarefa,
                "Prazo " + prazo + ".",
                createdAt);
    }

    @Override
    public String getKind() {
        return "prazo";
    }
}
