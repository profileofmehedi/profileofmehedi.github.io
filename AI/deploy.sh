#!/bin/bash

# Asper AI Banking - Automated Server Deployment Script
# Usage: ./deploy.sh user@server.com /opt/asper-ai-banking
# Example: ./deploy.sh user@192.168.1.100 /opt/asper-ai-banking

set -e

# Configuration
REMOTE_USER_HOST=${1:-"user@localhost"}
REMOTE_PATH=${2:-"/opt/asper-ai-banking"}
LOCAL_PUBLISH_DIR="./publish"
APP_NAME="asper-ai-banking"
VERSION="1.0.0"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
print_header() {
    echo -e "${YELLOW}=================================="
    echo "$1"
    echo "==================================${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check prerequisites
print_header "Checking Prerequisites"

if [ ! -d "$LOCAL_PUBLISH_DIR" ]; then
    print_error "Publish directory not found. Run publish.sh first."
    exit 1
fi
print_success "Publish directory found"

if ! command -v scp &> /dev/null; then
    print_error "scp not found. Install openssh-client."
    exit 1
fi
print_success "SSH tools available"

# Test SSH connection
echo ""
print_header "Testing SSH Connection"
if ssh -o ConnectTimeout=5 "$REMOTE_USER_HOST" "echo 'Connection OK'" >/dev/null 2>&1; then
    print_success "Connected to $REMOTE_USER_HOST"
else
    print_error "Cannot connect to $REMOTE_USER_HOST"
    exit 1
fi

# Create remote directory
echo ""
print_header "Preparing Remote Server"
ssh "$REMOTE_USER_HOST" "mkdir -p $REMOTE_PATH" && print_success "Remote directory created"

# Build publish archive
echo ""
print_header "Creating Archive"
ARCHIVE_NAME="${APP_NAME}-${VERSION}.tar.gz"
tar -czf "$ARCHIVE_NAME" -C $(dirname "$LOCAL_PUBLISH_DIR") $(basename "$LOCAL_PUBLISH_DIR") && \
    print_success "Archive created: $ARCHIVE_NAME" || {
    print_error "Failed to create archive"
    exit 1
}

# Transfer archive
echo ""
print_header "Transferring Files"
echo "Uploading $ARCHIVE_NAME to $REMOTE_USER_HOST..."
scp "$ARCHIVE_NAME" "$REMOTE_USER_HOST:$REMOTE_PATH/" && \
    print_success "Files transferred" || {
    print_error "Transfer failed"
    rm -f "$ARCHIVE_NAME"
    exit 1
}

# Extract and setup on remote server
echo ""
print_header "Setting Up Remote Application"

ssh "$REMOTE_USER_HOST" bash << REMOTE_SCRIPT
    set -e
    cd $REMOTE_PATH
    
    echo "Extracting archive..."
    tar -xzf $ARCHIVE_NAME --strip-components=1
    rm -f $ARCHIVE_NAME
    
    echo "Creating virtual environment..."
    python3 -m venv venv || python -m venv venv
    
    echo "Activating virtual environment..."
    source venv/bin/activate || . venv/Scripts/activate
    
    echo "Installing dependencies..."
    pip install --quiet --upgrade pip setuptools wheel
    pip install --quiet -r requirements.txt
    
    echo "Setting up configuration..."
    if [ ! -f .env ]; then
        cp config/.env.default .env
        echo "Created .env from template"
    fi
    
    echo "Creating logs directory..."
    mkdir -p logs
    
    echo "Setting permissions..."
    chmod +x bin/start.sh || true
    
    echo "Verifying installation..."
    python -c "from app import app; print('Flask OK')" && echo "Application verified"
    
REMOTE_SCRIPT

print_success "Remote setup completed"

# Cleanup
echo ""
rm -f "$ARCHIVE_NAME"
print_success "Local archive cleaned up"

# Display next steps
echo ""
print_header "Deployment Complete!"
echo ""
echo "Next Steps:"
echo "1. Update configuration: ssh $REMOTE_USER_HOST \"nano $REMOTE_PATH/.env\""
echo "2. Start application:"
echo "   ssh $REMOTE_USER_HOST \"cd $REMOTE_PATH && ./bin/start.sh\""
echo ""
echo "Or setup as systemd service:"
echo "   ssh $REMOTE_USER_HOST \"sudo cp $REMOTE_PATH/config/asper-ai.service /etc/systemd/system/\""
echo "   ssh $REMOTE_USER_HOST \"sudo systemctl daemon-reload && sudo systemctl enable asper-ai && sudo systemctl start asper-ai\""
echo ""
echo "Access dashboard:"
echo "   http://$(echo $REMOTE_USER_HOST | cut -d@ -f2):5001/dashboard.html"
echo ""
