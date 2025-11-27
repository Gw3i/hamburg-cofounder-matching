# Hamburg Cofounder Platform - VPS Deployment Guide

## Overview

Deployment guide for Hamburg Cofounder Platform on VPS using AlmaLinux 9, Nginx, PM2, and Let's Encrypt.

## Prerequisites

- VPS (minimum 2GB RAM recommended, works with 1GB + swap)
- Domain name pointed to VPS IP
- Supabase project credentials

---

## Phase 1: Initial VPS Setup

### Access VPS

```bash
# From your local machine
ssh root@YOUR_VPS_IP
```

### Add SSH Key

```bash
# On VPS as root
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# From local machine
ssh-copy-id root@YOUR_VPS_IP
```

### Create Deploy User

```bash
# On VPS as root
useradd -m -s /bin/bash deploy
passwd deploy
usermod -aG wheel deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

---

## Phase 2: System Setup (AlmaLinux)

### Update System

```bash
yum update -y
```

### Create Swap (if less than 2GB RAM)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Install Dependencies

```bash
# Essential packages
dnf install -y epel-release
dnf install -y nano wget curl git gcc-c++ make firewalld policycoreutils-python-utils

# Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts

# Global packages
npm install -g pnpm pm2

# Nginx
dnf install -y nginx
systemctl start nginx
systemctl enable nginx
```

### Configure Firewall

```bash
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

---

## Phase 3: Application Deployment

### Clone and Setup

```bash
# As deploy user
su - deploy
git clone https://github.com/Gw3i/hamburg-cofounder-matching.git
cd hamburg-cofounder-matching
```

### Environment Variables

```bash
nano .env
```

Add:

```
NODE_ENV=production
PORT=3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=https://your-domain.com
LOG_LEVEL=info

# Resend Email Service (Optional but recommended)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@your-domain.com

# Required for Vite build
VITE_APP_TITLE=Hamburg Cofounder Platform
VITE_APP_LOGO=/favicon.ico
```

### Build Application

```bash
pnpm install
pnpm build
```

### PM2 Configuration

```bash
nano ecosystem.config.cjs
```

```javascript
module.exports = {
  apps: [
    {
      name: "hamburg-platform",
      script: "./dist/index.js",
      instances: 1, // Use 1 for low RAM
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
    },
  ],
};
```

### Start Application

```bash
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
# Run the command it outputs
```

---

## Phase 4: Nginx Configuration

### As root, configure Nginx

```bash
exit  # back to root
nano /etc/nginx/conf.d/hamburg-platform.conf
```

```nginx
upstream hamburg_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    root /home/deploy/hamburg-cofounder-matching/dist/public;

    location /api {
        proxy_pass http://hamburg_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    client_max_body_size 10M;
}
```

### Fix Permissions (SELinux)

```bash
# Allow Nginx to read home directories
setsebool -P httpd_enable_homedirs 1
setsebool -P httpd_can_network_connect 1

# Set context for web files
chcon -R -t httpd_sys_content_t /home/deploy/hamburg-cofounder-matching/dist/public/

# Fix directory permissions
chmod 755 /home/deploy
chmod -R 755 /home/deploy/hamburg-cofounder-matching/dist
```

### Test and Reload

```bash
nginx -t
systemctl reload nginx
```

---

## Phase 5: SSL Setup

### Install Certbot

```bash
dnf install -y certbot python3-certbot-nginx
```

### Get Certificate

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Auto-renewal

```bash
certbot renew --dry-run
```

---

## Verification

### Check Services

```bash
# PM2 status
su - deploy
pm2 status
pm2 logs hamburg-platform

# Test endpoints
curl http://localhost:3000
curl https://your-domain.com
```

### Fix Trust Proxy Warning (Optional)

Add to your Express app:

```javascript
app.set("trust proxy", 1);
```

---

## Maintenance Commands

```bash
# SSH access
ssh root@YOUR_VPS_IP

# Application logs
su - deploy
pm2 logs hamburg-platform

# Restart app
pm2 restart hamburg-platform

# Update deployment
git pull && pnpm install && pnpm build && pm2 restart hamburg-platform

# System monitoring
free -h  # Memory
df -h    # Disk
pm2 monit  # App monitoring
```

---

## Troubleshooting

### Low Memory Issues

- PM2 restarts frequently: Upgrade VPS or optimize app
- Build fails: Build locally and upload dist folder

### SSL Issues

```bash
# Reconfigure certificate
certbot --nginx --reinstall -d your-domain.com -d www.your-domain.com
```

### SELinux Permissions

```bash
# If Nginx can't access files
setenforce 0  # Temporary disable to test
chcon -R -t httpd_sys_content_t /path/to/files
setenforce 1  # Re-enable
```

### Environment Variables Not Replaced

- Ensure VITE\_ variables are in .env before building
- Rebuild: `pnpm build`

---

## Email Service Configuration (Resend)

### Overview

The platform uses **Resend** for sending professional branded emails (sign-up confirmations, welcome emails, etc.).

### Setup Steps

1. **Get Resend API Key**:
   - Sign up at [https://resend.com](https://resend.com)
   - Navigate to API Keys section
   - Create a production API key
   - Add to `.env` file

2. **Configure Domain** (for production):
   - In Resend dashboard, add your domain
   - Add DNS records as instructed:
     - SPF record
     - DKIM records
     - Optional: DMARC record
   - Verify domain in Resend dashboard

3. **Email Behavior**:
   - **Development**: Without API key, emails are logged to console
   - **Production**: Emails are sent via Resend with retry logic (3 attempts)
   - **Non-blocking**: Signup succeeds even if email fails

### Testing Email Integration

```bash
# As deploy user
su - deploy
cd hamburg-cofounder-matching

# Check if email service is working
pm2 logs hamburg-platform | grep "[Email]"

# Test signup flow
# 1. Visit https://your-domain.com
# 2. Create a new account
# 3. Check email for confirmation
# 4. Check PM2 logs for email status
```

### Email Templates

The platform sends:

- **Sign-up confirmation**: Branded email with confirmation link
- **Welcome email**: After email verification (optional)

Templates are located in `server/services/emailTemplates.ts`

### Monitoring

Check email delivery:

```bash
# View email logs
pm2 logs hamburg-platform | grep "[Email]"

# Common log messages:
# [Email] Sending email (attempt 1/3)
# [Email] Email sent successfully
# [Email] Development mode - logging email instead of sending
```

### Troubleshooting Email Issues

1. **Emails not sending**:
   - Verify `RESEND_API_KEY` in `.env`
   - Check Resend dashboard for API usage/errors
   - Review PM2 logs: `pm2 logs hamburg-platform`

2. **Emails going to spam**:
   - Verify domain in Resend
   - Add proper DNS records (SPF, DKIM)
   - Use professional from address

3. **Rate limiting**:
   - Free tier: 100 emails/day, 10 emails/second
   - Monitor usage in Resend dashboard
   - Upgrade plan if needed

---

## Important Notes

1. **VPS Requirements**: Minimum 1GB RAM + 2GB swap, recommended 2-4GB RAM
2. **AlmaLinux Specific**: Uses dnf/yum, firewalld, SELinux
3. **Domain Setup**: Point A records to VPS IP in DNS settings
4. **Security**: Always keep firewalld enabled, use SSH keys only

---

**Document Version**: 2.0
**Last Updated**: November 2025
**Tested On**: AlmaLinux 9.7, Node.js 24, Nginx 1.20
