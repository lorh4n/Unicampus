package br.unicamp.mc322.unicampus.dominio.notificacao;

/** Alerta de falta registrada — sabe montar a própria mensagem. */
public class NotificacaoFalta extends Notificacao {

    protected NotificacaoFalta() {
    }

    public NotificacaoFalta(String id, String ownerId, String courseCode,
                            int faltas, int limite, long createdAt) {
        super(id, ownerId,
                courseCode + " — falta registrada",
                faltas + " de " + limite + " faltas. Restam " + Math.max(0, limite - faltas)
                        + " antes de reprovar por frequência.",
                createdAt);
    }

    @Override
    public String getKind() {
        return "falta";
    }
}
