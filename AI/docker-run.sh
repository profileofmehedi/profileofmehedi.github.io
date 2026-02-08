#!/bin/bash

# Asper AI Banking - Docker Setup Script

set -e

echo "Building Docker image..."
docker build -t asper-ai-banking:latest .

echo "Starting Docker container..."
docker run -d \
  --name asper-ai-banking \
  -p 5001:5001 \
  -e FLASK_ENV=production \
  -e FLASK_DEBUG=False \
  --restart unless-stopped \
  asper-ai-banking:latest

echo ""
echo "✓ Docker container started successfully!"
echo "Access dashboard at: http://localhost:5001/dashboard.html"
echo ""
echo "View logs: docker logs -f asper-ai-banking"
echo "Stop container: docker stop asper-ai-banking"
echo "Remove container: docker rm asper-ai-banking"
