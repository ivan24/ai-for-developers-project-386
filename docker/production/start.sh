#!/bin/sh
set -eu

APP_ROOT=/var/www/html

: "${PORT:=8080}"

if [ -n "${RENDER_EXTERNAL_URL:-}" ]; then
  : "${APP_URL:=$RENDER_EXTERNAL_URL}"
  : "${FRONTEND_URL:=$RENDER_EXTERNAL_URL}"
  : "${CORS_ALLOWED_ORIGINS:=$RENDER_EXTERNAL_URL}"

  export APP_URL FRONTEND_URL CORS_ALLOWED_ORIGINS
fi

if [ -z "${APP_KEY:-}" ]; then
  echo "APP_KEY is required." >&2
  exit 1
fi

mkdir -p \
  "$APP_ROOT/bootstrap/cache" \
  "$APP_ROOT/storage/framework/cache/data" \
  "$APP_ROOT/storage/framework/sessions" \
  "$APP_ROOT/storage/framework/views" \
  "$APP_ROOT/storage/logs"

chown -R www-data:www-data "$APP_ROOT/bootstrap/cache" "$APP_ROOT/storage"

envsubst '${PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

cd "$APP_ROOT"

attempt=1
max_attempts=10

while ! php artisan migrate --force --no-interaction; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Database migrations failed after ${max_attempts} attempts." >&2
    exit 1
  fi

  echo "Database is not ready yet, retrying migrations (${attempt}/${max_attempts})..." >&2
  attempt=$((attempt + 1))
  sleep 3
done

php-fpm -D
exec nginx -g 'daemon off;'
