package br.unicamp.mc322.unicampus.persistencia;

import br.unicamp.mc322.unicampus.dominio.academico.AtividadeAdmin;
import br.unicamp.mc322.unicampus.dominio.academico.Curriculo;
import br.unicamp.mc322.unicampus.dominio.academico.Disciplina;
import br.unicamp.mc322.unicampus.dominio.academico.EstatisticasAluno;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Coordenador;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.Path;

/**
 * Agrega todos os repositórios do sistema, cada um persistido em seu próprio
 * arquivo JSON dentro do diretório de dados. Na primeira execução os arquivos
 * são criados a partir do {@link Seed}; depois disso, o que vale é o que está
 * gravado em disco: o sistema lê os elementos ao iniciar e grava a cada
 * alteração.
 */
public class BancoDeDados {

    private final Repositorio<Aluno> alunos;
    private final Repositorio<Professor> professores;
    private final Repositorio<Coordenador> coordenadores;
    private final Repositorio<Disciplina> disciplinas;
    private final Repositorio<Turma> turmas;
    private final Repositorio<Notificacao> notificacoes;
    private final Repositorio<AtividadeAdmin> atividades;
    private final DocumentoJson<Curriculo> curriculo;
    private final DocumentoJson<EstatisticasAluno> estatisticas;

    public BancoDeDados(Path diretorio) {
        ObjectMapper mapper = Mapeadores.persistencia();
        alunos = new RepositorioJson<>(diretorio.resolve("alunos.json"), Aluno.class, mapper, Seed::alunos);
        professores = new RepositorioJson<>(diretorio.resolve("professores.json"), Professor.class, mapper, Seed::professores);
        coordenadores = new RepositorioJson<>(diretorio.resolve("coordenadores.json"), Coordenador.class, mapper, Seed::coordenadores);
        disciplinas = new RepositorioJson<>(diretorio.resolve("disciplinas.json"), Disciplina.class, mapper, Seed::disciplinas);
        turmas = new RepositorioJson<>(diretorio.resolve("turmas.json"), Turma.class, mapper, Seed::turmas);
        notificacoes = new RepositorioJson<>(diretorio.resolve("notificacoes.json"), Notificacao.class, mapper, Seed::notificacoes);
        atividades = new RepositorioJson<>(diretorio.resolve("atividades.json"), AtividadeAdmin.class, mapper, Seed::atividades);
        curriculo = new DocumentoJson<>(diretorio.resolve("curriculo.json"), Curriculo.class, mapper, Seed::curriculo);
        estatisticas = new DocumentoJson<>(diretorio.resolve("estatisticas.json"), EstatisticasAluno.class, mapper, Seed::estatisticas);
    }

    public Repositorio<Aluno> alunos() {
        return alunos;
    }

    public Repositorio<Professor> professores() {
        return professores;
    }

    public Repositorio<Coordenador> coordenadores() {
        return coordenadores;
    }

    public Repositorio<Disciplina> disciplinas() {
        return disciplinas;
    }

    public Repositorio<Turma> turmas() {
        return turmas;
    }

    public Repositorio<Notificacao> notificacoes() {
        return notificacoes;
    }

    public Repositorio<AtividadeAdmin> atividades() {
        return atividades;
    }

    public DocumentoJson<Curriculo> curriculo() {
        return curriculo;
    }

    public DocumentoJson<EstatisticasAluno> estatisticas() {
        return estatisticas;
    }
}
