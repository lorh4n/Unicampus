package br.unicamp.mc322.unicampus.dominio.notificacao;

import java.util.Locale;

/** Alerta de nota/média abaixo da mínima — sabe montar a própria mensagem. */
public class NotificacaoNota extends Notificacao {

    protected NotificacaoNota() {
    }

    public NotificacaoNota(String id, String ownerId, String courseCode, String courseName,
                           double media, long createdAt) {
        super(id, ownerId,
                courseCode + " — nota abaixo da média",
                "Sua média em " + courseName + " caiu para "
                        + String.format(Locale.forLanguageTag("pt-BR"), "%.1f", media) + ".",
                createdAt);
    }

    @Override
    public String getKind() {
        return "nota";
    }
}
