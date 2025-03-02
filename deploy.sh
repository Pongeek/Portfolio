#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment script for portfolio website...${NC}"

# Build the frontend
echo -e "${YELLOW}Building frontend application...${NC}"
npm run build

# Create .env file if not exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file...${NC}"
  cat > .env << EOF
# Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
PGHOST=your-db-host
PGPORT=5432
PGDATABASE=your-db-name
PGUSER=your-db-user
PGPASSWORD=your-db-password
DATABASE_URL=postgres://your-db-user:your-db-password@your-db-host:5432/your-db-name

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EOF
  echo -e "${RED}Please update the .env file with your actual configuration values!${NC}"
fi

# Create .env.production file
echo -e "${YELLOW}Creating .env.production file...${NC}"
cp .env .env.production

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run db:push

echo -e "${GREEN}Deployment preparation complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Configure your web server (Nginx/Apache)"
echo -e "2. Set up SSL certificate with Certbot (Let's Encrypt)"
echo -e "3. Start the application with PM2"
echo -e "4. Point your domain to your server IP" 