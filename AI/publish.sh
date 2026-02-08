#!/bin/bash

# Asper AI Banking - Production Publish Script
# This script prepares and publishes the application to production

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=================================="
echo "Asper AI Banking - Publish Script"
echo "==================================${NC}"

# Configuration
APP_NAME="asper-ai-banking"
APP_VERSION="1.0.0"
DEPLOY_DIR="/opt/asper-ai-banking"
SERVICE_NAME="asper-ai"

# Step 1: Validate environment
echo -e "${YELLOW}[1/7] Validating environment...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found: $(python3 --version)${NC}"

# Step 2: Create virtual environment
echo -e "${YELLOW}[2/7] Creating virtual environment...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Step 3: Activate and upgrade pip
echo -e "${YELLOW}[3/7] Installing dependencies...${NC}"
source venv/bin/activate
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Test Flask application
echo -e "${YELLOW}[4/7] Testing Flask application...${NC}"
python -c "from app import app; print('✓ Flask imports successfully')" || {
    echo -e "${RED}✗ Flask application has errors${NC}"
    exit 1
}
echo -e "${GREEN}✓ Flask application is valid${NC}"

# Step 5: Create production directory structure
echo -e "${YELLOW}[5/7] Preparing publish directory...${NC}"
mkdir -p publish/{bin,config,logs}

# Copy application files
cp -r api_*.py app.py dashboard.html requirements.txt publish/
cp .env.example publish/config/.env.default
cp asper-ai.service publish/config/
cp nginx.conf publish/config/

echo -e "${GREEN}✓ Application files prepared${NC}"

# Step 6: Create publish information file
echo -e "${YELLOW}[6/7] Creating publish manifest...${NC}"
cat > publish/PUBLISH_INFO.txt <<EOF
Asper AI Banking - Production Build
===================================

Version: ${APP_VERSION}
Build Date: $(date)
Application: ${APP_NAME}

Files Included:
- api_banking.py
- api_categorize.py
- api_churn.py
- api_credit.py
- api_forecast.py
- api_kyc.py
- app.py
- dashboard.html
- requirements.txt

Configuration Files:
- config/.env.default
- config/asper-ai.service
- config/nginx.conf

Installation Instructions:
1. Extract this directory to /opt/asper-ai-banking (or your chosen location)
2. Create virtual environment: python3 -m venv venv
3. Activate: source venv/bin/activate
4. Install dependencies: pip install -r requirements.txt
5. Copy config/.env.default to .env and update settings
6. Test: python app.py
7. For systemd: sudo cp config/asper-ai.service /etc/systemd/system/
8. For nginx: sudo cp config/nginx.conf /etc/nginx/sites-available/asper-ai

Deployment Options:
1. Development: python app.py
2. Production: gunicorn -w 4 -b 0.0.0.0:5001 app:app
3. Systemd Service: sudo systemctl start asper-ai
4. With Nginx: Reverse proxy on port 80/443

System Requirements:
- Python 3.8+
- pip
- 500MB+ disk space
- 512MB+ RAM

API Endpoints:
- POST /api/v1/credit/predict
- POST /api/v1/banking/analyze
- POST /api/v1/banking/forecast
- POST /api/v1/banking/categorize
- POST /api/v1/kyc/verify-document
- POST /api/v1/crm/churn-risk

Dashboard:
- http://localhost:5001/dashboard.html

Support:
- Check logs: tail -f asper-ai.log
- Check errors: python app.py
- Test endpoints: curl -X POST http://localhost:5001/...

EOF

echo -e "${GREEN}✓ Publish manifest created${NC}"

# Step 7: Create startup script
echo -e "${YELLOW}[7/7] Creating startup script...${NC}"
cat > publish/bin/start.sh <<'SCRIPT'
#!/bin/bash

# Startup script for Asper AI Banking

set -e

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f "config/.env.default" ]; then
        cp config/.env.default .env
        echo "Created .env from template. Edit it with your settings."
    fi
fi

# Run application
echo "Starting Asper AI Banking on http://0.0.0.0:5001"
echo "Dashboard: http://localhost:5001/dashboard.html"
echo "Press Ctrl+C to stop"
echo ""

gunicorn -w 4 -b 0.0.0.0:5001 --access-logfile logs/access.log --error-logfile logs/error.log app:app

SCRIPT

chmod +x publish/bin/start.sh
echo -e "${GREEN}✓ Startup script created${NC}"

# Summary
echo ""
echo -e "${GREEN}=================================="
echo "✓ Publish package ready!"
echo "==================================${NC}"
echo ""
echo "Location: ./publish/"
echo "Contents:"
echo "  - Application files (*.py, *.html)"
echo "  - requirements.txt"
echo "  - config/ (environment, service, nginx configs)"
echo "  - bin/start.sh (startup script)"
echo "  - PUBLISH_INFO.txt (installation guide)"
echo ""
echo "Next steps:"
echo "1. Archive: tar -czf asper-ai-banking-${APP_VERSION}.tar.gz publish/"
echo "2. Deploy: scp asper-ai-banking-${APP_VERSION}.tar.gz user@server:/opt/"
echo "3. On server: tar -xzf asper-ai-banking-${APP_VERSION}.tar.gz && cd publish"
echo "4. Run: ./bin/start.sh"
echo ""
echo "Or copy publish/ directory directly to your server"
echo ""
echo -e "${GREEN}Ready to deploy!${NC}"
