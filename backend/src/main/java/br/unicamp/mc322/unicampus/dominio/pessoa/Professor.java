package br.unicamp.mc322.unicampus.dominio.pessoa;

import br.unicamp.mc322.unicampus.dominio.avaliacao.AvaliacaoProfessor;
import br.unicamp.mc322.unicampus.dominio.avaliacao.Avaliavel;
import br.unicamp.mc322.unicampus.dominio.avaliacao.ScoreProfessor;

import java.util.ArrayList;
import java.util.List;

/**
 * Especialização de {@link Pessoa} que implementa {@link Avaliavel}:
 * recebe avaliações dos alunos e recalcula seu placar de forma incremental.
 * O professor define o PDD (critérios de avaliação) das próprias turmas e é o
 * único que lança nota/falta dos alunos matriculados nelas.
 */
public class Professor extends Pessoa implements Avaliavel {

    private String department;
    private ScoreProfessor scores;
    private List<TurmaLecionada> history = new ArrayList<>();

    protected Professor() {
    }

    public Professor(String id, String name, String email, String ra, String senha,
                     String department, List<TurmaLecionada> history) {
        super(id, name, email, ra, senha);
        this.department = department;
        this.scores = ScoreProfessor.inicial();
        this.history = new ArrayList<>(history);
    }

    @Override
    public Papel getPapel() {
        return Papel.PROFESSOR;
    }

    @Override
    public PerfilSessao montarPerfilSessao() {
        return new PerfilSessao(getPapel(), "Professor(a)", getId(), getName(), getRa(), getEmail(),
                department, "42", "2026.1", 0, 0, 0, 0, 0);
    }

    @Override
    public void receberAvaliacao(AvaliacaoProfessor avaliacao) {
        scores.incorporar(avaliacao);
    }

    @Override
    public double notaGeral() {
        return scores.getOverall();
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public ScoreProfessor getScores() {
        return scores;
    }

    public List<TurmaLecionada> getHistory() {
        return history;
    }
}
