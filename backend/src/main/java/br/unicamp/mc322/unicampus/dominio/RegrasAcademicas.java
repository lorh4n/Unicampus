package br.unicamp.mc322.unicampus.dominio;

import br.unicamp.mc322.unicampus.dominio.academico.CriterioAvaliacao;

import java.util.List;
import java.util.Map;

/**
 * Regras de negócio acadêmicas puras — espelho em Java de
 * {@code frontend/src/domain/rules.ts}, cobertas pelos testes unitários.
 * O backend é a fonte oficial destas regras; o frontend apenas as replica
 * para dar feedback imediato na interface.
 */
public final class RegrasAcademicas {

    /** Média mínima para aprovação. */
    public static final double MEDIA_DE_APROVACAO = 5.0;

    private RegrasAcademicas() {
    }

    /**
     * Média ponderada das notas já lançadas, normalizada pelos pesos conhecidos:
     * Σ(peso_i × nota_i) / Σ(peso_i). Retorna {@code null} se nenhuma nota foi lançada.
     */
    public static Double mediaPonderada(List<CriterioAvaliacao> criterios, Map<String, Double> notas) {
        double somaPesos = 0;
        double acumulado = 0;
        for (CriterioAvaliacao c : criterios) {
            Double nota = notas.get(c.getId());
            if (nota != null) {
                somaPesos += c.getWeight();
                acumulado += c.getWeight() * nota;
            }
        }
        if (somaPesos <= 0) {
            return null;
        }
        return acumulado / somaPesos;
    }

    /**
     * Nota necessária nas avaliações restantes para atingir a média 5,0:
     * needed = (M − Σ(peso_i × nota_i)) / peso_restante.
     * Retorna {@code null} quando não há avaliações restantes.
     */
    public static Double notaNecessaria(List<CriterioAvaliacao> criterios, Map<String, Double> notasConhecidas) {
        double acumulado = 0;
        double pesoRestante = 0;
        for (CriterioAvaliacao c : criterios) {
            Double nota = notasConhecidas.get(c.getId());
            if (nota != null) {
                acumulado += (c.getWeight() / 100.0) * nota;
            } else {
                pesoRestante += c.getWeight() / 100.0;
            }
        }
        if (pesoRestante <= 0) {
            return null;
        }
        return (MEDIA_DE_APROVACAO - acumulado) / pesoRestante;
    }

    /** Nova média incremental: (mediaAtual × total + novaNota) / (total + 1). */
    public static double mediaIncremental(double mediaAtual, int totalAvaliacoes, double novaNota) {
        return (mediaAtual * totalAvaliacoes + novaNota) / (totalAvaliacoes + 1);
    }

    /** Limite de faltas = 25% da carga horária, em aulas de 2h (mínimo 2). */
    public static int limiteDeFaltas(int cargaHorariaTotal) {
        return (int) Math.max(2, Math.round(cargaHorariaTotal * 0.25 / 2.0));
    }

    /** Faltas restantes antes da reprovação por frequência. */
    public static int faltasRestantes(int faltas, int limite) {
        return limite - faltas;
    }

    /** Reprova por frequência quando faltas > limite (BUSINESS_RULES.md §4.1). */
    public static boolean reprovadoPorFrequencia(int faltas, int limite) {
        return faltas > limite;
    }

    /** Percentual de presença, dado o total de aulas de 2h da carga horária. */
    public static int frequenciaPercentual(int faltas, int cargaHorariaTotal) {
        double totalAulas = cargaHorariaTotal / 2.0;
        if (totalAulas <= 0) {
            return 100;
        }
        int pct = (int) Math.round(100.0 * (1.0 - faltas / totalAulas));
        return Math.max(0, Math.min(100, pct));
    }

    /** Soma dos pesos de um PDD — deve ser 100 para o PDD ser válido. */
    public static int somaDosPesos(List<CriterioAvaliacao> criterios) {
        return criterios.stream().mapToInt(CriterioAvaliacao::getWeight).sum();
    }
}
