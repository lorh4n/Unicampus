package br.unicamp.mc322.unicampus.dominio.academico;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Cor de identificação visual de uma disciplina (preferência do aluno / catálogo). */
public enum Cor {
    LARANJA("laranja"),
    AZUL("azul"),
    ROXO("roxo"),
    VERDE("verde"),
    ROSA("rosa");

    private final String rotulo;

    Cor(String rotulo) {
        this.rotulo = rotulo;
    }

    @JsonValue
    public String getRotulo() {
        return rotulo;
    }

    @JsonCreator
    public static Cor deRotulo(String rotulo) {
        for (Cor c : values()) {
            if (c.rotulo.equalsIgnoreCase(rotulo)) {
                return c;
            }
        }
        return LARANJA;
    }

    /** Cor determinística para um código de disciplina (mesma regra do mock do frontend). */
    public static Cor paraCodigo(String codigo) {
        int h = 0;
        for (char ch : codigo.toCharArray()) {
            h = (h * 31 + ch) % 997;
        }
        return values()[h % values().length];
    }
}
