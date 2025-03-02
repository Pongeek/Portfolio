# Deployment Guide for Portfolio Website

This guide will walk you through deploying your full-stack portfolio website on a VPS server with your own domain.

## Prerequisites

- A VPS server (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name registered and managed in Cloudflare
- SSH access to your server
- Node.js v16+ and npm installed on your server

## 1. Server Setup

### 1.1 Initial Server Configuration

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install build tools
sudo apt install -y build-essential

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2
```

### 1.2 Configure PostgreSQL

```bash
# Log in as postgres user
sudo -i -u postgres

# Create a new database user
createuser -P yourdbuser
# Enter a password when prompted

# Create a new database
createdb -O yourdbuser yourdbname

# Exit postgres user
exit
```

## 2. Application Deployment

### 2.1 Clone your Repository

```bash
# Create directory for application
sudo mkdir -p /var/www/portfolio
sudo chown -R $USER:$USER /var/www/portfolio

# Clone your repository
cd /var/www/portfolio
git clone https://github.com/yourusername/your-repo-name.git .
```

### 2.2 Configure Environment Variables

Create a `.env` file in your project root:

```bash
nano .env
```

Add the following content (update with your actual values):

```
# Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=yourdbname
PGUSER=yourdbuser
PGPASSWORD=yourdbpassword
DATABASE_URL=postgres://yourdbuser:yourdbpassword@localhost:5432/yourdbname

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
```

### 2.3 Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Run database migrations
npm run db:push
```

### 2.4 Configure PM2

```bash
# Start your application with PM2
pm2 start ecosystem.config.js

# Set PM2 to start on boot
pm2 startup
# Follow the instructions given by the above command
pm2 save
```

## 3. Nginx Configuration

### 3.1 Create Nginx Configuration

```bash
# Create a new Nginx configuration file
sudo nano /etc/nginx/sites-available/portfolio
```

Copy the content from `nginx.conf` in your project root and update the domain names.

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.2 Set up SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to set up SSL.

## 4. DNS Configuration in Cloudflare

1. Log in to your Cloudflare account.
2. Select your domain.
3. Go to the DNS tab.
4. Add an A record pointing to your server's IP address:
   - Type: A
   - Name: @ (for root domain)
   - Content: Your server IP address
   - Proxy status: Proxied
5. Add another A record for www subdomain:
   - Type: A
   - Name: www
   - Content: Your server IP address
   - Proxy status: Proxied

### 4.1 Cloudflare SSL Settings

1. Go to the SSL/TLS tab in Cloudflare.
2. Set the encryption mode to "Full (strict)" if you're using Let's Encrypt.
3. Enable HTTPS rewrites to ensure all traffic uses HTTPS.

## 5. Testing Your Deployment

1. Visit your domain in a web browser.
2. Test all features of your portfolio site.
3. Make sure the contact form is sending emails properly.
4. Verify that API endpoints are working correctly.

## 6. Maintenance and Updates

### 6.1 Updating Your Application

```bash
# Pull the latest changes
cd /var/www/portfolio
git pull

# Install dependencies if needed
npm install

# Rebuild the application
npm run build

# Restart the PM2 process
pm2 restart portfolio-app
```

### 6.2 Database Backups

```bash
# Create a database backup
sudo -u postgres pg_dump yourdbname > backup_$(date +%Y%m%d).sql

# To restore from backup
sudo -u postgres psql yourdbname < backup_filename.sql
```

## 7. Troubleshooting

### 7.1 Check Application Logs

```bash
pm2 logs portfolio-app
```

### 7.2 Check Nginx Logs

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 7.3 Check Database Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### 7.4 Common Issues

- **App not starting**: Check PM2 logs and make sure all environment variables are set correctly.
- **Database connection issues**: Verify that PostgreSQL is running and the credentials are correct.
- **SSL errors**: Ensure your certificates are valid and properly configured in Nginx.
- **Email not sending**: Check your SendGrid API key and configuration.

## 8. Security Considerations

- Keep your server updated with `sudo apt update && sudo apt upgrade`
- Set up a firewall with `ufw` to restrict access
- Use strong passwords for your database
- Regularly review logs for suspicious activity
- Consider setting up fail2ban to protect against brute force attacks 