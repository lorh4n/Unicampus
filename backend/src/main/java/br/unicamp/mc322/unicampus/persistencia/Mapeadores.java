package br.unicamp.mc322.unicampus.persistencia;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * Fábrica dos dois {@link ObjectMapper}s do sistema:
 * - {@link #persistencia()}: grava TUDO nos arquivos JSON (inclui a visão
 *   {@code Interna}, ex.: senha);
 * - {@link #configurarApi(ObjectMapper)}: serializa só a visão {@code Publica}
 *   — campos sensíveis nunca saem pela rede.
 *
 * Ambos acessam os CAMPOS privados diretamente (e não getters), para que
 * getters calculados (ex.: {@code Notificacao.getTime()}) só entrem no JSON
 * quando anotados explicitamente com {@code @JsonProperty}.
 */
public final class Mapeadores {

    private Mapeadores() {
    }

    private static void configurarBase(ObjectMapper m) {
        m.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        m.setVisibility(PropertyAccessor.GETTER, JsonAutoDetect.Visibility.NONE);
        m.setVisibility(PropertyAccessor.IS_GETTER, JsonAutoDetect.Visibility.NONE);
        m.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        m.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }

    /** Mapper dos arquivos de dados (visão completa, com campos internos). */
    public static ObjectMapper persistencia() {
        ObjectMapper m = new ObjectMapper();
        configurarBase(m);
        return m;
    }

    /** Configura um mapper para respostas HTTP (só a visão pública). */
    public static void configurarApi(ObjectMapper m) {
        configurarBase(m);
        m.setConfig(m.getSerializationConfig().withView(Visoes.Publica.class));
    }
}
