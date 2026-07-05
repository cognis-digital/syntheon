# Syntheon — cross-platform installer (Windows PowerShell). Idempotent.
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "> Syntheon setup"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js not found. Install Node >= 20 from https://nodejs.org and re-run."; exit 1
}
$major = [int](node -p "process.versions.node.split('.')[0]")
if ($major -lt 20) { Write-Error "Node $(node -v) found; Syntheon needs >= 20."; exit 1 }
Write-Host "  Node $(node -v) OK"

Write-Host "> Installing dependencies (npm install)..."
npm install --no-audit --no-fund

if ((-not (Test-Path .env.local)) -and (Test-Path .env.example)) {
  Copy-Item .env.example .env.local
  Write-Host "  Created .env.local from .env.example"
}

if (Get-Command ollama -ErrorAction SilentlyContinue) {
  Write-Host "  Ollama detected - local generation available"
} else {
  Write-Host "  Ollama not found (optional). Install from https://ollama.com for local-AI generation."
}

Write-Host ""
Write-Host "Syntheon is ready."
Write-Host "  npm run studio    # menu: pick features -> generate + verify"
Write-Host "  npm run dev       # run at http://localhost:3000"
Write-Host "  npm run build     # typecheck . lint . test . build"
