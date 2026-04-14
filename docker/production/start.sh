#!/bin/sh
set -eu

APP_ROOT=/var/www/html

: "${PORT:=8080}"
: "${APP_ENV:=production}"
: "${APP_DEBUG:=false}"
: "${BOOTSTRAP_DEMO_DATA:=false}"

export APP_ENV APP_DEBUG BOOTSTRAP_DEMO_DATA

if [ -z "${APP_KEY:-}" ]; then
  APP_KEY="$(php -r 'echo "base64:".base64_encode(random_bytes(32));')"
  export APP_KEY
fi

if [ -z "${DB_CONNECTION:-}" ]; then
  DB_CONNECTION=sqlite
  export DB_CONNECTION
fi

if [ "${DB_CONNECTION}" = "sqlite" ]; then
  : "${DB_DATABASE:=$APP_ROOT/database/database.sqlite}"
  export DB_DATABASE
fi

if [ -n "${RENDER_EXTERNAL_URL:-}" ]; then
  : "${APP_URL:=$RENDER_EXTERNAL_URL}"
  : "${FRONTEND_URL:=$RENDER_EXTERNAL_URL}"
  : "${CORS_ALLOWED_ORIGINS:=$RENDER_EXTERNAL_URL}"

  export APP_URL FRONTEND_URL CORS_ALLOWED_ORIGINS
fi

mkdir -p \
  "$APP_ROOT/bootstrap/cache" \
  "$APP_ROOT/database" \
  "$APP_ROOT/storage/framework/cache/data" \
  "$APP_ROOT/storage/framework/sessions" \
  "$APP_ROOT/storage/framework/views" \
  "$APP_ROOT/storage/logs"

chown -R www-data:www-data "$APP_ROOT/bootstrap/cache" "$APP_ROOT/storage"

if [ "${DB_CONNECTION}" = "sqlite" ]; then
  touch "$DB_DATABASE"
  chown www-data:www-data "$DB_DATABASE"
fi

envsubst '${PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

cd "$APP_ROOT"

if [ "${DB_CONNECTION}" = "sqlite" ]; then
  php artisan migrate --force --no-interaction
else
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
fi

if [ "${BOOTSTRAP_DEMO_DATA}" = "true" ]; then
  php artisan app:seed-demo-if-empty --no-interaction
fi

php-fpm -D
exec nginx -g 'daemon off;'
