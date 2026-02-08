#!/bin/bash

# Asper AI Banking - Nginx Setup Script
# Run as root: sudo ./install-nginx.sh

set -e

echo "Installing Nginx configuration..."

# Copy Nginx config
cp nginx.conf /etc/nginx/sites-available/asper-ai

# Enable site
ln -sf /etc/nginx/sites-available/asper-ai /etc/nginx/sites-enabled/asper-ai

# Remove default config if it exists
rm -f /etc/nginx/sites-enabled/default || true

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo "✓ Nginx configured successfully"
echo ""
echo "Access your application at: http://localhost"
echo ""
echo "For HTTPS (Let's Encrypt):"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d your-domain.com"
