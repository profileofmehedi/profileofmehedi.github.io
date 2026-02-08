# Publishing Guide - Asper AI Banking

This guide explains how to publish the Asper AI Banking application for production deployment without Docker.

---

## 📦 Quick Publish (Recommended)

### **Windows**
```bash
publish.bat
```

### **Linux/macOS**
```bash
chmod +x publish.sh
./publish.sh
```

Both will create a `publish/` folder with your production-ready application.

---

## 📋 What Gets Published

The publish process creates a `publish/` directory containing:

```
publish/
├── api_banking.py          # Banking fraud analysis
├── api_categorize.py       # Expense categorization
├── api_churn.py           # Customer churn prediction
├── api_credit.py          # Credit scoring
├── api_forecast.py        # Cash flow forecast
├── api_kyc.py             # Document verification
├── app.py                 # Main Flask application
├── dashboard.html         # Web dashboard
├── requirements.txt       # Python dependencies
├── PUBLISH_INFO.txt       # Installation guide
├── config/
│   ├── .env.default       # Environment template
│   ├── asper-ai.service   # Systemd service file
│   └── nginx.conf         # Nginx configuration
└── bin/
    ├── start.sh           # Linux startup script
    └── start.bat          # Windows startup script
```

---

## 🚀 Deployment Options

### **Option 1: Quick Start (Any OS)**

After running publish script:

**Windows:**
```bash
cd publish
bin\start.bat
```

**Linux/macOS:**
```bash
cd publish
chmod +x bin/start.sh
./bin/start.sh
```

Access: `http://localhost:5001/dashboard.html`

---

### **Option 2: Manual Server Deployment (Linux)**

1. **Create deployment directory:**
   ```bash
   sudo mkdir -p /opt/asper-ai-banking
   sudo chown $USER:$USER /opt/asper-ai-banking
   ```

2. **Copy published files:**
   ```bash
   cp -r publish/* /opt/asper-ai-banking/
   cd /opt/asper-ai-banking
   ```

3. **Setup virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp config/.env.default .env
   nano .env  # Edit as needed
   ```

5. **Test locally:**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   ```

6. **Setup systemd service:**
   ```bash
   sudo cp config/asper-ai.service /etc/systemd/system/
   # Edit paths in service file to match your installation
   sudo systemctl daemon-reload
   sudo systemctl enable asper-ai
   sudo systemctl start asper-ai
   ```

7. **Configure Nginx reverse proxy:**
   ```bash
   sudo cp config/nginx.conf /etc/nginx/sites-available/asper-ai
   sudo ln -s /etc/nginx/sites-available/asper-ai /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

### **Option 3: Archive & Transfer**

**Create archive:**

Windows:
```powershell
Compress-Archive -Path publish -DestinationPath asper-ai-banking-1.0.0.zip
```

Linux:
```bash
tar -czf asper-ai-banking-1.0.0.tar.gz publish/
```

**Transfer to server:**
```bash
scp asper-ai-banking-1.0.0.tar.gz user@server:/opt/
```

**On server, extract and run:**
```bash
cd /opt
tar -xzf asper-ai-banking-1.0.0.tar.gz
cd publish
./bin/start.sh
```

---

### **Option 4: Remote Server with SSH**

**Deploy to remote Linux server:**

```bash
# From your local machine
ssh user@your-server.com << 'EOF'
  cd /opt
  python3 -m venv asper-ai-banking
  source asper-ai-banking/bin/activate
  pip install gunicorn python-dotenv flask flask-cors
  cd asper-ai-banking
EOF

# Copy files
scp -r publish/* user@your-server.com:/opt/asper-ai-banking/

# Start application
ssh user@your-server.com "cd /opt/asper-ai-banking && gunicorn -w 4 -b 0.0.0.0:5001 app:app"
```

---

## 🔌 Environment Configuration

Edit `.env` file in the publish directory:

```env
# Flask
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here

# Server
HOST=0.0.0.0
PORT=5001

# CORS - Allow your domain
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📊 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.8 | 3.9+ |
| RAM | 512MB | 1GB+ |
| Disk | 500MB | 1GB+ |
| CPU | 1 core | 2+ cores |
| OS | Linux/Windows | Ubuntu 20.04+ |

---

## 🧪 Testing After Deployment

### **1. Check server is running:**
```bash
curl http://localhost:5001/
```

Expected response:
```json
{
  "status": "online",
  "message": "Asper AI Banking System is running",
  "endpoints": [...]
}
```

### **2. Test Credit Scoring API:**
```bash
curl -X POST http://localhost:5001/api/v1/credit/predict \
  -H "Content-Type: application/json" \
  -d '{
    "monthly_income": 5000,
    "total_credit_limit": 10000,
    "current_credit_balance": 2500,
    "oldest_account_age_years": 4,
    "late_payments_last_6m": 0,
    "recent_inquiries_last_3m": 1
  }'
```

### **3. Access dashboard:**
Open in browser: `http://localhost:5001/dashboard.html`

---

## 📝 Log Files

**Development (console output):**
```bash
./bin/start.sh  # Output goes to console
```

**Production with logging:**
```bash
gunicorn -w 4 -b 0.0.0.0:5001 \
  --access-logfile logs/access.log \
  --error-logfile logs/error.log \
  app:app
```

**View logs:**
```bash
tail -f logs/error.log      # Application errors
tail -f logs/access.log     # HTTP requests
```

**Systemd service logs:**
```bash
sudo journalctl -u asper-ai -f
```

---

## 🚨 Troubleshooting

### **Port 5001 already in use**
```bash
# Find what's using it
lsof -i :5001

# Kill the process
kill -9 <PID>
```

### **Permission denied errors**
```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/asper-ai-banking
chmod +x bin/start.sh
```

### **Module not found errors**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### **CORS errors in dashboard**
1. Check `.env` file `CORS_ORIGINS`
2. Make sure your domain is listed
3. Restart application

### **Nginx 502 Bad Gateway**
1. Check if Flask is running: `curl http://localhost:5001/`
2. Check Nginx config: `sudo nginx -t`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## 🔄 Updates & Maintenance

### **Update the application:**

1. **Backup current version:**
   ```bash
   cp -r /opt/asper-ai-banking /opt/asper-ai-banking.backup
   ```

2. **Get latest code and republish:**
   ```bash
   ./publish.sh
   cp -r publish/* /opt/asper-ai-banking/
   ```

3. **Restart service:**
   ```bash
   sudo systemctl restart asper-ai
   ```

### **Update dependencies:**
```bash
pip install --upgrade -r requirements.txt
```

---

## 🔐 Security Checklist

- [ ] Set `FLASK_DEBUG=False` in `.env`
- [ ] Change `SECRET_KEY` in `.env`
- [ ] Configure `CORS_ORIGINS` for your domain only
- [ ] Use HTTPS (enable SSL in Nginx)
- [ ] Keep dependencies updated
- [ ] Regular backups
- [ ] Monitor error logs
- [ ] Use strong passwords/tokens
- [ ] Limit exposed ports
- [ ] Setup firewall rules

---

## 📈 Performance Optimization

### **Gunicorn workers:**
```bash
# Calculate: (2 × CPU cores) + 1
# Example for 4-core server: 9 workers
gunicorn -w 9 -b 0.0.0.0:5001 app:app
```

### **Nginx caching:**
Add to `nginx.conf`:
```nginx
location /dashboard.html {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

### **Database queries (future):**
Add connection pooling when database is implemented.

---

## 📞 Quick Command Reference

| Task | Command |
|------|---------|
| Start (Linux) | `./bin/start.sh` |
| Start (Windows) | `bin\start.bat` |
| Create publish | `./publish.sh` or `publish.bat` |
| Test API | `curl http://localhost:5001/` |
| Check logs | `tail -f logs/error.log` |
| Stop service | `sudo systemctl stop asper-ai` |
| Restart service | `sudo systemctl restart asper-ai` |
| View Nginx logs | `sudo tail -f /var/log/nginx/error.log` |

---

## 📞 Support Resources

- **API Documentation**: See `README.md`
- **Configuration**: See `.env.example`
- **Deployment Issues**: Check `logs/error.log`
- **API Testing**: Use dashboard at `http://your-server/dashboard.html`

---

**Version**: 1.0.0  
**Last Updated**: February 2026
