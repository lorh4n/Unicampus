package br.unicamp.mc322.unicampus.dominio.alerta;

import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;

import java.util.List;

/**
 * INTERFACE (requisito do enunciado) — contrato de quem sabe gerar alertas
 * para os alunos. Implementada por {@code Turma}: após o professor lançar
 * nota ou falta, a turma verifica quem está perto do limite de faltas ou com
 * média abaixo de 5,0 e produz as {@link Notificacao}s correspondentes.
 */
public interface GeradorDeAlerta {

    /** Gera os alertas pendentes no estado atual (pode ser vazio). */
    List<Notificacao> gerarAlertas();
}
