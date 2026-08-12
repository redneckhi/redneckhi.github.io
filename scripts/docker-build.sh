#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NODE_IMAGE="${NODE_IMAGE:-node:22-bookworm-slim}"
BASE_PATH="${BASE_PATH:-}"
# Static export lands in docs/ (next.config distDir). Optional override copies after build.
DOCS_DIR="$ROOT/docs"
OUT_DIR="${OUT_DIR:-$DOCS_DIR}"

echo "==> Building with ${NODE_IMAGE}"
echo "    source: ${ROOT} -> /app"
echo "    export: docs/ (in project)"
echo "    publish: ${OUT_DIR}"
echo "    BASE_PATH='${BASE_PATH}'"

docker run --rm \
  -e "BASE_PATH=${BASE_PATH}" \
  -v "${ROOT}:/app" \
  -v /app/node_modules \
  -w /app \
  "${NODE_IMAGE}" \
  sh -c 'set -eu
    npm ci
    npm run build
    test -f /app/docs/index.html
    echo "==> Export ready in /app/docs"
    ls -la /app/docs | head -20
  '

if [[ ! -f "${DOCS_DIR}/index.html" ]]; then
  echo "error: build did not produce ${DOCS_DIR}/index.html" >&2
  exit 1
fi

# Only copy when the caller asked for a different publish path.
if [[ "$(cd "${OUT_DIR}" 2>/dev/null && pwd -P || true)" != "$(cd "${DOCS_DIR}" && pwd -P)" ]]; then
  mkdir -p "${OUT_DIR}"
  # Prefer rsync when available; fall back to rm + cp.
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "${DOCS_DIR}/" "${OUT_DIR}/"
  else
    find "${OUT_DIR}" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
    cp -a "${DOCS_DIR}/." "${OUT_DIR}/"
  fi
fi

if [[ ! -f "${OUT_DIR}/index.html" ]]; then
  echo "error: publish dir missing ${OUT_DIR}/index.html" >&2
  exit 1
fi

echo "==> Static site is in ${OUT_DIR}"
