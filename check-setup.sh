#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Swaply Setup Verification Check     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} $NODE_VERSION"
    else
        echo -e "${YELLOW}⚠${NC} $NODE_VERSION (v18+ recommended)"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${RED}✗ Not found${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo -e "${GREEN}✓${NC} v$PG_VERSION"

    # Check if PostgreSQL is running
    echo -n "  PostgreSQL running... "
    if pg_isready &> /dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Not running${NC}"
        echo "    Start with: brew services start postgresql@14 (macOS)"
        echo "    or: sudo systemctl start postgresql (Linux)"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${YELLOW}⚠ Not found${NC}"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "Checking project structure..."

# Check node_modules
echo -n "  Dependencies installed... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "    Run: npm install"
    ERRORS=$((ERRORS+1))
fi

# Check backend .env
echo -n "  Backend .env... "
if [ -f "apps/backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "    Run: cp apps/backend/.env.example apps/backend/.env"
    WARNINGS=$((WARNINGS+1))
fi

# Check web .env
echo -n "  Web .env... "
if [ -f "apps/web/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}"
    echo "    Run: echo 'VITE_API_URL=http://localhost:5000/api/v1' > apps/web/.env"
    WARNINGS=$((WARNINGS+1))
fi

# Check database exists
echo -n "  Database 'swaply'... "
if command -v psql &> /dev/null; then
    if psql -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw swaply; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${YELLOW}⚠ Not found${NC}"
        echo "    Run: createdb swaply"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${YELLOW}⚠ Cannot check (psql not found)${NC}"
fi

# Check workspaces
echo -n "  Workspace packages... "
WORKSPACE_COUNT=0
if [ -d "apps/backend" ] && [ -f "apps/backend/package.json" ]; then
    WORKSPACE_COUNT=$((WORKSPACE_COUNT+1))
fi
if [ -d "apps/web" ] && [ -f "apps/web/package.json" ]; then
    WORKSPACE_COUNT=$((WORKSPACE_COUNT+1))
fi
if [ -d "packages/shared" ] && [ -f "packages/shared/package.json" ]; then
    WORKSPACE_COUNT=$((WORKSPACE_COUNT+1))
fi

if [ $WORKSPACE_COUNT -eq 3 ]; then
    echo -e "${GREEN}✓${NC} ($WORKSPACE_COUNT/3)"
else
    echo -e "${RED}✗${NC} ($WORKSPACE_COUNT/3)"
    ERRORS=$((ERRORS+1))
fi

# Check ports
echo ""
echo "Checking ports..."
echo -n "  Port 5000 (backend)... "
if lsof -Pi :5000 -sTCP:LISTEN -t &> /dev/null; then
    echo -e "${YELLOW}⚠ In use${NC}"
    echo "    Kill with: lsof -ti:5000 | xargs kill -9"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✓ Available${NC}"
fi

echo -n "  Port 3000 (web)... "
if lsof -Pi :3000 -sTCP:LISTEN -t &> /dev/null; then
    echo -e "${YELLOW}⚠ In use${NC}"
    echo "    Kill with: lsof -ti:3000 | xargs kill -9"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✓ Available${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You're ready to start:"
    echo "  npm run dev"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can probably start, but check warnings above:"
    echo "  npm run dev"
else
    echo -e "${RED}✗ $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before starting."
    echo ""
    echo "Quick fixes:"
    echo "  npm install              # Install dependencies"
    echo "  createdb swaply          # Create database"
    echo "  ./setup.sh               # Run setup script"
fi
echo -e "${BLUE}═══════════════════════════════════════${NC}"
