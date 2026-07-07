package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.dominio.excecao.AvaliacaoNaoPermitidaException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Permissão de avaliação (§4.4): só avalia quem está cursando com o professor. */
class ServicoProfessoresTest {

    @TempDir
    Path dir;

    private BancoDeDados banco;
    private ServicoProfessores servico;

    @BeforeEach
    void preparar() {
        banco = new BancoDeDados(dir);
        servico = new ServicoProfessores(banco);
    }

    private Aluno aluno(String id) {
        return banco.alunos().buscarPorId(id).orElseThrow();
    }

    @Test
    @DisplayName("Marina (matriculada em MC322) pode avaliar a professora da turma")
    void alunaMatriculadaAvalia() {
        Professor prof = servico.avaliar(aluno("stu-1"),
                new Requisicoes.AvaliacaoEnvio("prof-colombini", 4.0, 4.0, 4.0, 4.0));
        assertEquals(1, prof.getScores().getRatingsCount());
        assertEquals(4.0, prof.getScores().getOverall(), 0.001);
    }

    @Test
    @DisplayName("Aluno sem matrícula com o professor recebe AvaliacaoNaoPermitidaException")
    void alunoSemMatriculaNaoAvalia() {
        // Henrique (stu-8) não está em nenhuma turma do seed
        assertThrows(AvaliacaoNaoPermitidaException.class, () ->
                servico.avaliar(aluno("stu-8"),
                        new Requisicoes.AvaliacaoEnvio("prof-colombini", 5.0, 5.0, 5.0, 5.0)));
        // Marina não cursa com o prof. Tavares (turma LA122 sem matrícula dela)
        assertThrows(AvaliacaoNaoPermitidaException.class, () ->
                servico.avaliar(aluno("stu-1"),
                        new Requisicoes.AvaliacaoEnvio("prof-tavares", 5.0, 5.0, 5.0, 5.0)));
    }

    @Test
    @DisplayName("Avaliação persiste em arquivo: outro 'servidor' lendo o mesmo diretório vê o score")
    void avaliacaoPersiste() {
        servico.avaliar(aluno("stu-1"),
                new Requisicoes.AvaliacaoEnvio("prof-colombini", 3.0, 3.0, 3.0, 3.0));
        BancoDeDados outro = new BancoDeDados(dir);
        Professor relido = outro.professores().buscarPorId("prof-colombini").orElseThrow();
        assertEquals(1, relido.getScores().getRatingsCount());
        assertEquals(3.0, relido.getScores().getOverall(), 0.001);
    }
}
