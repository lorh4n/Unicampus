package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.api.dto.Requisicoes;
import br.unicamp.mc322.unicampus.api.dto.Respostas;
import br.unicamp.mc322.unicampus.dominio.Ids;
import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.excecao.AutenticacaoException;
import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Pessoa;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;
import br.unicamp.mc322.unicampus.persistencia.Seed;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Autenticação por token opaco (Bearer). O papel do usuário nunca vem do
 * cliente: é decidido aqui pelo tipo concreto de
 * {@link Pessoa} encontrado no login ({@code Aluno}, {@code Professor} ou
 * {@code Coordenador}).
 */
public class ServicoAutenticacao {

    private final BancoDeDados banco;
    /** token → id da pessoa logada (sessões vivem só em memória). */
    private final Map<String, String> sessoes = new ConcurrentHashMap<>();

    public ServicoAutenticacao(BancoDeDados banco) {
        this.banco = banco;
    }

    public Respostas.Sessao login(Requisicoes.Login req) {
        if (req.ra() == null || req.ra().isBlank()) {
            throw new ValidacaoException("Informe o RA");
        }
        Pessoa pessoa = buscarPorRa(req.ra().trim())
                .orElseThrow(() -> new AutenticacaoException("RA ou senha inválidos"));
        if (!pessoa.senhaConfere(req.password())) {
            throw new AutenticacaoException("RA ou senha inválidos");
        }
        return abrirSessao(pessoa);
    }

    /** Cadastro de aluno: cria a conta e já o matricula nas turmas escolhidas. */
    public Respostas.Sessao cadastrar(Requisicoes.Cadastro req) {
        if (req.name() == null || req.name().isBlank() || req.ra() == null || req.ra().isBlank()) {
            throw new ValidacaoException("Nome e RA são obrigatórios");
        }
        String ra = req.ra().trim();
        if (buscarPorRa(ra).isPresent()) {
            throw new ValidacaoException("Já existe uma conta com o RA " + ra);
        }
        String senha = req.password() == null || req.password().isBlank()
                ? Seed.SENHA_PADRAO
                : req.password();
        if (senha.length() < 6) {
            throw new ValidacaoException("A senha precisa de pelo menos 6 caracteres");
        }
        Aluno aluno = new Aluno(Ids.gerar("stu"), req.name().trim(),
                "a" + ra + "@dac.unicamp.br",
                ra, senha,
                req.course() == null || req.course().isBlank() ? "Ciência da Computação" : req.course(),
                "42", Seed.SEMESTRE_ATUAL, 0, 0, 0, 0, 188);
        banco.alunos().adicionar(aluno);

        if (req.enrolledCodes() != null) {
            for (String codigo : req.enrolledCodes()) {
                primeiraTurmaAtiva(codigo).ifPresent(t -> {
                    t.matricular(aluno, Cor.paraCodigo(codigo));
                    banco.turmas().persistir();
                });
            }
        }
        return abrirSessao(aluno);
    }

    /** MVP: valida que o RA existe; o envio de e-mail fica fora do escopo. */
    public void solicitarResetDeSenha(String ra) {
        if (ra == null || buscarPorRa(ra.trim()).isEmpty()) {
            throw new ValidacaoException("RA não encontrado");
        }
    }

    /** Resolve o token Bearer para a pessoa logada (401 se inválido). */
    public Pessoa resolver(String token) {
        if (token == null || token.isBlank()) {
            throw new AutenticacaoException("Sessão ausente — entre novamente");
        }
        String pessoaId = sessoes.get(token);
        if (pessoaId == null) {
            throw new AutenticacaoException("Sessão expirada — entre novamente");
        }
        return buscarPorId(pessoaId)
                .orElseThrow(() -> new AutenticacaoException("Usuário da sessão não existe mais"));
    }

    private Respostas.Sessao abrirSessao(Pessoa pessoa) {
        String token = UUID.randomUUID().toString();
        sessoes.put(token, pessoa.getId());
        return new Respostas.Sessao(token, pessoa.montarPerfilSessao());
    }

    private Optional<Turma> primeiraTurmaAtiva(String courseCode) {
        return banco.turmas()
                .filtrar(t -> t.getCourseCode().equalsIgnoreCase(courseCode)
                        && t.getStatus() == StatusOferta.ATIVA)
                .stream()
                .findFirst();
    }

    public Optional<Pessoa> buscarPorRa(String ra) {
        Optional<Pessoa> aluno = banco.alunos().filtrar(a -> ra.equals(a.getRa()))
                .stream().map(p -> (Pessoa) p).findFirst();
        if (aluno.isPresent()) {
            return aluno;
        }
        Optional<Pessoa> professor = banco.professores().filtrar(p -> ra.equals(p.getRa()))
                .stream().map(p -> (Pessoa) p).findFirst();
        if (professor.isPresent()) {
            return professor;
        }
        return banco.coordenadores().filtrar(c -> ra.equals(c.getRa()))
                .stream().map(p -> (Pessoa) p).findFirst();
    }

    private Optional<Pessoa> buscarPorId(String id) {
        Optional<Pessoa> aluno = banco.alunos().buscarPorId(id).map(p -> p);
        if (aluno.isPresent()) {
            return aluno;
        }
        Optional<Pessoa> professor = banco.professores().buscarPorId(id).map(p -> p);
        if (professor.isPresent()) {
            return professor;
        }
        return banco.coordenadores().buscarPorId(id).map(p -> p);
    }
}
