package br.unicamp.mc322.unicampus.dominio.excecao;

/** EXCEÇÃO PRÓPRIA: aluno não matriculado na turma consultada. */
public class MatriculaNaoEncontradaException extends UnicampusException {

    public MatriculaNaoEncontradaException(String detalhe) {
        super("Matrícula não encontrada: " + detalhe, 404);
    }
}
