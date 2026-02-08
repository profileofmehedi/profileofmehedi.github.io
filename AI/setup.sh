#!/bin/bash

# Asper AI Banking - Setup & Deployment Script
# Tested on Ubuntu 20.04+

set -e

echo "=================================="
echo "Asper AI Banking - Setup Script"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8+${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found$(python3 --version)${NC}"

# Create virtual environment
echo -e "${YELLOW}Creating virtual environment...${NC}"
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}Upgrading pip...${NC}"
pip install --upgrade pip setuptools wheel

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Copy .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env with your configuration${NC}"
fi

# Make scripts executable
chmod +x run.sh || true

echo -e "${GREEN}=================================="
echo "Setup completed successfully!"
echo "==================================
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run: ./run.sh"
echo "3. Access dashboard at: http://localhost:5001/dashboard.html"
echo -e "${NC}"
