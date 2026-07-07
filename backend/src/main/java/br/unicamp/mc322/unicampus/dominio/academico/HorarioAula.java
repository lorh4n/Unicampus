package br.unicamp.mc322.unicampus.dominio.academico;

/**
 * Um horário semanal de aula ({@code ClassSlot} no contrato do frontend).
 * weekday: 1=Seg .. 5=Sex; horários "HH:mm".
 */
public record HorarioAula(String id, int weekday, String start, String end, String room) {
}
