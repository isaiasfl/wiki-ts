#!/usr/bin/env bash
# Sube los cambios a GitHub y actualiza la wiki en los servidores.
#   ./scripts/desplegar.sh            -> casa y centro
#   ./scripts/desplegar.sh casa       -> solo docker-web-isaias
#   ./scripts/desplegar.sh centro     -> solo docker-web
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Hay cambios sin commit. Haz antes: git add -A && git commit -m \"...\"" >&2
  exit 1
fi

npm run build >/dev/null && echo "Build local correcto"
git push

actualizar() { # $1 = alias ssh, $2 = carpeta
  echo "== $1"
  ssh "$1" "cd $2 && git pull --ff-only && docker compose -p wiki-ts up -d --build 2>&1 | tail -1"
}

case "${1:-todo}" in
  casa) actualizar docker-web-isaias /opt/wiki-ts ;;
  centro) actualizar docker-web '~/wiki-ts' ;;
  todo) actualizar docker-web-isaias /opt/wiki-ts; actualizar docker-web '~/wiki-ts' ;;
  *) echo "Uso: $0 [casa|centro]" >&2; exit 1 ;;
esac
echo "Listo. GitHub Pages se actualiza solo en un par de minutos."
