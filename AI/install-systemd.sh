#!/bin/bash

# Asper AI Banking - Linux Systemd Setup Script
# Run as root: sudo ./install-systemd.sh

set -e

APP_DIR="/home/user/AI"
APP_USER="www-data"
VENV_DIR="$APP_DIR/venv"

echo "Installing Asper AI as systemd service..."

# Create log directory
mkdir -p /var/log/asper-ai
chown $APP_USER:$APP_USER /var/log/asper-ai

# Install systemd service
cp asper-ai.service /etc/systemd/system/
chmod 644 /etc/systemd/system/asper-ai.service

# Update service file with correct paths
sed -i "s|/home/user/AI|$APP_DIR|g" /etc/systemd/system/asper-ai.service

# Reload systemd daemon
systemctl daemon-reload

# Enable and start service
systemctl enable asper-ai
systemctl start asper-ai

echo "✓ Service installed and started"
echo ""
echo "Service commands:"
echo "  Start:    sudo systemctl start asper-ai"
echo "  Stop:     sudo systemctl stop asper-ai"
echo "  Status:   sudo systemctl status asper-ai"
echo "  Logs:     sudo journalctl -u asper-ai -f"
