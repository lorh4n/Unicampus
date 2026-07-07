#!/usr/bin/env bash
# rodar.sh — sobe o Unicampus COMPLETO (backend Java + frontend web) com um comando.
#
#   ./rodar.sh
#
# Backend:  http://localhost:8080/api   (dados em backend/data/)
# Frontend: http://localhost:5173
# Ctrl+C encerra os dois.
#
# Pré-requisitos: JDK 17+ e Node 18+ (npm).
set -euo pipefail
cd "$(dirname "$0")"

API_PORT="${PORT:-8080}"
API_URL="http://localhost:${API_PORT}/api"

# ---------------------------------------------------------------- checagens
command -v java >/dev/null 2>&1 || { echo "❌ Java não encontrado — instale um JDK 17+."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm não encontrado — instale o Node 18+."; exit 1; }

# ------------------------------------------------- frontend: deps e .env
if [ ! -d frontend/node_modules ]; then
  echo "📦 Instalando dependências do frontend (primeira vez)..."
  (cd frontend && npm install)
fi
if ! grep -qs '^VITE_API_URL=' frontend/.env 2>/dev/null; then
  echo "VITE_API_URL=${API_URL}" >> frontend/.env
  echo "🔧 frontend/.env criado apontando para ${API_URL}"
fi

# ------------------------------------------------------------- backend
echo "☕ Compilando o backend (Gradle)..."
(cd backend && ./gradlew --quiet installDist)

echo "☕ Subindo o backend em ${API_URL} ..."
PORT="$API_PORT" UNICAMPUS_DATA_DIR="$PWD/backend/data" \
  backend/build/install/unicampus-backend/bin/unicampus-backend &
BACK_PID=$!
trap 'echo; echo "🛑 Encerrando o backend..."; kill "$BACK_PID" 2>/dev/null || true; wait "$BACK_PID" 2>/dev/null || true' EXIT INT TERM

# espera a API responder (até 60 s)
for _ in $(seq 1 60); do
  curl -sf "http://localhost:${API_PORT}/" >/dev/null 2>&1 && break
  kill -0 "$BACK_PID" 2>/dev/null || { echo "❌ O backend caiu ao iniciar."; exit 1; }
  sleep 1
done
curl -sf "http://localhost:${API_PORT}/" >/dev/null 2>&1 || { echo "❌ A API não respondeu a tempo."; exit 1; }

echo
echo "✅ Backend no ar: ${API_URL}"
echo "   Contas de demonstração (senha 123456):"
echo "     Aluna       RA 247195   ·   Professora  RA 000101   ·   Coordenação RA 000042"
echo

# ------------------------------------------------ frontend (em 1º plano)
echo "🌐 Subindo o frontend em http://localhost:5173 ..."
cd frontend && npm run dev
