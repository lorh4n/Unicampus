package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.HorarioAula;
import br.unicamp.mc322.unicampus.dominio.academico.ItemCurriculo;
import br.unicamp.mc322.unicampus.dominio.academico.StatusIntegralizacao;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.pessoa.Pessoa;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Busca global do app: disciplinas (currículo), professores e salas. */
public class ServicoBusca {

    private final BancoDeDados banco;

    public ServicoBusca(BancoDeDados banco) {
        this.banco = banco;
    }

    public List<Respostas.ResultadoBusca> buscar(Pessoa usuario, String consulta, String aba) {
        String termo = consulta == null ? "" : consulta.trim().toLowerCase();
        if (termo.isEmpty()) {
            return List.of();
        }
        return switch (aba == null ? "disciplinas" : aba) {
            case "professores" -> professores(termo);
            case "salas" -> salas(usuario, termo);
            default -> disciplinas(usuario, termo);
        };
    }

    private List<Respostas.ResultadoBusca> disciplinas(Pessoa usuario, String termo) {
        List<Respostas.ResultadoBusca> resultados = new ArrayList<>();
        for (ItemCurriculo c : banco.curriculo().get().getCourses()) {
            boolean bate = c.getName().toLowerCase().contains(termo)
                    || c.getCode().toLowerCase().contains(termo);
            if (!bate) {
                continue;
            }
            String detalhe = c.getCredits() + " créditos";
            if (!c.getPrerequisites().isEmpty() && c.getStatus() == StatusIntegralizacao.BLOQUEADA) {
                detalhe += " · pré: " + String.join(", ", c.getPrerequisites());
            }
            Cor cor = c.getStatus() == StatusIntegralizacao.BLOQUEADA
                    ? null
                    : corPara(usuario, c.getCode());
            resultados.add(new Respostas.ResultadoBusca(c.getCode(), c.getName(), detalhe,
                    c.getStatus().getRotulo(), cor, null, null));
            if (resultados.size() >= 12) {
                break;
            }
        }
        return resultados;
    }

    private List<Respostas.ResultadoBusca> professores(String termo) {
        List<Respostas.ResultadoBusca> resultados = new ArrayList<>();
        for (Professor p : banco.professores().listar()) {
            if (!p.getName().toLowerCase().contains(termo)) {
                continue;
            }
            Turma turma = banco.turmas().filtrar(t -> t.lecionadaPor(p.getId()))
                    .stream().findFirst().orElse(null);
            resultados.add(new Respostas.ResultadoBusca(
                    turma == null ? "" : turma.getCourseCode(),
                    "Prof. " + p.getName(),
                    turma == null ? p.getDepartment()
                            : turma.getCourseCode() + " · " + turma.getCourseName(),
                    null,
                    turma == null ? null : turma.getColor(),
                    p.getScores().getOverall(),
                    p.getId()));
        }
        return resultados;
    }

    private List<Respostas.ResultadoBusca> salas(Pessoa usuario, String termo) {
        Map<String, List<String>> porSala = new LinkedHashMap<>();
        for (Turma t : banco.turmas().listar()) {
            boolean minha = t.encontrarMatriculaDoAluno(usuario.getId()).isPresent()
                    || t.lecionadaPor(usuario.getId());
            if (!minha) {
                continue;
            }
            for (HorarioAula s : t.getSlots()) {
                if (!s.room().toLowerCase().contains(termo)) {
                    continue;
                }
                porSala.computeIfAbsent(s.room(), r -> new ArrayList<>());
                if (!porSala.get(s.room()).contains(t.getCourseCode())) {
                    porSala.get(s.room()).add(t.getCourseCode());
                }
            }
        }
        return porSala.entrySet().stream()
                .map(e -> new Respostas.ResultadoBusca(
                        e.getKey().substring(0, Math.min(6, e.getKey().length())),
                        e.getKey(),
                        String.join(" · ", e.getValue()),
                        null, null, null, null))
                .toList();
    }

    /** Cor da disciplina: a preferida do aluno se matriculado, senão derivada do código. */
    private Cor corPara(Pessoa usuario, String codigo) {
        return banco.turmas().listar().stream()
                .filter(t -> t.getCourseCode().equalsIgnoreCase(codigo))
                .map(t -> t.encontrarMatriculaDoAluno(usuario.getId())
                        .map(m -> m.getColor()).orElse(null))
                .filter(c -> c != null)
                .findFirst()
                .orElse(Cor.paraCodigo(codigo));
    }
}
