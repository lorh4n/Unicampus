package br.unicamp.mc322.unicampus.persistencia;

import br.unicamp.mc322.unicampus.dominio.academico.AtividadeAdmin;
import br.unicamp.mc322.unicampus.dominio.academico.Cor;
import br.unicamp.mc322.unicampus.dominio.academico.CriterioAvaliacao;
import br.unicamp.mc322.unicampus.dominio.academico.Curriculo;
import br.unicamp.mc322.unicampus.dominio.academico.Disciplina;
import br.unicamp.mc322.unicampus.dominio.academico.EstatisticasAluno;
import br.unicamp.mc322.unicampus.dominio.academico.HorarioAula;
import br.unicamp.mc322.unicampus.dominio.academico.ItemCurriculo;
import br.unicamp.mc322.unicampus.dominio.academico.Matricula;
import br.unicamp.mc322.unicampus.dominio.academico.StatusIntegralizacao;
import br.unicamp.mc322.unicampus.dominio.academico.StatusOferta;
import br.unicamp.mc322.unicampus.dominio.academico.Turma;
import br.unicamp.mc322.unicampus.dominio.notificacao.Notificacao;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoFalta;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoNota;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoPrazo;
import br.unicamp.mc322.unicampus.dominio.notificacao.NotificacaoSistema;
import br.unicamp.mc322.unicampus.dominio.pessoa.Aluno;
import br.unicamp.mc322.unicampus.dominio.pessoa.Coordenador;
import br.unicamp.mc322.unicampus.dominio.pessoa.Professor;
import br.unicamp.mc322.unicampus.dominio.pessoa.TurmaLecionada;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Carga inicial dos arquivos de dados — espelha o seed do frontend
 * ({@code frontend/src/data/mock/seed.ts}), com uma diferença importante:
 * aqui a FONTE DE VERDADE É ÚNICA. As disciplinas do aluno são derivadas das
 * turmas em que ele está matriculado (roster), então o seed inclui a turma de
 * F 128 que no mock do frontend só existia do lado do aluno.
 *
 * Senha de todos os usuários de demonstração: {@code 123456}.
 */
public final class Seed {

    public static final String SENHA_PADRAO = "123456";
    public static final String SEMESTRE_ATUAL = "2026.1";

    private Seed() {
    }

    // ------------------------------------------------------------------
    // Pessoas
    // ------------------------------------------------------------------

    public static List<Aluno> alunos() {
        List<Aluno> l = new ArrayList<>();
        l.add(new Aluno("stu-1", "Marina Alves", "m247195@dac.unicamp.br", "247195", SENHA_PADRAO,
                "Ciência da Computação", "42", SEMESTRE_ATUAL, 8.4, 0.3, 0.81, 152, 188));
        l.add(new Aluno("stu-2", "Bruno Castro", "b251034@dac.unicamp.br", "251034", SENHA_PADRAO,
                "Ciência da Computação", "42", SEMESTRE_ATUAL, 7.1, 0.1, 0.68, 128, 188));
        l.add(new Aluno("stu-3", "Camila Reis", "c248871@dac.unicamp.br", "248871", SENHA_PADRAO,
                "Engenharia de Computação", "34", SEMESTRE_ATUAL, 9.0, 0.2, 0.92, 173, 188));
        l.add(new Aluno("stu-4", "Diego Fontes", "d253312@dac.unicamp.br", "253312", SENHA_PADRAO,
                "Ciência da Computação", "42", SEMESTRE_ATUAL, 5.8, -0.2, 0.55, 103, 188));
        l.add(new Aluno("stu-5", "Elisa Nogueira", "e246650@dac.unicamp.br", "246650", SENHA_PADRAO,
                "Matemática Aplicada", "28", SEMESTRE_ATUAL, 8.9, 0.4, 0.88, 165, 188));
        l.add(new Aluno("stu-6", "Felipe Souza", "f252190@dac.unicamp.br", "252190", SENHA_PADRAO,
                "Física", "40", SEMESTRE_ATUAL, 7.6, 0.0, 0.71, 133, 188));
        l.add(new Aluno("stu-7", "Gabriela Lima", "g249904@dac.unicamp.br", "249904", SENHA_PADRAO,
                "Ciência da Computação", "42", SEMESTRE_ATUAL, 8.2, 0.1, 0.79, 148, 188));
        l.add(new Aluno("stu-8", "Henrique Melo", "h254028@dac.unicamp.br", "254028", SENHA_PADRAO,
                "Engenharia Elétrica", "11", SEMESTRE_ATUAL, 6.9, 0.3, 0.63, 118, 188));
        return l;
    }

    public static List<Professor> professores() {
        List<Professor> l = new ArrayList<>();
        l.add(new Professor("prof-colombini", "Esther Colombini", "esther@ic.unicamp.br", "000101", SENHA_PADRAO,
                "Instituto de Computação", List.of(
                new TurmaLecionada("2025.2", "MC322", "Programação Orientada a Objetos", "Turma B"),
                new TurmaLecionada("2025.1", "MC322", "Programação Orientada a Objetos", "Turma A"),
                new TurmaLecionada("2024.2", "MC102", "Algoritmos e Prog. de Computadores", "Turma D"))));
        l.add(new Professor("prof-ramos", "Carlos Ramos", "carlos.ramos@ime.unicamp.br", "000102", SENHA_PADRAO,
                "Instituto de Matemática", List.of(
                new TurmaLecionada("2025.2", "MA111", "Cálculo I", "Turma A"),
                new TurmaLecionada("2025.1", "MA211", "Cálculo II", "Turma C"))));
        l.add(new Professor("prof-lemos", "Marina Lemos", "marina.lemos@ifi.unicamp.br", "000103", SENHA_PADRAO,
                "Instituto de Física", List.of(
                new TurmaLecionada("2025.2", "F 128", "Física Geral I", "Turma A"))));
        l.add(new Professor("prof-meidanis", "João Meidanis", "meidanis@ic.unicamp.br", "000104", SENHA_PADRAO,
                "Instituto de Computação", List.of(
                new TurmaLecionada("2025.2", "MC358", "Projeto e Análise de Algoritmos", "Turma B"),
                new TurmaLecionada("2025.1", "MC458", "Projeto e Análise de Algoritmos II", "Turma A"))));
        l.add(new Professor("prof-azevedo", "Rodolfo Azevedo", "rodolfo@ic.unicamp.br", "000105", SENHA_PADRAO,
                "Instituto de Computação", List.of(
                new TurmaLecionada("2025.1", "MC404", "Organização Básica de Computadores", "Turma A"))));
        l.add(new Professor("prof-santos", "Núbia Santos", "nubia.santos@ime.unicamp.br", "000106", SENHA_PADRAO,
                "Instituto de Matemática", List.of(
                new TurmaLecionada("2025.2", "ME323", "Probabilidade e Estatística", "Turma A"))));
        l.add(new Professor("prof-dias", "Ana Dias", "ana.dias@ime.unicamp.br", "000107", SENHA_PADRAO,
                "Instituto de Matemática", List.of()));
        l.add(new Professor("prof-rezende", "Pedro Rezende", "rezende@ic.unicamp.br", "000108", SENHA_PADRAO,
                "Instituto de Computação", List.of()));
        l.add(new Professor("prof-tavares", "Luís Tavares", "luis.tavares@fee.unicamp.br", "000109", SENHA_PADRAO,
                "Faculdade de Engenharia Elétrica", List.of()));
        return l;
    }

    public static List<Coordenador> coordenadores() {
        return List.of(new Coordenador("admin-1", "Roberta Campos", "roberta@ic.unicamp.br",
                "000042", SENHA_PADRAO, "Coordenação · IC", "Instituto de Computação"));
    }

    // ------------------------------------------------------------------
    // Catálogo de disciplinas (coordenação)
    // ------------------------------------------------------------------

    public static List<Disciplina> disciplinas() {
        List<Disciplina> l = new ArrayList<>();
        l.add(new Disciplina("ac1", "MC322", "Programação Orientada a Objetos", "Computação", 4, Cor.LARANJA, StatusOferta.ATIVA));
        l.add(new Disciplina("ac2", "MA111", "Cálculo I", "Matemática", 6, Cor.AZUL, StatusOferta.ATIVA));
        l.add(new Disciplina("ac3", "F 128", "Física Geral I", "Física", 4, Cor.ROXO, StatusOferta.ATIVA));
        l.add(new Disciplina("ac4", "MC358", "Projeto e Análise de Algoritmos", "Computação", 4, Cor.VERDE, StatusOferta.ATIVA));
        l.add(new Disciplina("ac5", "MC404", "Organização Básica de Computadores", "Computação", 4, Cor.ROSA, StatusOferta.ATIVA));
        l.add(new Disciplina("ac6", "MA311", "Cálculo III", "Matemática", 4, Cor.LARANJA, StatusOferta.ATIVA));
        l.add(new Disciplina("ac7", "MC102", "Algoritmos e Prog. de Computadores", "Computação", 6, Cor.AZUL, StatusOferta.ATIVA));
        l.add(new Disciplina("ac8", "EA513", "Circuitos Elétricos", "Engenharia", 4, Cor.ROXO, StatusOferta.RASCUNHO));
        l.add(new Disciplina("ac9", "ME323", "Probabilidade e Estatística", "Matemática", 6, Cor.LARANJA, StatusOferta.ATIVA));
        l.add(new Disciplina("ac10", "MC536", "Bancos de Dados", "Computação", 4, Cor.AZUL, StatusOferta.ATIVA));
        l.add(new Disciplina("ac11", "LA122", "Inglês Instrumental", "Linguagens", 2, Cor.ROXO, StatusOferta.ATIVA));
        return l;
    }

    // ------------------------------------------------------------------
    // Turmas — fonte única de verdade das notas/faltas
    // ------------------------------------------------------------------

    private static CriterioAvaliacao crit(String label, int weight, Double grade, String date) {
        return new CriterioAvaliacao(CriterioAvaliacao.idParaRotulo(label), label, weight, grade, date, grade != null);
    }

    private static HorarioAula slot(String id, int weekday, String start, String end, String room) {
        return new HorarioAula(id, weekday, start, end, room);
    }

    private static Map<String, Double> notas(List<CriterioAvaliacao> criterios, Double... valores) {
        Map<String, Double> m = new LinkedHashMap<>();
        for (int i = 0; i < criterios.size(); i++) {
            m.put(criterios.get(i).getId(), i < valores.length ? valores[i] : null);
        }
        return m;
    }

    public static List<Turma> turmas() {
        Map<String, Disciplina> cat = new LinkedHashMap<>();
        for (Disciplina d : disciplinas()) {
            cat.put(d.getCode(), d);
        }
        List<Turma> l = new ArrayList<>();

        // MC322 · Turma A — Esther Colombini (conta de demonstração do professor)
        Turma mc322 = new Turma("turma-mc322-a", cat.get("MC322"), "Turma A",
                "prof-colombini", "Esther Colombini",
                List.of(slot("s1", 1, "08:00", "10:00", "CB02"),
                        slot("s2", 3, "08:00", "10:00", "CB02"),
                        slot("s3", 5, "08:00", "10:00", "Lab LMC")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cMc322 = List.of(
                crit("Prova P1", 30, 8.5, "02/04"),
                crit("Prova P2", 30, null, "11/06"),
                crit("Trabalho final", 40, 7.2, "18/06"));
        mc322.definirCriterios(new ArrayList<>(cMc322));
        mc322.getRoster().add(new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cMc322, 8.5, null, 7.2), 5, Cor.LARANJA));
        mc322.getRoster().add(new Matricula("r2", "stu-2", "Bruno Castro", "251034",
                notas(cMc322, 6.0, null, 6.5), 2, Cor.LARANJA));
        mc322.getRoster().add(new Matricula("r3", "stu-3", "Camila Reis", "248871",
                notas(cMc322, 9.2, null, 8.8), 0, Cor.LARANJA));
        mc322.getRoster().add(new Matricula("r4", "stu-4", "Diego Fontes", "253312",
                notas(cMc322, 4.5, null, 5.0), 7, Cor.LARANJA));
        l.add(mc322);

        // MA111 · Turma C — Carlos Ramos
        Turma ma111 = new Turma("turma-ma111-c", cat.get("MA111"), "Turma C",
                "prof-ramos", "Carlos Ramos",
                List.of(slot("s1", 1, "14:00", "16:00", "IM02"),
                        slot("s2", 4, "14:00", "16:00", "IM02")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cMa111 = List.of(
                crit("Prova P1", 35, 4.2, "08/04"),
                crit("Prova P2", 35, 5.0, "27/05"),
                crit("Prova P3", 30, null, "24/06"));
        ma111.definirCriterios(new ArrayList<>(cMa111));
        Matricula mMa111 = new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cMa111, 4.2, 5.0, null), 3, Cor.AZUL);
        mMa111.setSelfAbsences(4);
        ma111.getRoster().add(mMa111);
        ma111.getRoster().add(new Matricula("r2", "stu-2", "Bruno Castro", "251034",
                notas(cMa111, 7.0, 6.5, null), 1, Cor.AZUL));
        l.add(ma111);

        // F 128 · Turma B — Marina Lemos (no mock do frontend só existia do lado do aluno)
        Turma f128 = new Turma("turma-f128-b", cat.get("F 128"), "Turma B",
                "prof-lemos", "Marina Lemos",
                List.of(slot("s1", 2, "10:00", "12:00", "IFGW"),
                        slot("s2", 3, "10:00", "12:00", "Lab IFGW")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cF128 = List.of(
                crit("Prova P1", 40, 6.0, "10/04"),
                crit("Prova P2", 40, null, "19/06"),
                crit("Laboratório", 20, 7.5, "12/06"));
        f128.definirCriterios(new ArrayList<>(cF128));
        f128.getRoster().add(new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cF128, 6.0, null, 7.5), 6, Cor.ROXO));
        f128.getRoster().add(new Matricula("r2", "stu-6", "Felipe Souza", "252190",
                notas(cF128, 8.1, null, 8.9), 1, Cor.ROXO));
        l.add(f128);

        // MC358 · Turma A — João Meidanis
        Turma mc358 = new Turma("turma-mc358-a", cat.get("MC358"), "Turma A",
                "prof-meidanis", "João Meidanis",
                List.of(slot("s1", 2, "19:00", "21:00", "CB09"),
                        slot("s2", 4, "19:00", "21:00", "CB09")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cMc358 = List.of(
                crit("Prova P1", 30, 8.0, "04/04"),
                crit("Prova P2", 30, null, "13/06"),
                crit("Listas", 40, 8.4, "30/05"));
        mc358.definirCriterios(new ArrayList<>(cMc358));
        mc358.getRoster().add(new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cMc358, 8.0, null, 8.4), 1, Cor.VERDE));
        l.add(mc358);

        // MC404 · Turma A — Rodolfo Azevedo
        Turma mc404 = new Turma("turma-mc404-a", cat.get("MC404"), "Turma A",
                "prof-azevedo", "Rodolfo Azevedo",
                List.of(slot("s1", 3, "14:00", "16:00", "CB06"),
                        slot("s2", 5, "14:00", "16:00", "Lab LSC")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cMc404 = List.of(
                crit("Prova P1", 30, 7.5, "09/04"),
                crit("Prova P2", 30, null, "16/06"),
                crit("Projeto", 40, 6.7, "02/06"));
        mc404.definirCriterios(new ArrayList<>(cMc404));
        mc404.getRoster().add(new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cMc404, 7.5, null, 6.7), 2, Cor.ROSA));
        mc404.getRoster().add(new Matricula("r2", "stu-5", "Elisa Nogueira", "246650",
                notas(cMc404, 8.8, null, 9.0), 0, Cor.ROSA));
        l.add(mc404);

        // ME323 · Turma B — Núbia Santos
        Turma me323 = new Turma("turma-me323-b", cat.get("ME323"), "Turma B",
                "prof-santos", "Núbia Santos",
                List.of(slot("s1", 2, "08:00", "10:00", "PB Sala 3"),
                        slot("s2", 4, "08:00", "10:00", "PB Sala 3")),
                StatusOferta.ATIVA);
        List<CriterioAvaliacao> cMe323 = List.of(
                crit("Prova P1", 30, null, "15/04"),
                crit("Prova P2", 30, null, "20/05"),
                crit("Prova P3", 40, null, "26/06"));
        me323.definirCriterios(new ArrayList<>(cMe323));
        Matricula mMe323 = new Matricula("r1", "stu-1", "Marina Alves", "247195",
                notas(cMe323), 0, Cor.LARANJA);
        mMe323.setSelfAbsences(1);
        me323.getRoster().add(mMe323);
        l.add(me323);

        // Turmas ofertadas SEM a Marina — aparecem em "Matricular-se em turma"
        Turma mc536 = new Turma("turma-mc536-a", cat.get("MC536"), "Turma A",
                "prof-rezende", "Pedro Rezende",
                List.of(slot("s1", 1, "16:00", "18:00", "CB03"),
                        slot("s2", 3, "16:00", "18:00", "CB03")),
                StatusOferta.ATIVA);
        mc536.definirCriterios(new ArrayList<>(List.of(crit("Prova", 40, null, null),
                crit("Projeto de BD", 60, null, null))));
        l.add(mc536);

        Turma la122 = new Turma("turma-la122-e", cat.get("LA122"), "Turma E",
                "prof-tavares", "Luís Tavares",
                List.of(slot("s1", 5, "10:00", "12:00", "IEL 12")),
                StatusOferta.ATIVA);
        la122.definirCriterios(new ArrayList<>(List.of(crit("Participação", 40, null, null),
                crit("Prova final", 60, null, null))));
        l.add(la122);

        return l;
    }

    // ------------------------------------------------------------------
    // Notificações da Marina (stu-1)
    // ------------------------------------------------------------------

    public static List<Notificacao> notificacoes() {
        long agora = System.currentTimeMillis();
        long hora = 60L * 60 * 1000;
        List<Notificacao> l = new ArrayList<>();
        l.add(new NotificacaoFalta("n1", "stu-1", "F 128", 6, 8, agora - 2 * hora));
        l.add(new NotificacaoNota("n2", "stu-1", "MA111", "Cálculo I", 4.6, agora - 5 * hora));
        l.add(new NotificacaoPrazo("n3", "stu-1", "MC322", "entrega do trabalho final",
                "18/06 · faltam 5 dias", agora - 26 * hora));
        NotificacaoSistema n4 = new NotificacaoSistema("n4", "stu-1", "Matrícula 2026.2 aberta",
                "Ajuste de matrícula a partir de 28/07.", agora - 50 * hora);
        n4.marcarLida();
        l.add(n4);
        return l;
    }

    // ------------------------------------------------------------------
    // Feed de atividade do painel admin
    // ------------------------------------------------------------------

    public static List<AtividadeAdmin> atividades() {
        long agora = System.currentTimeMillis();
        long min = 60L * 1000;
        List<AtividadeAdmin> l = new ArrayList<>();
        l.add(new AtividadeAdmin("a1", "criacao", "Disciplina MC404 criada por você", agora - 12 * min));
        l.add(new AtividadeAdmin("a2", "alocacao", "Prof. Carlos Ramos alocado em MA111 · Turma D", agora - 60 * min));
        l.add(new AtividadeAdmin("a3", "matricula", "18 novas matrículas em MC102", agora - 180 * min));
        l.add(new AtividadeAdmin("a4", "criterios", "Critérios de F 128 atualizados", agora - 26 * 60 * min));
        return l;
    }

    // ------------------------------------------------------------------
    // Currículo (árvore de integralização) e estatísticas
    // ------------------------------------------------------------------

    private static ItemCurriculo cc(String code, String name, int credits, int semester,
                                    StatusIntegralizacao status, String... prereqs) {
        return new ItemCurriculo(code, name, credits, semester, status, List.of(prereqs));
    }

    public static Curriculo curriculo() {
        StatusIntegralizacao ap = StatusIntegralizacao.APROVADA;
        StatusIntegralizacao cu = StatusIntegralizacao.CURSANDO;
        StatusIntegralizacao di = StatusIntegralizacao.DISPONIVEL;
        StatusIntegralizacao bl = StatusIntegralizacao.BLOQUEADA;
        List<ItemCurriculo> cursos = List.of(
                cc("MC102", "Algoritmos e Prog. de Computadores", 6, 1, ap),
                cc("MA111", "Cálculo I", 6, 1, ap),
                cc("MA141", "Geometria Analítica", 6, 1, ap),
                cc("F 128", "Física Geral I", 4, 1, ap),
                cc("F 129", "Física Experimental I", 2, 1, ap),
                cc("LA122", "Inglês Instrumental", 2, 1, ap),

                cc("MC202", "Estruturas de Dados", 6, 2, ap, "MC102"),
                cc("MA211", "Cálculo II", 6, 2, ap, "MA111"),
                cc("MA327", "Álgebra Linear", 6, 2, ap, "MA141"),
                cc("F 228", "Física Geral II", 4, 2, ap, "F 128"),
                cc("F 229", "Física Experimental II", 2, 2, ap, "F 129"),

                cc("MC322", "Prog. Orientada a Objetos", 4, 3, cu, "MC202"),
                cc("MC358", "Projeto e Análise de Algoritmos", 4, 3, cu, "MC202", "MA327"),
                cc("MC404", "Org. Básica de Computadores", 4, 3, cu, "MC102"),
                cc("MA311", "Cálculo III", 4, 3, ap, "MA211"),
                cc("ME323", "Probabilidade e Estatística", 6, 3, ap, "MA211"),

                cc("MC536", "Bancos de Dados", 4, 4, di, "MC202"),
                cc("MC458", "Análise de Algoritmos II", 4, 4, bl, "MC358"),
                cc("MC426", "Engenharia de Software", 4, 4, bl, "MC322"),
                cc("MO401", "Arquitetura de Computadores", 4, 4, bl, "MC404"),
                cc("MC613", "Linguagens Formais e Autômatos", 6, 4, bl, "MC358"),

                cc("MC658", "Inteligência Artificial", 4, 5, bl, "MC358"),
                cc("MO431", "Sistemas Operacionais", 4, 5, bl, "MO401"),
                cc("MC558", "Estruturas de Dados II", 4, 5, bl, "MC458"),
                cc("EA513", "Circuitos Lógicos", 4, 5, bl, "MC404"),

                cc("MC886", "Aprendizado de Máquina", 4, 6, bl, "MC658"),
                cc("MC723", "Redes de Computadores", 4, 6, bl, "MO431"),
                cc("MC750", "Construção de Interfaces", 4, 6, bl, "MC322"),
                cc("MS512", "Cálculo Numérico", 4, 6, bl, "MA311"),

                cc("MC920", "Processamento de Imagens", 4, 7, bl, "MC886"),
                cc("MC832", "Sistemas Distribuídos", 4, 7, bl, "MC723"),
                cc("OPT 1", "Optativa / Eletiva", 4, 7, bl),

                cc("MC030", "Trabalho de Conclusão de Curso", 6, 8, bl, "MC426"),
                cc("OPT 2", "Optativa / Eletiva", 4, 8, bl),
                cc("AA200", "Atividades Acad. e de Extensão", 4, 8, bl));
        return new Curriculo("Ciência da Computação", "42", 62, 148, 240, "2028.1",
                new ArrayList<>(cursos));
    }

    public static EstatisticasAluno estatisticas() {
        return new EstatisticasAluno(List.of(
                new EstatisticasAluno.SemestreCr("24.1", 7.6),
                new EstatisticasAluno.SemestreCr("24.2", 7.9),
                new EstatisticasAluno.SemestreCr("25.1", 8.0),
                new EstatisticasAluno.SemestreCr("25.2", 8.1),
                new EstatisticasAluno.SemestreCr("26.1", 8.4)),
                87, 24);
    }
}
