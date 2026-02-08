# Asper AI Banking - Deployment Guide

This guide covers multiple deployment options for the Asper AI Banking system.

---

## 📋 Prerequisites

- Python 3.8+
- pip package manager
- Git (for version control)
- Virtual environment support

---

## 🚀 Quick Start (Local Development)

### Option 1: Simple Python Server

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Access the dashboard:**
   - Open `dashboard.html` in your browser
   - Or navigate to `http://localhost:5001/dashboard.html`

---

## 🐳 Docker Deployment (Recommended)

### Quick Docker Setup

1. **Build the image:**
   ```bash
   docker build -t asper-ai-banking:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name asper-ai-banking \
     -p 5001:5001 \
     -e FLASK_ENV=production \
     asper-ai-banking:latest
   ```

3. **Access the application:**
   - Dashboard: `http://localhost:5001/dashboard.html`

4. **View logs:**
   ```bash
   docker logs -f asper-ai-banking
   ```

### Docker Compose (Easier)

```bash
docker-compose up -d
```

This automatically:
- Builds the image
- Runs the container
- Sets up environment variables
- Configures health checks
- Mounts volumes

**Access:** `http://localhost:5001/dashboard.html`

---

## 🖥️ Linux Server Deployment (Production)

### Prerequisites

- Ubuntu/Debian system
- Root or sudo access
- 1GB+ RAM, 1GB+ disk space

### Step 1: Initial Setup

```bash
# SSH into your server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3-pip python3-venv nginx git build-essential

# Clone the repository (or upload files)
git clone <your-repo-url> /home/user/AI
cd /home/user/AI

# Run setup script
chmod +x setup.sh
./setup.sh

# Edit configuration
nano .env
```

### Step 2: Run with Gunicorn

```bash
source venv/bin/activate
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

**Access:** `http://your-server-ip:5001/dashboard.html`

### Step 3: Install as Systemd Service (Auto-start)

```bash
sudo chmod +x install-systemd.sh
sudo ./install-systemd.sh
```

**Service commands:**
```bash
sudo systemctl status asper-ai
sudo systemctl start asper-ai
sudo systemctl stop asper-ai
```

### Step 4: Configure Nginx Reverse Proxy

```bash
sudo chmod +x install-nginx.sh
sudo ./install-nginx.sh
```

Edit `/etc/nginx/sites-available/asper-ai` if needed, then:
```bash
sudo systemctl reload nginx
```

**Access:** `http://your-server-ip/dashboard.html` (on port 80)

### Step 5: Enable HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Replace 'your-domain.com' with your actual domain
sudo certbot --nginx -d your-domain.com

# Auto-renew certificates
sudo systemctl enable certbot.timer
```

---

## ☁️ Cloud Deployment

### Heroku

1. **Install Heroku CLI:**
   ```bash
   curl https://cli.heroku.com/install.sh | sh
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create asper-ai-banking
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **View logs:**
   ```bash
   heroku logs --tail
   ```

**Access:** `https://asper-ai-banking.herokuapp.com/dashboard.html`

### AWS (EC2)

1. Launch EC2 instance (Ubuntu 20.04)
2. Follow **Linux Server Deployment** steps above
3. Configure security groups (allow ports 80, 443, 5001)
4. Attach Elastic IP or Route 53 domain

### DigitalOcean / Linode

1. Create Ubuntu 20.04 droplet
2. SSH and follow **Linux Server Deployment** steps
3. Configure firewall (ufw)
4. Set up domain pointing to droplet IP

---

## 📊 Environment Configuration

Edit `.env` file:

```env
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# Server
HOST=0.0.0.0
PORT=5001

# CORS (comma-separated domains)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 🔒 Security Checklist

- [ ] Set `FLASK_DEBUG=False` in production
- [ ] Change `SECRET_KEY` in `.env`
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure firewall rules
- [ ] Use strong CORS origins
- [ ] Regular backups
- [ ] Monitor error logs
- [ ] Keep dependencies updated

---

## 📈 Monitoring & Logs

### Systemd Service Logs
```bash
sudo journalctl -u asper-ai -f
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/asper_ai_access.log
sudo tail -f /var/log/nginx/asper_ai_error.log
```

### Docker Logs
```bash
docker logs -f asper-ai-banking
```

---

## 🔄 Updates & Maintenance

### Update code

```bash
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart asper-ai
```

### Update dependencies

```bash
pip install --upgrade -r requirements.txt
```

---

## 🆘 Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :5001
kill -9 <PID>
```

### Permission denied errors
```bash
# Ensure correct ownership
sudo chown -R www-data:www-data /home/user/AI
```

### Flask not connecting
- Check `.env` configuration
- Verify `CORS_ORIGINS`
- Check firewall/security groups

### Docker issues
```bash
docker ps -a  # List containers
docker logs asper-ai-banking  # View logs
docker rm asper-ai-banking  # Remove container
```

---

## 📞 Support

For issues:
1. Check error logs
2. Review configuration in `.env`
3. Ensure all dependencies installed
4. Test with curl:
   ```bash
   curl -X POST http://localhost:5001/api/v1/credit/predict \
     -H "Content-Type: application/json" \
     -d '{"monthly_income": 5000, "total_credit_limit": 10000, ...}'
   ```

---

## 📝 Version History

- v1.0 - Initial deployment configuration
- Built: February 2026

