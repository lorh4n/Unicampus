package br.unicamp.mc322.unicampus.dominio.academico;

import br.unicamp.mc322.unicampus.dominio.Identificavel;
import br.unicamp.mc322.unicampus.dominio.Ids;
import br.unicamp.mc322.unicampus.dominio.RegrasAcademicas;
import br.unicamp.mc322.unicampus.dominio.alerta.GeradorDeAlerta;
import br.unicamp.mc322.unicampus.dominio.excecao.MatriculaNaoEncontradaException;
import br.unicamp.mc322.unicampus.dominio.excecao.PesoInvalidoException;
import br.unicamp.mc322.unicampus.dominio.excecao.ValidacaoException;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoFalta;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoNota;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Oferecimento de uma disciplina em um semestre. Contém as matrículas
 * (roster) e os critérios de avaliação (PDD), que não existem fora da turma.
 * O PDD deve somar 100% e notas/faltas só podem ser lançadas para alunos
 * matriculados.
 */
public class Turma implements Identificavel, GeradorDeAlerta {

    /** Alerta de faltas quando restam 2 ou menos antes do limite. */
    public static final int FALTAS_RESTANTES_PARA_ALERTA = 2;

    private String id;
    private String courseCode;
    private String courseName;
    private String className;
    private Cor color;
    private String professorId;
    private String professorName;
    private List<HorarioAula> slots = new ArrayList<>();
    private int totalHours;
    private int absenceLimit;
    private List<CriterioAvaliacao> criteria = new ArrayList<>();
    private List<Matricula> roster = new ArrayList<>();
    private StatusOferta status = StatusOferta.RASCUNHO;

    protected Turma() {
    }

    public Turma(String id, Disciplina disciplina, String className,
                 String professorId, String professorName,
                 List<HorarioAula> slots, StatusOferta status) {
        this.id = id;
        this.courseCode = disciplina.getCode();
        this.courseName = disciplina.getName();
        this.className = className;
        this.color = disciplina.getColor();
        this.professorId = professorId;
        this.professorName = professorName;
        this.slots = new ArrayList<>(slots);
        this.totalHours = disciplina.cargaHoraria();
        this.absenceLimit = RegrasAcademicas.limiteDeFaltas(this.totalHours);
        this.status = status;
    }

    /**
     * Define os critérios de avaliação. Valida que os pesos somam 100%
     * e preserva as notas já lançadas de critérios que continuam existindo.
     */
    public void definirCriterios(List<CriterioAvaliacao> novos) {
        int soma = RegrasAcademicas.somaDosPesos(novos);
        if (soma != 100) {
            throw new PesoInvalidoException(soma);
        }
        this.criteria = new ArrayList<>(novos);
        // garante que cada matrícula tenha entrada para todos os critérios atuais
        for (Matricula m : roster) {
            for (CriterioAvaliacao c : criteria) {
                m.getGrades().putIfAbsent(c.getId(), null);
            }
        }
    }

    /** Lança a nota de um aluno em um critério do PDD. */
    public Matricula lancarNota(String matriculaId, String criterionId, Double nota) {
        if (nota != null && (nota < 0 || nota > 10)) {
            throw new ValidacaoException("Nota deve estar entre 0,0 e 10,0");
        }
        if (criteria.stream().noneMatch(c -> c.getId().equals(criterionId))) {
            throw new ValidacaoException("Critério inexistente no PDD desta turma: " + criterionId);
        }
        Matricula m = matriculaPorId(matriculaId);
        m.lancarNota(criterionId, nota);
        // marca o critério como "realizado" na visão de referência da turma
        criteria.stream()
                .filter(c -> c.getId().equals(criterionId))
                .findFirst()
                .ifPresent(c -> c.setGrade(nota));
        return m;
    }

    /** Registra uma falta oficial para o aluno. */
    public Matricula registrarFalta(String matriculaId) {
        Matricula m = matriculaPorId(matriculaId);
        m.registrarFalta();
        return m;
    }

    /** Matricula um aluno nesta turma (com a cor de preferência dele). */
    public Matricula matricular(Aluno aluno, Cor corPreferida) {
        if (encontrarMatriculaDoAluno(aluno.getId()).isPresent()) {
            throw new ValidacaoException(aluno.getName() + " já está matriculado(a) em "
                    + courseCode + " · " + className);
        }
        Matricula nova = Matricula.nova(Ids.gerar("r"), aluno.getId(), aluno.getName(),
                aluno.getRa(), criteria, corPreferida);
        roster.add(nova);
        return nova;
    }

    /** Cancela a matrícula do aluno (trancamento). */
    public void desmatricular(String alunoId) {
        Matricula m = encontrarMatriculaDoAluno(alunoId)
                .orElseThrow(() -> new MatriculaNaoEncontradaException(
                        "aluno " + alunoId + " em " + courseCode + " · " + className));
        roster.remove(m);
    }

    public Matricula matriculaPorId(String matriculaId) {
        return roster.stream()
                .filter(m -> m.getId().equals(matriculaId))
                .findFirst()
                .orElseThrow(() -> new MatriculaNaoEncontradaException(
                        matriculaId + " em " + courseCode + " · " + className));
    }

    public Optional<Matricula> encontrarMatriculaDoAluno(String alunoId) {
        return roster.stream().filter(m -> alunoId.equals(m.getStudentId())).findFirst();
    }

    public boolean lecionadaPor(String professorId) {
        return this.professorId != null && this.professorId.equals(professorId);
    }

    /** Média ponderada atual de um aluno (null se nenhuma nota lançada). */
    public Double mediaDoAluno(Matricula m) {
        return RegrasAcademicas.mediaPonderada(criteria, m.getGrades());
    }

    /**
     * Gera alertas de falta (quando restam 2 ou menos) e de nota
     * (média abaixo de 5,0) para os alunos da turma.
     */
    @Override
    public List<Notificacao> gerarAlertas() {
        List<Notificacao> alertas = new ArrayList<>();
        long agora = System.currentTimeMillis();
        for (Matricula m : roster) {
            int restantes = RegrasAcademicas.faltasRestantes(m.getAbsences(), absenceLimit);
            if (restantes <= FALTAS_RESTANTES_PARA_ALERTA) {
                alertas.add(new NotificacaoFalta(Ids.gerar("n"), m.getStudentId(),
                        courseCode, m.getAbsences(), absenceLimit, agora));
            }
            Double media = mediaDoAluno(m);
            if (media != null && media < RegrasAcademicas.MEDIA_DE_APROVACAO) {
                alertas.add(new NotificacaoNota(Ids.gerar("n"), m.getStudentId(),
                        courseCode, courseName, media, agora));
            }
        }
        return alertas;
    }

    // A coordenação só altera a alocação, nunca PDD ou roster.
    public void realocar(Disciplina disciplina, String className,
                         String professorId, String professorName, List<HorarioAula> slots) {
        this.courseCode = disciplina.getCode();
        this.courseName = disciplina.getName();
        this.color = disciplina.getColor();
        this.className = className;
        this.professorId = professorId;
        this.professorName = professorName;
        this.slots = new ArrayList<>(slots);
        this.totalHours = disciplina.cargaHoraria();
        this.absenceLimit = RegrasAcademicas.limiteDeFaltas(this.totalHours);
    }

    // Getters com os mesmos nomes de campo usados no JSON do frontend.

    @Override
    public String getId() {
        return id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getClassName() {
        return className;
    }

    public Cor getColor() {
        return color;
    }

    public String getProfessorId() {
        return professorId;
    }

    public String getProfessorName() {
        return professorName;
    }

    public List<HorarioAula> getSlots() {
        return slots;
    }

    public int getTotalHours() {
        return totalHours;
    }

    public int getAbsenceLimit() {
        return absenceLimit;
    }

    public List<CriterioAvaliacao> getCriteria() {
        return criteria;
    }

    public List<Matricula> getRoster() {
        return roster;
    }

    public StatusOferta getStatus() {
        return status;
    }

    public void setStatus(StatusOferta status) {
        this.status = status;
    }

    /** Notas por critério, usadas nos cálculos de média e nota necessária. */
    public Map<String, Double> notasDe(String matriculaId) {
        return new LinkedHashMap<>(matriculaPorId(matriculaId).getGrades());
    }
}
