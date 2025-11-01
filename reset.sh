#!/bin/bash

echo "🔄 Resetting Swaply project..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Confirm
read -p "This will delete all node_modules and reset the database. Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cancelled."
    exit 0
fi

echo -e "${YELLOW}Stopping any running servers...${NC}"
pkill -f "node.*backend" 2>/dev/null
pkill -f "node.*vite" 2>/dev/null

echo -e "${YELLOW}Cleaning node_modules...${NC}"
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
echo -e "${GREEN}✓ Cleaned${NC}"

echo -e "${YELLOW}Cleaning build artifacts...${NC}"
rm -rf apps/backend/dist
rm -rf apps/web/dist
rm -rf packages/shared/dist
echo -e "${GREEN}✓ Cleaned${NC}"

echo -e "${YELLOW}Resetting database...${NC}"
if command -v psql &> /dev/null; then
    psql -U postgres -c "DROP DATABASE IF EXISTS swaply;" 2>/dev/null
    psql -U postgres -c "CREATE DATABASE swaply;" 2>/dev/null
    echo -e "${GREEN}✓ Database reset${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found, skipping database reset${NC}"
fi

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Reset Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "You can now start the app with:"
echo "  npm run dev"
echo ""
