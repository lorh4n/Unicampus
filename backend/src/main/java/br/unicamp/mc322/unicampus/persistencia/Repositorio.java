package br.unicamp.mc322.unicampus.persistencia;

import br.unicamp.mc322.unicampus.dominio.Identificavel;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

/**
 * INTERFACE (requisito do enunciado) — contrato genérico de persistência de
 * uma coleção de entidades. A implementação {@link RepositorioJson} LÊ e
 * GRAVA os elementos em ARQUIVO (requisito de arquivos do enunciado); os
 * serviços dependem apenas deste contrato, nunca do formato de armazenamento.
 */
public interface Repositorio<T extends Identificavel> {

    List<T> listar();

    Optional<T> buscarPorId(String id);

    List<T> filtrar(Predicate<T> criterio);

    void adicionar(T entidade);

    void remover(String id);

    /** Grava o estado atual da coleção no arquivo. */
    void persistir();

    int total();
}
