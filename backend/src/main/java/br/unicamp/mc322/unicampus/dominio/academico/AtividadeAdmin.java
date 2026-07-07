package br.unicamp.mc322.unicampus.dominio.academico;

import br.unicamp.mc322.unicampus.dominio.Identificavel;

/**
 * Evento do feed "atividade recente" do painel da coordenação.
 * Registrado pelos serviços a cada operação relevante (criação de disciplina,
 * alocação de turma, matrícula, edição de PDD).
 */
public class AtividadeAdmin implements Identificavel {

    /** Tipos aceitos pelo frontend: criacao | alocacao | matricula | criterios. */
    private String id;
    private String kind;
    private String text;
    private long createdAt;

    protected AtividadeAdmin() {
    }

    public AtividadeAdmin(String id, String kind, String text, long createdAt) {
        this.id = id;
        this.kind = kind;
        this.text = text;
        this.createdAt = createdAt;
    }

    @Override
    public String getId() {
        return id;
    }

    public String getKind() {
        return kind;
    }

    public String getText() {
        return text;
    }

    public long getCreatedAt() {
        return createdAt;
    }
}
