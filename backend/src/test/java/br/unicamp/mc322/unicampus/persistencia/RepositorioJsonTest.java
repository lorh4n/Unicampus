package br.unicamp.mc322.unicampus.persistencia;

import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.Matricula;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoFalta;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Persistência em arquivo: o sistema grava e relê as entidades em JSON,
 * inclusive a hierarquia polimórfica de Notificacao e a senha (que só
 * aparece no arquivo, nunca na API).
 */
class RepositorioJsonTest {

    @TempDir
    Path dir;

    @Test
    @DisplayName("Round-trip: turmas com roster e PDD sobrevivem a um reinício")
    void turmasRoundTrip() {
        Path arquivo = dir.resolve("turmas.json");
        ObjectMapper mapper = Mapeadores.persistencia();

        RepositorioJson<Turma> repo = new RepositorioJson<>(arquivo, Turma.class, mapper, Seed::turmas);
        assertTrue(Files.exists(arquivo), "arquivo criado com a carga inicial");
        int totalAntes = repo.total();

        // muda estado: falta + nota para a Marina em MC322
        Turma mc322 = repo.buscarPorId("turma-mc322-a").orElseThrow();
        Matricula marina = mc322.encontrarMatriculaDoAluno("stu-1").orElseThrow();
        mc322.registrarFalta(marina.getId());
        mc322.lancarNota(marina.getId(), "prova-p2", 6.5);
        repo.persistir();

        // "reinicia o servidor": novo repositório lendo o mesmo arquivo
        RepositorioJson<Turma> relido = new RepositorioJson<>(arquivo, Turma.class, mapper, List::of);
        assertEquals(totalAntes, relido.total());
        Turma mc322Relida = relido.buscarPorId("turma-mc322-a").orElseThrow();
        Matricula marinaRelida = mc322Relida.encontrarMatriculaDoAluno("stu-1").orElseThrow();
        assertEquals(6, marinaRelida.getAbsences());
        assertEquals(6.5, marinaRelida.getGrades().get("prova-p2"), 0.001);
        assertEquals(Cor.LARANJA, marinaRelida.getColor());
        assertEquals(3, mc322Relida.getCriteria().size());
    }

    @Test
    @DisplayName("Notificações polimórficas preservam o tipo concreto (kind) no arquivo")
    void notificacoesPolimorficas() throws Exception {
        Path arquivo = dir.resolve("notificacoes.json");
        ObjectMapper mapper = Mapeadores.persistencia();

        new RepositorioJson<>(arquivo, Notificacao.class, mapper, Seed::notificacoes);
        String json = Files.readString(arquivo);
        assertTrue(json.contains("\"kind\" : \"falta\"") || json.contains("\"kind\":\"falta\""),
                "o campo kind sai do tipo concreto");

        RepositorioJson<Notificacao> relido =
                new RepositorioJson<>(arquivo, Notificacao.class, mapper, List::of);
        assertInstanceOf(NotificacaoFalta.class, relido.buscarPorId("n1").orElseThrow(),
                "desserializa de volta para a subclasse certa");
    }

    @Test
    @DisplayName("Senha vai para o arquivo (visão interna) mas nunca para a API (visão pública)")
    void senhaSoNaPersistencia() throws Exception {
        Aluno marina = Seed.alunos().get(0);

        String arquivoJson = Mapeadores.persistencia().writeValueAsString(marina);
        assertTrue(arquivoJson.contains("123456"), "persistência guarda a senha");

        ObjectMapper api = Mapeadores.persistencia();
        Mapeadores.configurarApi(api);
        String apiJson = api.writeValueAsString(marina);
        assertFalse(apiJson.contains("123456"), "API não expõe a senha");
        assertTrue(apiJson.contains("Marina Alves"), "demais campos continuam públicos");
    }
}
