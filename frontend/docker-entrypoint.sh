#!/bin/sh
set -e

echo "Starting frontend container..."
echo "BACKEND_HOST: $BACKEND_HOST"

# Replace BACKEND_HOST placeholder in nginx config
if [ -n "$BACKEND_HOST" ]; then
    echo "Configuring nginx with backend host: $BACKEND_HOST"
    sed -i "s/BACKEND_HOST_PLACEHOLDER/$BACKEND_HOST/g" /etc/nginx/conf.d/default.conf
    echo "Nginx configuration updated"
else
    echo "Warning: BACKEND_HOST not set, using placeholder"
fi

# Display final nginx config for debugging
echo "Final nginx configuration:"
cat /etc/nginx/conf.d/default.conf

# Start nginx
echo "Starting nginx..."
exec nginx -g 'daemon off;'