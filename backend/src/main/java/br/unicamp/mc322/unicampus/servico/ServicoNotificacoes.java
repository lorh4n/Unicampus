package br.unicamp.mc322.unicampus.servico;

import br.unicamp.mc322.unicampus.dominio.excecao.RecursoNaoEncontradoException;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.pessoa.Pessoa;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;

import java.util.Comparator;
import java.util.List;

/** Notificações por usuário: listagem, leitura e criação de alertas. */
public class ServicoNotificacoes {

    private final BancoDeDados banco;

    public ServicoNotificacoes(BancoDeDados banco) {
        this.banco = banco;
    }

    public List<Notificacao> listar(Pessoa usuario) {
        return banco.notificacoes()
                .filtrar(n -> usuario.getId().equals(n.getOwnerId()))
                .stream()
                .sorted(Comparator.comparingLong(Notificacao::getCreatedAt).reversed())
                .toList();
    }

    public void alternarLida(Pessoa usuario, String id) {
        Notificacao n = banco.notificacoes().buscarPorId(id)
                .filter(x -> usuario.getId().equals(x.getOwnerId()))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Notificação não encontrada"));
        n.alternarLida();
        banco.notificacoes().persistir();
    }

    public void marcarTodasLidas(Pessoa usuario) {
        listar(usuario).forEach(Notificacao::marcarLida);
        banco.notificacoes().persistir();
    }

    /**
     * Registra um alerta gerado por um {@code GeradorDeAlerta}, evitando
     * duplicar: se o dono já tem uma notificação não lida com o mesmo título,
     * o novo alerta é descartado.
     */
    public void registrarSeInedita(Notificacao alerta) {
        boolean duplicada = banco.notificacoes().filtrar(n ->
                !n.isRead()
                        && n.getOwnerId() != null
                        && n.getOwnerId().equals(alerta.getOwnerId())
                        && n.getTitle().equals(alerta.getTitle()))
                .stream().findAny().isPresent();
        if (!duplicada) {
            banco.notificacoes().adicionar(alerta);
        }
    }
}
