package br.unicamp.mc322.unicampus.dominio.academico;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Situação de uma disciplina na integralização curricular do aluno. */
public enum StatusIntegralizacao {
    APROVADA("aprovada"),
    CURSANDO("cursando"),
    DISPONIVEL("disponivel"),
    BLOQUEADA("bloqueada");

    private final String rotulo;

    StatusIntegralizacao(String rotulo) {
        this.rotulo = rotulo;
    }

    @JsonValue
    public String getRotulo() {
        return rotulo;
    }

    @JsonCreator
    public static StatusIntegralizacao deRotulo(String rotulo) {
        for (StatusIntegralizacao s : values()) {
            if (s.rotulo.equalsIgnoreCase(rotulo)) {
                return s;
            }
        }
        return BLOQUEADA;
    }
}
