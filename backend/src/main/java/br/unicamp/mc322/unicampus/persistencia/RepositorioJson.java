package br.unicamp.mc322.unicampus.persistencia;

import br.unicamp.mc322.unicampus.dominio.Identificavel;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.function.Supplier;

/**
 * Implementação de {@link Repositorio} que persiste a coleção em um ARQUIVO
 * JSON (requisito de leitura/gravação em arquivo do enunciado).
 *
 * Ciclo de vida: no construtor, LÊ o arquivo se existir (senão, grava a carga
 * inicial fornecida pelo {@code seed}); depois disso, toda mutação chama
 * {@link #persistir()} e regrava o arquivo — o estado sobrevive a reinícios
 * do servidor.
 */
public class RepositorioJson<T extends Identificavel> implements Repositorio<T> {

    private final Path arquivo;
    private final ObjectMapper mapper;
    private final CollectionType tipoLista;
    private final List<T> cache;

    public RepositorioJson(Path arquivo, Class<T> tipo, ObjectMapper mapper, Supplier<List<T>> seed) {
        this.arquivo = arquivo;
        this.mapper = mapper;
        this.tipoLista = mapper.getTypeFactory().constructCollectionType(ArrayList.class, tipo);
        if (Files.exists(arquivo)) {
            this.cache = ler();
        } else {
            this.cache = new ArrayList<>(seed.get());
            persistir();
        }
    }

    private List<T> ler() {
        try {
            return mapper.readValue(arquivo.toFile(), tipoLista);
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao ler " + arquivo, e);
        }
    }

    @Override
    public void persistir() {
        try {
            Files.createDirectories(arquivo.getParent());
            // writerFor(tipoLista): serializa pelo tipo DECLARADO (a classe base),
            // garantindo o discriminador polimórfico (ex.: "kind" das notificações)
            mapper.writerFor(tipoLista).withDefaultPrettyPrinter()
                    .writeValue(arquivo.toFile(), cache);
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao gravar " + arquivo, e);
        }
    }

    @Override
    public List<T> listar() {
        return new ArrayList<>(cache);
    }

    @Override
    public Optional<T> buscarPorId(String id) {
        return cache.stream().filter(e -> e.getId().equals(id)).findFirst();
    }

    @Override
    public List<T> filtrar(Predicate<T> criterio) {
        return cache.stream().filter(criterio).toList();
    }

    @Override
    public void adicionar(T entidade) {
        cache.add(entidade);
        persistir();
    }

    @Override
    public void remover(String id) {
        cache.removeIf(e -> e.getId().equals(id));
        persistir();
    }

    @Override
    public int total() {
        return cache.size();
    }
}
