package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.avaliacao.AvaliacaoProfessor;
import br.unicamp.mc322.unicampus.dominio.excecao.AvaliacaoNaoPermitidaException;
import br.unicamp.mc322.unicampus.dominio.excecao.RecursoNaoEncontradoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.dominio.pessoa.TurmaLecionada;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;
import br.unicamp.mc322.unicampus.persistencia.Seed;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Catálogo público de professores: consulta (busca/perfil) e AVALIAÇÃO pelos
 * alunos. A regra de permissão (só avalia quem está cursando uma turma do
 * professor) vive aqui; o recálculo incremental vive no próprio
 * {@code Professor} (interface {@code Avaliavel}).
 */
public class ServicoProfessores {

    private final BancoDeDados banco;

    public ServicoProfessores(BancoDeDados banco) {
        this.banco = banco;
    }

    public List<Professor> listar() {
        return banco.professores().listar();
    }

    public Professor porId(String id) {
        return banco.professores().buscarPorId(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado"));
    }

    /** Perfil público: o que leciona agora (derivado das turmas) + histórico. */
    public Respostas.PerfilProfessor perfil(String id) {
        Professor p = porId(id);
        List<TurmaLecionada> atuais = banco.turmas()
                .filtrar(t -> t.lecionadaPor(id) && t.getStatus() == StatusOferta.ATIVA)
                .stream()
                .map(t -> new TurmaLecionada(Seed.SEMESTRE_ATUAL, t.getCourseCode(),
                        t.getCourseName(), t.getClassName()))
                .toList();

        Map<String, List<TurmaLecionada>> porSemestre = new LinkedHashMap<>();
        p.getHistory().stream()
                .sorted(Comparator.comparing(TurmaLecionada::semester).reversed())
                .forEach(h -> porSemestre.computeIfAbsent(h.semester(), s -> new ArrayList<>()).add(h));
        List<Respostas.PerfilProfessor.SemestreLecionado> passados = porSemestre.entrySet().stream()
                .map(e -> new Respostas.PerfilProfessor.SemestreLecionado(e.getKey(), e.getValue()))
                .toList();

        return new Respostas.PerfilProfessor(p, atuais, passados);
    }

    /**
     * Aluno avalia professor (BUSINESS_RULES.md §4.4). Permissão: precisa
     * estar MATRICULADO (cursando) em uma turma ativa daquele professor —
     * caso contrário, {@link AvaliacaoNaoPermitidaException}.
     */
    public Professor avaliar(Aluno aluno, Requisicoes.AvaliacaoEnvio payload) {
        Professor professor = porId(payload.professorId());
        boolean cursandoComEle = banco.turmas().listar().stream()
                .anyMatch(t -> t.lecionadaPor(professor.getId())
                        && t.getStatus() == StatusOferta.ATIVA
                        && t.encontrarMatriculaDoAluno(aluno.getId()).isPresent());
        if (!cursandoComEle) {
            throw new AvaliacaoNaoPermitidaException(
                    "Você só pode avaliar professores de disciplinas que está cursando");
        }
        professor.receberAvaliacao(new AvaliacaoProfessor(payload.professorId(),
                payload.didactics(), payload.organization(),
                payload.accessibility(), payload.material()));
        banco.professores().persistir();
        return professor;
    }

    /** Turma ativa "principal" de um professor (para detalhe na busca). */
    public Turma turmaAtivaDe(String professorId) {
        return banco.turmas()
                .filtrar(t -> t.lecionadaPor(professorId) && t.getStatus() == StatusOferta.ATIVA)
                .stream().findFirst().orElse(null);
    }
}
