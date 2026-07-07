package br.unicamp.mc322.unicampus.dominio.avaliacao;

import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Avaliação de professores: média incremental e validação (§4.4). */
class AvaliacaoTest {

    private Professor novoProfessor() {
        return new Professor("prof-1", "Esther Colombini", "esther@ic.unicamp.br",
                "000101", "123456", "Instituto de Computação", List.of());
    }

    @Test
    @DisplayName("Professor começa com 5,0 em todos os critérios e 0 avaliações")
    void estadoInicial() {
        Professor p = novoProfessor();
        assertEquals(5.0, p.getScores().getDidactics(), 0.001);
        assertEquals(5.0, p.getScores().getOverall(), 0.001);
        assertEquals(0, p.getScores().getRatingsCount());
        assertEquals(5.0, p.notaGeral(), 0.001);
    }

    @Test
    @DisplayName("Avaliavel.receberAvaliacao recalcula a média incremental dos 4 critérios")
    void mediaIncremental() {
        Professor p = novoProfessor();

        // 1ª avaliação: substitui a base (total era 0)
        p.receberAvaliacao(new AvaliacaoProfessor("prof-1", 4.0, 3.0, 5.0, 4.0));
        assertEquals(4.0, p.getScores().getDidactics(), 0.001);
        assertEquals(3.0, p.getScores().getOrganization(), 0.001);
        assertEquals(1, p.getScores().getRatingsCount());
        assertEquals((4.0 + 3.0 + 5.0 + 4.0) / 4, p.getScores().getOverall(), 0.001);

        // 2ª avaliação: novaMedia = (média × 1 + nota) / 2
        p.receberAvaliacao(new AvaliacaoProfessor("prof-1", 2.0, 5.0, 5.0, 2.0));
        assertEquals(3.0, p.getScores().getDidactics(), 0.001);   // (4+2)/2
        assertEquals(4.0, p.getScores().getOrganization(), 0.001); // (3+5)/2
        assertEquals(2, p.getScores().getRatingsCount());
        assertEquals((3.0 + 4.0 + 5.0 + 3.0) / 4, p.getScores().getOverall(), 0.001);
    }

    @Test
    @DisplayName("Nota fora do intervalo 0–5 é rejeitada na construção da avaliação")
    void notaForaDoIntervalo() {
        assertThrows(ValidacaoException.class,
                () -> new AvaliacaoProfessor("prof-1", 5.5, 4.0, 4.0, 4.0));
        assertThrows(ValidacaoException.class,
                () -> new AvaliacaoProfessor("prof-1", 4.0, -0.1, 4.0, 4.0));
    }
}
