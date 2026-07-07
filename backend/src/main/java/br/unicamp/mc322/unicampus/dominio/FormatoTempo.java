package br.unicamp.mc322.unicampus.dominio;

import java.time.Duration;
import java.time.Instant;

/** Formatação de tempo relativo em pt-BR ("há 2h", "ontem", "3 dias"). */
public final class FormatoTempo {

    private FormatoTempo() {
    }

    public static String relativo(long epochMillis) {
        Duration d = Duration.between(Instant.ofEpochMilli(epochMillis), Instant.now());
        long min = Math.max(0, d.toMinutes());
        if (min < 60) {
            return "há " + Math.max(1, min) + " min";
        }
        if (min < 60 * 24) {
            return "há " + d.toHours() + " h";
        }
        long dias = d.toDays();
        return dias == 1 ? "ontem" : dias + " dias";
    }
}
