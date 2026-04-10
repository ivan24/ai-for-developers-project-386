FROM php:8.5-fpm-bookworm

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
COPY docker/backend/start.sh /usr/local/bin/start-backend

RUN sed -i 's|;clear_env = no|clear_env = no|' /usr/local/etc/php-fpm.d/www.conf \
    && chmod +x /usr/local/bin/start-backend

WORKDIR /var/www/html

EXPOSE 9000
