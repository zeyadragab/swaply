# 🚀 START HERE - Swaply Setup

Welcome! Here's how to get Swaply running in just a few steps.

## ⚡ Quick Start (Recommended)

### Option 1: Automated Setup Script

```bash
# Run the setup script
./setup.sh

# Then start the app
npm run dev
```

### Option 2: Manual Setup (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Create database
createdb swaply

# 3. Start the app
npm run dev
```

That's it! 🎉

- **Web App**: http://localhost:3000
- **API**: http://localhost:5000

## 📋 Before You Start

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ PostgreSQL 14+ (`psql --version`)
- ✅ npm 9+ (`npm --version`)

**Don't have these?**
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/

## 🔍 Verify Your Setup

Run this to check if everything is configured correctly:

```bash
./check-setup.sh
```

## 🆘 Having Issues?

### Common Problems

**"Cannot find module" error:**
```bash
npm install
```

**"Database connection failed":**
```bash
# Make sure PostgreSQL is running
pg_isready

# Create the database
createdb swaply

# Update password in apps/backend/.env if needed
```

**"Port already in use":**
```bash
# Kill processes on ports
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Web
```

**Still stuck?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Fix common errors
- **[README.md](./README.md)** - Full project docs

## 🎯 What You Can Do

Once running, you can:

1. **Create an Account** - Start with 100 free tokens
2. **Add Skills** - What you teach & want to learn
3. **Find Matches** - Connect with complementary learners
4. **Schedule Sessions** - Book learning exchanges
5. **Earn Tokens** - Teach to earn, spend to learn

## 🛠️ Useful Commands

```bash
# Start everything
npm run dev

# Start only backend
npm run backend:dev

# Start only web
npm run web:dev

# Check if everything is set up
./check-setup.sh

# Reset everything (nuclear option)
./reset.sh
```

## 💡 Default Configuration

The project comes pre-configured with development defaults:

- **Database**: localhost:5432/swaply
- **Backend**: http://localhost:5000
- **Web**: http://localhost:3000
- **Starting Tokens**: 100 per user

All settings can be customized in:
- `apps/backend/.env` (backend config)
- `apps/web/.env` (web config)

## 🔄 Reset Everything

If things get messy:

```bash
./reset.sh
```

This will:
- Delete all node_modules
- Reset the database
- Reinstall dependencies
- Start fresh

## 🎓 First Steps After Setup

1. Go to http://localhost:3000
2. Click "Create a new account"
3. Add skills you can teach
4. Add skills you want to learn
5. Go to "Matches" to find skill exchange partners!

## 📊 Project Structure

```
swaply/
├── apps/
│   ├── backend/     # Express.js API
│   └── web/         # React app
├── packages/
│   └── shared/      # Shared types
└── scripts/         # Setup scripts
```

## 🚢 What's Included

✅ **Backend API**
- User authentication (JWT)
- Skill matching algorithm
- Session management
- Token economy system
- Rating & reviews

✅ **Web Application**
- User dashboard
- Profile management
- Skill management
- Session scheduling
- Token transactions

✅ **Database**
- PostgreSQL with Sequelize ORM
- Auto-created tables
- Sample data ready

## ⚙️ Environment Variables

Already configured with defaults! Files created:
- `apps/backend/.env` - Backend configuration
- `apps/web/.env` - Frontend API URL

**For production**, update:
- JWT secrets
- Database credentials
- API keys (Stripe, Agora, etc.)

## 🐛 Debugging

View logs:
```bash
# Backend logs
npm run backend:dev

# Check health
curl http://localhost:5000/health

# Check database
psql -U postgres -d swaply -c "\dt"
```

## 📞 Need Help?

1. Run `./check-setup.sh` to diagnose issues
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Search existing issues on GitHub
4. Create a new issue with error details

## ✨ Next Steps

Once you have it running:

1. Explore the web interface
2. Test the API endpoints
3. Review the code structure
4. Customize for your needs
5. Deploy to production

## 🎉 You're Ready!

Run `npm run dev` and start building your skill exchange community!

---

**Questions?** Check the docs above or open an issue on GitHub.

**Happy Coding! 💻**
