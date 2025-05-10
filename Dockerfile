# Use the official PHP 8.1 image with Apache
FROM php:8.4-apache

COPY . /var/www/html/

# Expose port 80
EXPOSE 80