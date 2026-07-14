package br.unicamp.mc322.unicampus.persistencia;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Supplier;

/**
 * Persistência em arquivo JSON de um documento único (ex.: o currículo do
 * curso, as estatísticas do aluno), com o mesmo ciclo de vida do
 * {@link RepositorioJson}, para objetos que não são coleções.
 */
public class DocumentoJson<T> {

    private final Path arquivo;
    private final ObjectMapper mapper;
    private T valor;

    public DocumentoJson(Path arquivo, Class<T> tipo, ObjectMapper mapper, Supplier<T> seed) {
        this.arquivo = arquivo;
        this.mapper = mapper;
        if (Files.exists(arquivo)) {
            try {
                this.valor = mapper.readValue(arquivo.toFile(), tipo);
            } catch (IOException e) {
                throw new UncheckedIOException("Falha ao ler " + arquivo, e);
            }
        } else {
            this.valor = seed.get();
            persistir();
        }
    }

    public T get() {
        return valor;
    }

    public void set(T novoValor) {
        this.valor = novoValor;
        persistir();
    }

    public void persistir() {
        try {
            Files.createDirectories(arquivo.getParent());
            mapper.writerWithDefaultPrettyPrinter().writeValue(arquivo.toFile(), valor);
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao gravar " + arquivo, e);
        }
    }
}
