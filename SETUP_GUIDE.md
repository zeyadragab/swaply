# Swaply - Detailed Setup Guide

This guide will walk you through setting up the Swaply skill exchange platform from scratch.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Backend Setup](#backend-setup)
3. [Web Application Setup](#web-application-setup)
4. [Database Setup](#database-setup)
5. [Third-Party Services](#third-party-services)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Git**: Latest version

### Recommended Tools
- **VS Code** or your preferred IDE
- **Postman** or similar API testing tool
- **pgAdmin** or **TablePlus** for database management

## Backend Setup

### 1. Install Dependencies

```bash
# From the project root
npm install
```

This will install dependencies for all workspaces (backend, web, shared).

### 2. Database Setup

#### Create PostgreSQL Database

**Option 1: Using Command Line**
```bash
createdb swaply
```

**Option 2: Using psql**
```bash
psql -U postgres
CREATE DATABASE swaply;
\q
```

**Option 3: Using pgAdmin**
1. Open pgAdmin
2. Right-click on "Databases"
3. Create → Database
4. Name it "swaply"

#### Verify Database Connection

```bash
psql -U postgres -d swaply -c "SELECT version();"
```

### 3. Environment Configuration

Create `.env` file in `apps/backend/`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` with your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swaply
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
# Generate secure secrets using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_jwt_secret_min_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters_long
JWT_REFRESH_EXPIRES_IN=30d

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# File Upload
MAX_FILE_SIZE=5242880
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@swaply.com

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Agora Configuration (Optional)
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=

# Token System Defaults
INITIAL_USER_TOKENS=100
TOKENS_PER_REFERRAL=50
TOKENS_PER_LESSON=20
DAILY_CHALLENGE_TOKENS=10
```

### 4. Seed Initial Data (Optional)

Create a seed file to populate initial skills:

```bash
# This will be created automatically when you run the backend for the first time
npm run seed -w @swaply/backend
```

### 5. Start Backend Server

```bash
# Development mode with hot reload
npm run backend:dev

# Or from root
npm run dev
```

The backend should now be running on http://localhost:5000

#### Verify Backend is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## Web Application Setup

### 1. Environment Configuration

Create `.env` file in `apps/web/`:

```bash
# Create the file
touch apps/web/.env
```

Add the following:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 2. Start Web Application

```bash
# From root
npm run web:dev

# Or specific workspace
npm run dev -w @swaply/web
```

The web app should now be running on http://localhost:3000

### 3. Access the Application

Open your browser and navigate to:
- Web App: http://localhost:3000
- API: http://localhost:5000/api/v1

## Third-Party Services Configuration

### Stripe (Payment Processing)

1. Create account at https://stripe.com
2. Get your API keys from Dashboard → Developers → API keys
3. Add to backend `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### Setup Stripe Webhook (Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/v1/tokens/webhook
```

### Agora (Video Calling)

1. Create account at https://www.agora.io
2. Create a new project
3. Get App ID and Certificate
4. Add to backend `.env`:
   ```env
   AGORA_APP_ID=your_app_id
   AGORA_APP_CERTIFICATE=your_certificate
   ```

### Cloudinary (File Upload)

1. Create account at https://cloudinary.com
2. Get credentials from Dashboard
3. Add to backend `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Email (SMTP)

For Gmail:
1. Enable 2-factor authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to backend `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

## Testing the Setup

### 1. Create a Test User

Using cURL:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Or use the web interface at http://localhost:3000/register

### 2. Verify Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Routes

```bash
# Replace YOUR_TOKEN with the token from login response
curl http://localhost:5000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Common Issues

#### Database Connection Error

**Error**: `could not connect to server`

**Solution**:
1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services start postgresql@14

   # Linux
   sudo systemctl start postgresql
   ```

2. Verify credentials in `.env`
3. Check PostgreSQL is listening on port 5432

#### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
1. Find and kill the process:
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

2. Or change the port in `.env`:
   ```env
   PORT=5001
   ```

#### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
Add your frontend URL to backend `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

#### JWT Token Invalid

**Error**: `Invalid token`

**Solution**:
1. Clear browser localStorage
2. Generate new JWT secrets
3. Re-login to get new token

### Database Issues

#### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE swaply;"
psql -U postgres -c "CREATE DATABASE swaply;"

# Restart backend to re-sync models
npm run backend:dev
```

#### View Database Tables

```bash
psql -U postgres -d swaply

# List tables
\dt

# Describe table
\d users

# View data
SELECT * FROM users;
```

### Development Tools

#### Database GUI Tools

- **pgAdmin**: https://www.pgadmin.org/
- **TablePlus**: https://tableplus.com/
- **DBeaver**: https://dbeaver.io/

#### API Testing Tools

- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code extension)

## Next Steps

1. **Add Initial Skills**: Populate the skills table with common skills
2. **Create Test Accounts**: Create multiple users to test matching
3. **Test Skill Matching**: Add skills and verify match algorithm
4. **Test Sessions**: Create and manage learning sessions
5. **Test Token System**: Earn and spend tokens

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Support

If you encounter issues not covered here:

1. Check the main [README.md](./README.md)
2. Search existing GitHub issues
3. Create a new issue with details:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
