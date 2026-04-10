FROM nginx:1.29-bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY docker/backend-web/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

EXPOSE 80
