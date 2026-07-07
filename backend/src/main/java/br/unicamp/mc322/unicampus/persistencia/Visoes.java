package br.unicamp.mc322.unicampus.persistencia;

/**
 * Visões de serialização (Jackson {@code @JsonView}):
 * - {@link Publica}: o que sai pela API HTTP;
 * - {@link Interna}: inclui também campos sensíveis (ex.: senha), usados só
 *   na gravação/leitura dos arquivos JSON de persistência.
 */
public final class Visoes {

    private Visoes() {
    }

    public static class Publica {
    }

    public static class Interna extends Publica {
    }
}
