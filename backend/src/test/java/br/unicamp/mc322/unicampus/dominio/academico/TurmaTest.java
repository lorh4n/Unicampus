package br.unicamp.mc322.unicampus.dominio.academico;

import br.unicamp.mc322.unicampus.dominio.excecao.MatriculaNaoEncontradaException;
import br.unicamp.mc322.unicampus.dominio.excecao.PesoInvalidoException;
import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoFalta;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoNota;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Invariantes da Turma: PDD soma 100%, lançamento de nota/falta, alertas. */
class TurmaTest {

    private Turma turma;
    private Aluno marina;

    @BeforeEach
    void criarTurma() {
        Disciplina mc322 = new Disciplina("d1", "MC322", "Programação Orientada a Objetos",
                "Computação", 4, Cor.LARANJA, StatusOferta.ATIVA);
        turma = new Turma("t1", mc322, "Turma A", "prof-1", "Esther Colombini",
                List.of(new HorarioAula("s1", 1, "08:00", "10:00", "CB02")),
                StatusOferta.ATIVA);
        turma.definirCriterios(new ArrayList<>(List.of(
                CriterioAvaliacao.novo("Prova P1", 50),
                CriterioAvaliacao.novo("Prova P2", 50))));
        marina = new Aluno("stu-1", "Marina Alves", "m@unicamp.br", "247195", "123456",
                "Ciência da Computação", "42", "2026.1", 8.4, 0.3, 0.81, 152, 188);
    }

    @Test
    @DisplayName("PDD que não soma 100% é rejeitado com PesoInvalidoException")
    void pddInvalido() {
        PesoInvalidoException e = assertThrows(PesoInvalidoException.class, () ->
                turma.definirCriterios(new ArrayList<>(List.of(
                        CriterioAvaliacao.novo("Prova", 60),
                        CriterioAvaliacao.novo("Trabalho", 30)))));
        assertTrue(e.getMessage().contains("90"));
    }

    @Test
    @DisplayName("Matricular cria entradas de nota para todos os critérios")
    void matricular() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        assertEquals(2, m.getGrades().size());
        assertNull(m.getGrades().get("prova-p1"));
        assertEquals(Cor.AZUL, m.getColor());
        // matrícula duplicada é rejeitada
        assertThrows(ValidacaoException.class, () -> turma.matricular(marina, Cor.AZUL));
    }

    @Test
    @DisplayName("Professor lança nota; média ponderada do aluno reflete o lançamento")
    void lancarNota() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        turma.lancarNota(m.getId(), "prova-p1", 8.0);
        assertEquals(8.0, turma.mediaDoAluno(m), 0.001);
        turma.lancarNota(m.getId(), "prova-p2", 4.0);
        assertEquals(6.0, turma.mediaDoAluno(m), 0.001);
    }

    @Test
    @DisplayName("Nota fora de 0–10 e matrícula inexistente são rejeitadas")
    void lancamentosInvalidos() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        assertThrows(ValidacaoException.class, () ->
                turma.lancarNota(m.getId(), "prova-p1", 11.0));
        assertThrows(MatriculaNaoEncontradaException.class, () ->
                turma.lancarNota("nao-existe", "prova-p1", 5.0));
        assertThrows(MatriculaNaoEncontradaException.class, () ->
                turma.registrarFalta("nao-existe"));
    }

    @Test
    @DisplayName("GeradorDeAlerta: perto do limite de faltas gera NotificacaoFalta")
    void alertaDeFalta() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        // limite = 8 (60h); com 6 faltas restam 2 → deve alertar
        for (int i = 0; i < 6; i++) {
            turma.registrarFalta(m.getId());
        }
        List<Notificacao> alertas = turma.gerarAlertas();
        assertEquals(1, alertas.size());
        assertTrue(alertas.get(0) instanceof NotificacaoFalta);
        assertEquals("stu-1", alertas.get(0).getOwnerId());
        assertTrue(alertas.get(0).getTitle().contains("MC322"));
    }

    @Test
    @DisplayName("GeradorDeAlerta: média abaixo de 5,0 gera NotificacaoNota")
    void alertaDeNota() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        turma.lancarNota(m.getId(), "prova-p1", 3.0);
        List<Notificacao> alertas = turma.gerarAlertas();
        assertEquals(1, alertas.size());
        assertTrue(alertas.get(0) instanceof NotificacaoNota);
    }

    @Test
    @DisplayName("Trocar o PDD preserva notas de critérios com o mesmo rótulo")
    void pddPreservaNotas() {
        Matricula m = turma.matricular(marina, Cor.AZUL);
        turma.lancarNota(m.getId(), "prova-p1", 9.0);
        // adiciona uma reposição, reequilibrando pesos
        turma.definirCriterios(new ArrayList<>(List.of(
                new CriterioAvaliacao("prova-p1", "Prova P1", 40, 9.0, null, true),
                CriterioAvaliacao.novo("Prova P2", 40),
                CriterioAvaliacao.novo("Reposição", 20))));
        assertEquals(9.0, m.getGrades().get("prova-p1"), 0.001);
        assertNull(m.getGrades().get("reposição")); // nova entrada criada
        assertEquals(3, m.getGrades().size());
    }
}
