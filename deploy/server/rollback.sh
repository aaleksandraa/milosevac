#!/usr/bin/env bash
set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/var/www/milosevac}"
CURRENT_LINK="$APP_ROOT/current"
RELEASES_DIR="$APP_ROOT/releases"
TARGET="${1:-}"

if [[ -z "$TARGET" ]]; then
  CURRENT="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"
  TARGET="$(find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | cut -d' ' -f2- | grep -Fvx "$CURRENT" | head -n 1)"
elif [[ "$TARGET" != /* ]]; then
  TARGET="$RELEASES_DIR/$TARGET"
fi

test -d "$TARGET" || { echo "Release does not exist: $TARGET"; exit 1; }
test -f "$TARGET/backend/artisan" || { echo "Invalid release: $TARGET"; exit 1; }

ln -sfn "$TARGET" "$CURRENT_LINK.tmp"
mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"

if command -v supervisorctl >/dev/null 2>&1; then
  sudo -n supervisorctl restart milosevac-worker:* || supervisorctl restart milosevac-worker:* || true
fi

echo "Rolled back to $(basename "$TARGET")"
