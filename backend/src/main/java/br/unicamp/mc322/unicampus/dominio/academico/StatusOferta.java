package br.unicamp.mc322.unicampus.dominio.academico;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Status de uma disciplina do catálogo ou de uma turma ofertada. */
public enum StatusOferta {
    ATIVA("ativa"),
    RASCUNHO("rascunho");

    private final String rotulo;

    StatusOferta(String rotulo) {
        this.rotulo = rotulo;
    }

    @JsonValue
    public String getRotulo() {
        return rotulo;
    }

    @JsonCreator
    public static StatusOferta deRotulo(String rotulo) {
        return "ativa".equalsIgnoreCase(rotulo) ? ATIVA : RASCUNHO;
    }
}
