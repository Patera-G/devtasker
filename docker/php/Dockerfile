FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip git curl libicu-dev libzip-dev pkg-config libonig-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql intl zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Expose port 80
EXPOSE 8080