FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip curl git zip libzip-dev libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install pdo_mysql mbstring zip exif pcntl

COPY .env .env
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
