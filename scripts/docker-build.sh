#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NODE_IMAGE="${NODE_IMAGE:-node:22-bookworm-slim}"
BASE_PATH="${BASE_PATH:-}"
OUT_DIR="${OUT_DIR:-$ROOT/out}"

mkdir -p "${OUT_DIR}"

echo "==> Building with ${NODE_IMAGE}"
echo "    source: ${ROOT} -> /app"
echo "    out:    ${OUT_DIR} -> /out"
echo "    BASE_PATH='${BASE_PATH}'"

docker run --rm \
  -e "BASE_PATH=${BASE_PATH}" \
  -v "${ROOT}:/app" \
  -v "${OUT_DIR}:/out" \
  -v /app/node_modules \
  -w /app \
  "${NODE_IMAGE}" \
  sh -c 'set -eu
    npm ci
    npm run build
    touch /app/out/.nojekyll
    # When /out is a separate mount (not the same as /app/out), publish there.
    if [ "$(cd /app/out && pwd -P)" != "$(cd /out && pwd -P)" ]; then
      find /out -mindepth 1 -maxdepth 1 -exec rm -rf {} +
      cp -a /app/out/. /out/
    fi
    echo "==> Done"
    ls -la /out | head -20
  '

if [[ ! -f "${OUT_DIR}/index.html" ]]; then
  echo "error: build did not produce ${OUT_DIR}/index.html" >&2
  exit 1
fi

echo "==> Static site is in ${OUT_DIR}"
