#!/bin/sh
set -eu

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction
fi

if ! grep -Eq '^APP_KEY=.+$' .env; then
  php artisan key:generate --force --no-interaction
fi

exec php-fpm
