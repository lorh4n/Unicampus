package br.unicamp.mc322.unicampus.dominio;

/**
 * Contrato mínimo de toda entidade persistível: ter um identificador único.
 * Usada como "bound" genérico pelo {@code Repositorio<T extends Identificavel>},
 * permitindo que o mesmo código de persistência sirva para qualquer entidade.
 */
public interface Identificavel {
    String getId();
}
