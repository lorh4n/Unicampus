package br.unicamp.mc322.unicampus.dominio.notificacao;

/** Comunicado geral do sistema (matrícula aberta, manutenção etc.). */
public class NotificacaoSistema extends Notificacao {

    protected NotificacaoSistema() {
    }

    public NotificacaoSistema(String id, String ownerId, String titulo, String descricao, long createdAt) {
        super(id, ownerId, titulo, descricao, createdAt);
    }

    @Override
    public String getKind() {
        return "sistema";
    }
}
