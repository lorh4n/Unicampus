package br.unicamp.mc322.unicampus.dominio;

import java.util.UUID;

/** Gerador de identificadores curtos e únicos, com prefixo legível. */
public final class Ids {

    private Ids() {
    }

    public static String gerar(String prefixo) {
        return prefixo + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
