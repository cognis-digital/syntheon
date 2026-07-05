#!/usr/bin/env bash
# Syntheon — cross-platform installer (macOS / Linux). Idempotent.
set -euo pipefail
cd "$(dirname "$0")"

need() { command -v "$1" >/dev/null 2>&1; }

echo "▶ Syntheon setup"
if ! need node; then
  echo "✗ Node.js not found. Install Node ≥ 20 from https://nodejs.org (or nvm) and re-run." >&2
  exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "✗ Node $(node -v) found; Syntheon needs ≥ 20." >&2; exit 1
fi
echo "✓ Node $(node -v)"

echo "▶ Installing dependencies (npm install)…"
npm install --no-audit --no-fund

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
  echo "✓ Created .env.local from .env.example (fill in only the integrations you enable)"
fi

if need ollama; then echo "✓ Ollama detected — local generation is available"; else
  echo "ℹ Ollama not found (optional). Install from https://ollama.com for local-AI generation."; fi

cat <<'EOF'

✓ Syntheon is ready.

  npm run studio     # menu: pick features → generate + verify your app
  npm run dev        # run the app at http://localhost:3000
  npm run build      # production build (typecheck · lint · test · build)

Docs: ./DESIGN.md · Compare: ./COMPARISON.md
EOF
