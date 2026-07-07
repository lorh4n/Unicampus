package br.unicamp.mc322.unicampus.dominio.pessoa;

import br.unicamp.mc322.unicampus.dominio.Identificavel;
import br.unicamp.mc322.unicampus.persistencia.Visoes;
import com.fasterxml.jackson.annotation.JsonView;

/**
 * CLASSE ABSTRATA (requisito do enunciado) — generalização de todo usuário do
 * sistema. As especializações {@link Aluno}, {@link Professor} e
 * {@link Coordenador} herdam identificação/credenciais e implementam de forma
 * POLIMÓRFICA {@link #getPapel()} e {@link #montarPerfilSessao()}: o mesmo
 * endpoint de login trata qualquer {@code Pessoa} sem precisar saber o tipo
 * concreto.
 */
public abstract class Pessoa implements Identificavel {

    private String id;
    private String name;
    private String email;
    private String ra;

    /** Senha nunca sai pela API — só é gravada no arquivo (visão interna). */
    @JsonView(Visoes.Interna.class)
    private String senha;

    protected Pessoa() {
        // construtor para desserialização (Jackson)
    }

    protected Pessoa(String id, String name, String email, String ra, String senha) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.ra = ra;
        this.senha = senha;
    }

    /** Papel de acesso — cada subclasse responde o seu (polimorfismo). */
    public abstract Papel getPapel();

    /** Monta o objeto de sessão do contrato com o frontend (polimorfismo). */
    public abstract PerfilSessao montarPerfilSessao();

    public boolean senhaConfere(String tentativa) {
        return senha != null && senha.equals(tentativa);
    }

    public void trocarSenha(String nova) {
        this.senha = nova;
    }

    @Override
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRa() {
        return ra;
    }
}
