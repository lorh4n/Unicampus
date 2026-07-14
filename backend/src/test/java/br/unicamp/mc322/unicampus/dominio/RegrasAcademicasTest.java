package br.unicamp.mc322.unicampus.dominio;

import br.unicamp.mc322.unicampus.dominio.academico.CriterioAvaliacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Regras acadêmicas puras, espelho de frontend/src/domain/rules.ts. */
class RegrasAcademicasTest {

    private final List<CriterioAvaliacao> pdd = List.of(
            new CriterioAvaliacao("p1", "Prova P1", 30, null, null, false),
            new CriterioAvaliacao("p2", "Prova P2", 30, null, null, false),
            new CriterioAvaliacao("tf", "Trabalho final", 40, null, null, false));

    @Test
    @DisplayName("Média ponderada normaliza pelos pesos das notas já lançadas")
    void mediaPonderadaParcial() {
        Map<String, Double> notas = new HashMap<>();
        notas.put("p1", 8.5);
        notas.put("tf", 7.2);
        // (30*8,5 + 40*7,2) / 70 = 7,757...
        assertEquals(7.757, RegrasAcademicas.mediaPonderada(pdd, notas), 0.001);
    }

    @Test
    @DisplayName("Média ponderada é nula sem nenhuma nota lançada")
    void mediaPonderadaSemNotas() {
        assertNull(RegrasAcademicas.mediaPonderada(pdd, Map.of()));
    }

    @Test
    @DisplayName("Nota necessária: (5,0 − Σ(wi·gi)) / wr — caso do simulador")
    void notaNecessaria() {
        Map<String, Double> conhecidas = new HashMap<>();
        conhecidas.put("p1", 8.5);
        conhecidas.put("tf", 7.2);
        // acumulado = 0,3*8,5 + 0,4*7,2 = 5,43; (5,0 - 5,43)/0,3 < 0 (já aprovada)
        Double necessaria = RegrasAcademicas.notaNecessaria(pdd, conhecidas);
        assertTrue(necessaria <= 0, "já aprovada mesmo com 0 na P2");
    }

    @Test
    @DisplayName("Nota necessária impossível (> 10) quando o acumulado é muito baixo")
    void notaNecessariaImpossivel() {
        Map<String, Double> conhecidas = new HashMap<>();
        conhecidas.put("p1", 1.0);
        conhecidas.put("p2", 1.0);
        // acumulado = 0,6; (5,0 - 0,6)/0,4 = 11,0
        assertEquals(11.0, RegrasAcademicas.notaNecessaria(pdd, conhecidas), 0.001);
    }

    @Test
    @DisplayName("Nota necessária é nula quando não restam avaliações")
    void notaNecessariaSemRestantes() {
        Map<String, Double> todas = Map.of("p1", 5.0, "p2", 5.0, "tf", 5.0);
        assertNull(RegrasAcademicas.notaNecessaria(pdd, todas));
    }

    @Test
    @DisplayName("Média incremental: (média × total + nova) / (total + 1)")
    void mediaIncremental() {
        // professor começa com 5,0; primeira avaliação 3,0: (5*0 + 3)/1 = 3,0?
        // Não: com 0 avaliações a média inicial não entra na conta, então 3,0
        assertEquals(3.0, RegrasAcademicas.mediaIncremental(5.0, 0, 3.0), 0.001);
        // com 1 avaliação (média 3,0), nova 5,0: (3*1 + 5)/2 = 4,0
        assertEquals(4.0, RegrasAcademicas.mediaIncremental(3.0, 1, 5.0), 0.001);
    }

    @Test
    @DisplayName("Limite de faltas = 25% da carga horária em aulas de 2h")
    void limiteDeFaltas() {
        assertEquals(8, RegrasAcademicas.limiteDeFaltas(60));   // 60h: 7,5 arredonda para 8
        assertEquals(11, RegrasAcademicas.limiteDeFaltas(90));  // 90h: 11,25 arredonda para 11
        assertEquals(4, RegrasAcademicas.limiteDeFaltas(30));   // 30h: 3,75 arredonda para 4
        assertEquals(2, RegrasAcademicas.limiteDeFaltas(8));    // mínimo 2
    }

    @Test
    @DisplayName("Reprovação por frequência quando faltas > limite")
    void reprovacaoPorFrequencia() {
        assertFalse(RegrasAcademicas.reprovadoPorFrequencia(8, 8));
        assertTrue(RegrasAcademicas.reprovadoPorFrequencia(9, 8));
        assertEquals(2, RegrasAcademicas.faltasRestantes(6, 8));
    }

    @Test
    @DisplayName("Frequência percentual derivada das faltas e carga horária")
    void frequenciaPercentual() {
        assertEquals(100, RegrasAcademicas.frequenciaPercentual(0, 60));
        assertEquals(83, RegrasAcademicas.frequenciaPercentual(5, 60)); // 1 - 5/30
        assertEquals(0, RegrasAcademicas.frequenciaPercentual(99, 60)); // clamp em 0
    }
}
