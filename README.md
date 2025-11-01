# Swaply - Skill Exchange Platform

A comprehensive skill exchange platform where users can teach and learn different skills from each other using an in-app token currency system. Available on both web (React.js) and mobile (React Native).

## Features

### Core Features
- **User Authentication**: Email, Google, and Apple sign-in
- **Skill Matching**: Smart algorithm to pair users with complementary skills
- **Token System**: In-app currency for lessons, challenges, and referrals
- **Video Sessions**: Integrated video calling using Agora
- **Real-time Chat**: WebSocket-based messaging
- **Session Management**: Schedule, manage, and track learning sessions
- **Rating System**: Review teachers and learners
- **Dashboard Analytics**: Track learning progress and statistics

### Token Economy
- Earn tokens by teaching, completing challenges, referrals, and streaks
- Spend tokens on lessons, group workshops, and premium features
- Purchase additional tokens via Stripe

## Tech Stack

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **Real-time**: Socket.io
- **Payments**: Stripe
- **Video**: Agora SDK
- **File Upload**: Cloudinary

### Web Application
- **Framework**: React.js with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Headless UI

### Mobile Application
- **Framework**: React Native + TypeScript
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Styling**: React Native StyleSheet

### Shared
- **Monorepo**: npm workspaces
- **Shared Types**: TypeScript definitions
- **Code Sharing**: Common utilities and constants

## Project Structure

```
swaply/
├── apps/
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   └── database/
│   │   └── package.json
│   ├── web/             # React web application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── hooks/
│   │   └── package.json
│   └── mobile/          # React Native mobile app
│       ├── src/
│       └── package.json
└── packages/
    └── shared/          # Shared TypeScript types
        └── src/
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swaply.git
   cd swaply
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb swaply

   # Or using psql
   psql -U postgres
   CREATE DATABASE swaply;
   ```

4. **Configure environment variables**

   Create `.env` file in `apps/backend/`:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Update the following variables:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=swaply
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_here

   # Stripe (optional for payments)
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret

   # Agora (optional for video)
   AGORA_APP_ID=your_app_id
   AGORA_APP_CERTIFICATE=your_certificate

   # Email (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate -w @swaply/backend
   ```

### Running the Application

#### Development Mode

1. **Start all services**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:5000
   - Web app on http://localhost:3000

2. **Or start individually**
   ```bash
   # Backend only
   npm run backend:dev

   # Web only
   npm run web:dev

   # Mobile only
   npm run mobile:dev
   ```

#### Production Build

```bash
# Build all apps
npm run build

# Build specific app
npm run build -w @swaply/backend
npm run build -w @swaply/web
```

## API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
```

### User Endpoints

```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/:id
GET    /api/v1/users/search
```

### Skill Endpoints

```
GET    /api/v1/skills
GET    /api/v1/skills/my-skills
POST   /api/v1/skills/my-skills
DELETE /api/v1/skills/my-skills/:id
GET    /api/v1/skills/matches
```

### Session Endpoints

```
POST   /api/v1/sessions
GET    /api/v1/sessions
GET    /api/v1/sessions/:id
POST   /api/v1/sessions/:id/start
POST   /api/v1/sessions/:id/end
POST   /api/v1/sessions/:id/cancel
```

### Token Endpoints

```
GET    /api/v1/tokens/balance
GET    /api/v1/tokens/transactions
POST   /api/v1/tokens/purchase
POST   /api/v1/tokens/daily-challenge
```

## Database Schema

### Main Tables

- **users**: User accounts and profiles
- **skills**: Available skills catalog
- **user_skills**: User-to-skill relationships (can teach/want to learn)
- **sessions**: Learning/teaching sessions
- **token_transactions**: Token earning and spending history
- **ratings**: Session reviews and ratings

## Features Roadmap

### Implemented ✅
- User authentication (email/password)
- User profiles and skill management
- Skill matching algorithm
- Session scheduling
- Token system with transactions
- Rating system
- Real-time updates with Socket.io
- Payment integration (Stripe)
- Video calling preparation (Agora)

### Coming Soon 🚧
- Mobile app (React Native)
- Google and Apple OAuth
- Group workshops
- In-app chat and messaging
- Push notifications
- AI-powered skill recommendations
- Skill certification system
- Multi-language support
- Dark mode
- Admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| JWT_SECRET | JWT secret key | Yes |
| JWT_REFRESH_SECRET | JWT refresh secret | Yes |
| STRIPE_SECRET_KEY | Stripe API key | No |
| AGORA_APP_ID | Agora app ID | No |
| AGORA_APP_CERTIFICATE | Agora certificate | No |

### Web

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## License

MIT License - see LICENSE file for details

## Support

For support, email support@swaply.com or open an issue on GitHub.

## Acknowledgments

- Agora for video calling SDK
- Stripe for payment processing
- All open-source libraries used in this project
