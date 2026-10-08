#!/usr/bin/env bash
# Sube los cambios a GitHub y actualiza la wiki en los servidores propios.
# Los servidores se leen de scripts/destinos.local (no se sube), con líneas:
#   nombre  alias-ssh  carpeta
#   ./scripts/desplegar.sh          -> todos los destinos
#   ./scripts/desplegar.sh NOMBRE   -> solo ese destino
set -euo pipefail
cd "$(dirname "$0")/.."
destinos=scripts/destinos.local
[ -f "$destinos" ] || { echo "Falta $destinos" >&2; exit 1; }

if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios sin commit. Haz antes: git add -A && git commit -m \"...\"" >&2
  exit 1
fi

npm run build >/dev/null && echo "Build local correcto"
git push

grep -vE '^\s*(#|$)' "$destinos" | while read -r nombre host carpeta; do
  [ -z "${1:-}" ] || [ "$1" = "$nombre" ] || continue
  echo "== $nombre ($host)"
  ssh -n "$host" "cd $carpeta && git pull --ff-only && docker compose -p wiki-ts up -d --build 2>&1 | tail -1"
done
echo "Listo. GitHub Pages se actualiza solo en un par de minutos."
