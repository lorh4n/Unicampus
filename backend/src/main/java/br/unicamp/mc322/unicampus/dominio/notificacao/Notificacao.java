package br.unicamp.mc322.unicampus.dominio.notificacao;

import br.unicamp.mc322.unicampus.dominio.Identificavel;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

/**
 * Generalização das notificações do sistema. As subclasses
 * ({@link NotificacaoFalta}, {@link NotificacaoNota}, {@link NotificacaoPrazo},
 * {@link NotificacaoSistema}) montam o próprio título/descrição, e o campo
 * {@code kind} do JSON sai do tipo concreto (via {@code @JsonTypeInfo}),
 * batendo com {@code NotificationKind} do frontend.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "kind")
@JsonSubTypes({
        @JsonSubTypes.Type(value = NotificacaoFalta.class, name = "falta"),
        @JsonSubTypes.Type(value = NotificacaoNota.class, name = "nota"),
        @JsonSubTypes.Type(value = NotificacaoPrazo.class, name = "prazo"),
        @JsonSubTypes.Type(value = NotificacaoSistema.class, name = "sistema"),
})
public abstract class Notificacao implements Identificavel {

    private String id;
    /** Dono da notificação — usado para filtrar por usuário logado. */
    private String ownerId;
    private String title;
    private String desc;
    private boolean read;
    /** Momento de criação (epoch millis) — vira "há 2h"/"ontem" no JSON. */
    private long createdAt;

    protected Notificacao() {
    }

    protected Notificacao(String id, String ownerId, String title, String desc, long createdAt) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.desc = desc;
        this.read = false;
        this.createdAt = createdAt;
    }

    /**
     * Tipo da notificação no contrato do frontend ({@code NotificationKind}).
     * Cada subclasse responde o seu, e o mesmo valor serve de
     * discriminador na desserialização (via {@code @JsonSubTypes}).
     */
    @JsonProperty("kind")
    public abstract String getKind();

    @Override
    public String getId() {
        return id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public String getTitle() {
        return title;
    }

    public String getDesc() {
        return desc;
    }

    public boolean isRead() {
        return read;
    }

    public void alternarLida() {
        this.read = !this.read;
    }

    public void marcarLida() {
        this.read = true;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    /** Agrupamento exibido no app: criada hoje ou ao longo da semana. */
    @JsonProperty("group")
    public String getGroup() {
        LocalDate hoje = LocalDate.now(ZoneId.systemDefault());
        LocalDate dia = Instant.ofEpochMilli(createdAt).atZone(ZoneId.systemDefault()).toLocalDate();
        return dia.equals(hoje) ? "Hoje" : "Esta semana";
    }

    /** Tempo relativo pt-BR ("há 2h", "ontem", "3 dias"). */
    @JsonProperty("time")
    public String getTime() {
        return br.unicamp.mc322.unicampus.dominio.FormatoTempo.relativo(createdAt);
    }
}
