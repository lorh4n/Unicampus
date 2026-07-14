package br.unicamp.mc322.unicampus;

import br.unicamp.mc322.unicampus.api.ApiServer;
import br.unicamp.mc322.unicampus.persistencia.BancoDeDados;

import java.nio.file.Path;

/**
 * Unicampus: backend do trabalho final de MC322 (gestão acadêmica).
 *
 * Sobe o servidor HTTP (porta 8080 por padrão) com os dados persistidos em
 * arquivos JSON (diretório ./data, criado com carga de demonstração na
 * primeira execução). Configurável por variáveis de ambiente:
 *   PORT                - porta HTTP
 *   UNICAMPUS_DATA_DIR  - diretório dos arquivos de dados
 *
 * Para ligar o frontend: defina VITE_API_URL=http://localhost:8080/api
 * no frontend/.env (ver frontend/README.md).
 */
public final class Main {

    private Main() {
    }

    public static void main(String[] args) {
        int porta = Integer.parseInt(env("PORT", "8080"));
        Path dados = Path.of(env("UNICAMPUS_DATA_DIR", "data"));

        BancoDeDados banco = new BancoDeDados(dados);
        new ApiServer(banco).iniciar(porta);

        System.out.println();
        System.out.println("Unicampus API no ar: http://localhost:" + porta + "/api");
        System.out.println("Dados em: " + dados.toAbsolutePath());
        System.out.println("Contas de demonstração (senha 123456):");
        System.out.println("  Aluna       RA 247195 (Marina Alves)");
        System.out.println("  Professora  RA 000101 (Esther Colombini)");
        System.out.println("  Coordenação RA 000042 (Roberta Campos)");
    }

    private static String env(String nome, String padrao) {
        String valor = System.getenv(nome);
        return valor == null || valor.isBlank() ? padrao : valor;
    }
}
