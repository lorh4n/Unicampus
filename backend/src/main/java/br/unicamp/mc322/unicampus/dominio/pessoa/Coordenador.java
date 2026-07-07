package br.unicamp.mc322.unicampus.dominio.pessoa;

/**
 * Especialização de {@link Pessoa}: coordenação de curso ("Admin" no frontend).
 * Gerencia o catálogo de disciplinas, cria turmas (alocando professor, horário
 * e sala) e cadastra professores — mas NÃO lança nota/falta (isso é do
 * professor da turma) nem avalia professores (isso é dos alunos).
 */
public class Coordenador extends Pessoa {

    private String title;
    private String department;

    protected Coordenador() {
    }

    public Coordenador(String id, String name, String email, String ra, String senha,
                       String title, String department) {
        super(id, name, email, ra, senha);
        this.title = title;
        this.department = department;
    }

    @Override
    public Papel getPapel() {
        return Papel.ADMIN;
    }

    @Override
    public PerfilSessao montarPerfilSessao() {
        return new PerfilSessao(getPapel(), title, getId(), getName(), getRa(), getEmail(),
                department, "42", "2026.1", 0, 0, 0, 0, 0);
    }
}
