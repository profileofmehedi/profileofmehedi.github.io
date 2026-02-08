#!/bin/bash

# Asper AI Banking - Run Script

source venv/bin/activate

echo "Starting Asper AI Banking Service..."
echo "Access dashboard at: http://localhost:5001/dashboard.html"
echo ""

gunicorn -w 4 -b 0.0.0.0:5001 --access-logfile - --error-logfile - app:app
