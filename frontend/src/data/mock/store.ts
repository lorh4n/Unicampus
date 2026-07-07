// Armazém do modo dev: coleções persistidas em localStorage para o CRUD
// funcionar de verdade entre reloads. Cada coleção é semeada na primeira leitura.

// Versão do esquema dos dados mock. Ao mudar o formato do seed (novos campos, etc.),
// bump esta versão: os dados antigos em localStorage são descartados e re-semeados,
// evitando crashes por dados com formato desatualizado.
const SCHEMA_VERSION = '2';
const PREFIX = `unicampus.dev.v${SCHEMA_VERSION}.`;

// Limpa coleções de versões anteriores uma única vez por carregamento.
(function purgeOldVersions() {
  try {
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('unicampus.dev.') && !k.startsWith(PREFIX)) stale.push(k);
    }
    stale.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ambiente sem localStorage — ignorar
  }
})();

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
