package br.unicamp.mc322.unicampus.dominio.pessoa;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Resumo de sessão devolvido no login e em GET /me (o objeto {@code Student}
 * do contrato com o frontend). Cada subclasse de {@link Pessoa} monta o seu
 * próprio resumo ({@link Pessoa#montarPerfilSessao()}).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PerfilSessao(
        Papel role,
        String title,
        String id,
        String name,
        String ra,
        String email,
        String course,
        String courseCode,
        String semester,
        double cr,
        double crDelta,
        double cp,
        int creditsCompleted,
        int creditsTotal) {
}
