package br.unicamp.mc322.unicampus.dominio.pessoa;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Papel de acesso do usuário, decidido pelo backend na autenticação.
 * O frontend só roteia (aluno em /app, professor em /professor,
 * admin em /admin).
 */
public enum Papel {
    ALUNO("aluno"),
    PROFESSOR("professor"),
    ADMIN("admin");

    private final String rotulo;

    Papel(String rotulo) {
        this.rotulo = rotulo;
    }

    /** Valor serializado no JSON — precisa bater com o contrato do frontend. */
    @JsonValue
    public String getRotulo() {
        return rotulo;
    }
}
