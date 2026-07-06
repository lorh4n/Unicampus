// Armazém do modo dev: coleções persistidas em localStorage para o CRUD
// funcionar de verdade entre reloads. Cada coleção é semeada na primeira leitura.

const PREFIX = 'unicampus.dev.';

export function loadCollection<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // valor corrompido — cai no seed
  }
  saveCollection(key, seed);
  return seed;
}

export function saveCollection<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

/** Latência artificial pequena para estados de loading serem visíveis. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
