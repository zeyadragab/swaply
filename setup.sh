#!/bin/bash

echo "🚀 Starting Swaply Skill Exchange Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is installed${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found. You'll need to install it.${NC}"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check if .env files exist
if [ ! -f "apps/backend/.env" ]; then
    echo -e "${YELLOW}⚠ Backend .env not found, creating from example...${NC}"
    cp apps/backend/.env.example apps/backend/.env
    echo -e "${GREEN}✓ Created apps/backend/.env${NC}"
    echo -e "${YELLOW}⚠ Please edit apps/backend/.env with your database credentials${NC}"
fi

if [ ! -f "apps/web/.env" ]; then
    echo -e "${YELLOW}⚠ Web .env not found, creating...${NC}"
    echo "VITE_API_URL=http://localhost:5000/api/v1" > apps/web/.env
    echo -e "${GREEN}✓ Created apps/web/.env${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure PostgreSQL is running:"
echo "   sudo systemctl start postgresql  # Linux"
echo "   brew services start postgresql   # macOS"
echo ""
echo "2. Create database:"
echo "   createdb swaply"
echo ""
echo "3. Update database credentials in apps/backend/.env if needed"
echo ""
echo "4. Start the development servers:"
echo "   npm run dev"
echo ""
echo "The application will be available at:"
echo "  - Backend API: http://localhost:5000"
echo "  - Web App: http://localhost:3000"
echo ""
