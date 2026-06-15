#!/usr/bin/env bash
set -Eeuo pipefail

APP_ROOT="${APP_ROOT:-/var/www/milosevac}"
REPO_URL="${REPO_URL:-git@github.com:aaleksandraa/milosevac.git}"
REF="${1:-main}"
PHP_BIN="${PHP_BIN:-php}"
COMPOSER_BIN="${COMPOSER_BIN:-composer}"
NPM_BIN="${NPM_BIN:-npm}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
CURRENT_LINK="$APP_ROOT/current"
RELEASE_ID="$(date -u +%Y%m%d%H%M%S)-${REF:0:8}"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
LOCK_FILE="$APP_ROOT/deploy.lock"

mkdir -p "$RELEASES_DIR"
exec 9>"$LOCK_FILE"
flock -n 9 || { echo "Another deployment is running."; exit 1; }

for command in git "$PHP_BIN" "$COMPOSER_BIN" "$NPM_BIN"; do
  command -v "$command" >/dev/null 2>&1 || { echo "Missing command: $command"; exit 1; }
done

test -f "$SHARED_DIR/backend/.env" || { echo "Missing $SHARED_DIR/backend/.env"; exit 1; }
mkdir -p \
  "$SHARED_DIR/backend/storage/app/public" \
  "$SHARED_DIR/backend/storage/app/private" \
  "$SHARED_DIR/backend/storage/framework/cache/data" \
  "$SHARED_DIR/backend/storage/framework/sessions" \
  "$SHARED_DIR/backend/storage/framework/views" \
  "$SHARED_DIR/backend/storage/logs"

cleanup_failed_release() {
  if [[ ! -L "$CURRENT_LINK" || "$(readlink -f "$CURRENT_LINK")" != "$RELEASE_DIR" ]]; then
    rm -rf "$RELEASE_DIR"
  fi
}
trap cleanup_failed_release ERR

echo "Creating release $RELEASE_ID"
git init -q "$RELEASE_DIR"
git -C "$RELEASE_DIR" remote add origin "$REPO_URL"
git -C "$RELEASE_DIR" fetch --depth 1 origin "$REF"
git -C "$RELEASE_DIR" checkout -q --detach FETCH_HEAD

rm -rf "$RELEASE_DIR/backend/storage"
ln -s "$SHARED_DIR/backend/storage" "$RELEASE_DIR/backend/storage"
ln -s "$SHARED_DIR/backend/.env" "$RELEASE_DIR/backend/.env"

if [[ -x "$APP_ROOT/backup.sh" && -L "$CURRENT_LINK" ]]; then
  "$APP_ROOT/backup.sh" predeploy
fi

(
  cd "$RELEASE_DIR/backend"
  "$COMPOSER_BIN" install --no-dev --prefer-dist --no-interaction --optimize-autoloader
  "$NPM_BIN" ci
  "$NPM_BIN" run build
)

(
  cd "$RELEASE_DIR"
  export VITE_BACKEND_PUBLIC_URL="${VITE_BACKEND_PUBLIC_URL:-https://milosevac.com}"
  "$NPM_BIN" ci
  "$NPM_BIN" run build
)

(
  cd "$RELEASE_DIR/backend"
  "$PHP_BIN" artisan migrate --force
  "$PHP_BIN" artisan storage:link
  "$PHP_BIN" artisan posts:generate-social-images
  "$PHP_BIN" artisan optimize
)

chmod -R ug+rwX "$SHARED_DIR/backend/storage"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK.tmp"
mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"

if command -v supervisorctl >/dev/null 2>&1; then
  sudo -n supervisorctl restart milosevac-worker:* || supervisorctl restart milosevac-worker:* || true
fi

mapfile -t old_releases < <(find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | tail -n "+$((KEEP_RELEASES + 1))" | cut -d' ' -f2-)
for old_release in "${old_releases[@]}"; do
  [[ "$(readlink -f "$CURRENT_LINK")" == "$old_release" ]] || rm -rf "$old_release"
done

trap - ERR
echo "Deployment completed: $RELEASE_ID"
