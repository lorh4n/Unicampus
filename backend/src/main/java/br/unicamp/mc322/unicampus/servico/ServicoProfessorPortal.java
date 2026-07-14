package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.dominio.academico.CriterioAvaliacao;
import br.unicamp.mc322.unicampus.dominio.academico.Matricula;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.excecao.AcessoNegadoException;
import br.unicamp.mc322.unicampus.dominio.excecao.RecursoNaoEncontradoException;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;

import java.util.ArrayList;
import java.util.List;

/**
 * Casos de uso do professor no portal dele, restritos às próprias turmas:
 * define o PDD, lança notas e registra faltas.
 * Depois de cada lançamento, a turma (um {@code GeradorDeAlerta}) é consultada
 * e os alertas do aluno afetado viram notificações persistidas.
 */
public class ServicoProfessorPortal {

    private final BancoDeDados banco;
    private final ServicoNotificacoes notificacoes;
    private final ServicoAdmin atividades;

    public ServicoProfessorPortal(BancoDeDados banco, ServicoNotificacoes notificacoes,
                                  ServicoAdmin atividades) {
        this.banco = banco;
        this.notificacoes = notificacoes;
        this.atividades = atividades;
    }

    public List<Turma> minhasTurmas(Professor professor) {
        return banco.turmas().filtrar(t -> t.lecionadaPor(professor.getId()));
    }

    /** Busca a turma garantindo que pertence ao professor logado. */
    public Turma minhaTurma(Professor professor, String turmaId) {
        Turma t = banco.turmas().buscarPorId(turmaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Turma não encontrada"));
        if (!t.lecionadaPor(professor.getId())) {
            throw new AcessoNegadoException("Esta turma não é lecionada por você");
        }
        return t;
    }

    /**
     * Define o PDD da própria turma. A validação de que os pesos somam 100% é da
     * {@link Turma} (lança {@code PesoInvalidoException}); notas já lançadas em
     * critérios que continuam existindo (mesmo rótulo) são preservadas.
     */
    public Turma salvarCriterios(Professor professor, String turmaId, Requisicoes.CriteriosPdd payload) {
        Turma t = minhaTurma(professor, turmaId);
        List<CriterioAvaliacao> novos = new ArrayList<>();
        for (Requisicoes.CriterioPeso c : payload.criteria()) {
            CriterioAvaliacao anterior = t.getCriteria().stream()
                    .filter(x -> x.getLabel().equalsIgnoreCase(c.label()))
                    .findFirst().orElse(null);
            if (anterior != null) {
                novos.add(new CriterioAvaliacao(anterior.getId(), c.label(), c.weight(),
                        anterior.getGrade(), anterior.getDate(), anterior.isDone()));
            } else {
                novos.add(CriterioAvaliacao.novo(c.label(), c.weight()));
            }
        }
        t.definirCriterios(novos);
        banco.turmas().persistir();
        atividades.registrarAtividade("criterios",
                "Critérios de " + t.getCourseCode() + " atualizados");
        return t;
    }

    /** Lança a nota de um aluno em um critério do PDD. */
    public Turma lancarNota(Professor professor, String turmaId, String matriculaId,
                            Requisicoes.NotaLancamento payload) {
        Turma t = minhaTurma(professor, turmaId);
        Matricula m = t.lancarNota(matriculaId, payload.criterionId(), payload.grade());
        banco.turmas().persistir();
        emitirAlertasPara(t, m);
        return t;
    }

    /** Registra uma falta oficial para o aluno. */
    public Turma registrarFalta(Professor professor, String turmaId, String matriculaId) {
        Turma t = minhaTurma(professor, turmaId);
        Matricula m = t.registrarFalta(matriculaId);
        banco.turmas().persistir();
        emitirAlertasPara(t, m);
        return t;
    }

    /** Score do professor logado (somente leitura — quem avalia são os alunos). */
    public Professor meuScore(Professor professor) {
        return professor;
    }

    /**
     * Consulta o {@code GeradorDeAlerta} da turma e persiste (sem duplicar) os
     * alertas do aluno recém-afetado; é assim que o aluno fica sabendo de
     * falta perto do limite ou média abaixo de 5,0.
     */
    private void emitirAlertasPara(Turma t, Matricula m) {
        for (Notificacao alerta : t.gerarAlertas()) {
            if (m.getStudentId() != null && m.getStudentId().equals(alerta.getOwnerId())) {
                notificacoes.registrarSeInedita(alerta);
            }
        }
    }
}
