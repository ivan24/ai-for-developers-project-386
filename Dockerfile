FROM node:24-bookworm-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


FROM php:8.5-fpm-bookworm AS backend-build

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        libicu-dev \
        libonig-dev \
        libpq-dev \
        libsqlite3-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install \
        bcmath \
        intl \
        mbstring \
        pdo_pgsql \
        pdo_sqlite \
        pgsql \
        zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.9.5 /usr/bin/composer /usr/local/bin/composer

WORKDIR /app/backend

COPY backend/composer.json backend/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist \
    --no-scripts

COPY backend/ ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist


FROM backend-build

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gettext-base \
        nginx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=backend-build /app/backend /var/www/html
COPY --from=frontend-build /app/frontend/dist /srv/frontend
COPY docker/production/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/production/start.sh /usr/local/bin/start-production

RUN sed -i 's|;clear_env = no|clear_env = no|' /usr/local/etc/php-fpm.d/www.conf \
    && rm -f /etc/nginx/conf.d/default.conf \
    && chmod +x /usr/local/bin/start-production

WORKDIR /var/www/html

EXPOSE 8080

CMD ["/usr/local/bin/start-production"]
