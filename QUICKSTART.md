# Quick Start Guide

Get Swaply up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check npm (need 9+)
npm --version

# Check PostgreSQL (need 14+)
psql --version
```

If any are missing, install them first:
- **Node.js**: https://nodejs.org/ (download LTS version)
- **PostgreSQL**: https://www.postgresql.org/download/

## 3-Step Setup

### Step 1: Install & Configure

```bash
# Install dependencies
npm install

# Configuration files are already created in .env files
# Default settings work for most setups
```

### Step 2: Setup Database

```bash
# Create database
createdb swaply

# If that doesn't work, try:
psql -U postgres -c "CREATE DATABASE swaply;"
```

**Note:** If you get a password error, update `apps/backend/.env`:
```env
DB_PASSWORD=your_postgres_password
```

### Step 3: Start the App

```bash
# Start everything
npm run dev
```

That's it! 🎉

- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000

## First Time Usage

### 1. Create an Account

1. Go to http://localhost:3000
2. Click "Create a new account"
3. Fill in your details
4. You start with 100 tokens!

### 2. Add Your Skills

1. Go to "Skills" page
2. Click "Add Skill" under "Skills I Can Teach"
3. Add skills you want to learn too

### 3. Find Matches

1. Go to "Matches" page
2. See users who want to learn what you teach!
3. Connect and schedule sessions

## Common Commands

```bash
# Start everything
npm run dev

# Start only backend
npm run backend:dev

# Start only web
npm run web:dev

# View running processes
# Backend: http://localhost:5000/health
# Web: http://localhost:3000
```

## Default Credentials

The app uses JWT authentication. No default users - create your own!

## Token System

- **Start with**: 100 tokens
- **Earn tokens by**:
  - Teaching lessons (+20)
  - Daily challenges (+10)
  - Referrals (+50)
- **Spend tokens on**:
  - Learning lessons (varies)
  - Premium features

## Troubleshooting

### "Cannot connect to database"

```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql    # Linux
```

### "Port already in use"

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in apps/backend/.env
PORT=5001
```

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

For more issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## What's Next?

- ✅ **Add skills** you can teach and want to learn
- ✅ **Find matches** with complementary skills
- ✅ **Schedule sessions** to exchange knowledge
- ✅ **Earn tokens** by teaching others
- ✅ **Rate users** after sessions

## Features to Explore

1. **Dashboard**: View your stats and upcoming sessions
2. **Profile**: Manage your personal information
3. **Skills**: Add/remove teaching and learning skills
4. **Matches**: Find users with complementary skills
5. **Sessions**: Schedule and manage learning sessions
6. **Tokens**: View balance, transactions, and earn more

## API Testing

Want to test the API directly?

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Environment Variables

All set with defaults! But you can customize:

**Backend** (`apps/backend/.env`):
- Database connection
- JWT secrets
- API keys (Stripe, Agora, etc.)

**Web** (`apps/web/.env`):
- API URL (default: http://localhost:5000/api/v1)

## Production Deployment

For production setup, see:
- Update JWT secrets in `.env`
- Use production database
- Enable HTTPS
- Configure Stripe for payments
- Setup Agora for video calls

## Need Help?

1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
3. [README.md](./README.md) - Full documentation

---

**Happy Skill Swapping! 🎓**
