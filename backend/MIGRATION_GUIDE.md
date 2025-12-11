# Migration Guide: Mongoose to Drizzle ORM

This guide explains the changes made to migrate from Mongoose (MongoDB) to Drizzle ORM (PostgreSQL).

## Key Changes

### 1. Database Migration
- **Before**: MongoDB with Mongoose
- **After**: PostgreSQL with Drizzle ORM

### 2. Module System
- **Before**: CommonJS (`require`/`module.exports`)
- **After**: ES Modules (`import`/`export`)

### 3. Authentication
- **Before**: Simple email-based auth (no password hashing)
- **After**: Full JWT authentication with:
  - Access tokens (90 days expiration)
  - Refresh tokens (180 days expiration)
  - Password hashing with bcrypt

## Setup Steps

### 1. Install PostgreSQL
Make sure PostgreSQL is installed and running on your system.

### 2. Create Database
```sql
CREATE DATABASE ai_driven_system_modeling;
```

### 3. Update Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/ai_driven_system_modeling
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-in-production
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Database Migrations
```bash
cd backend
npm run db:push
```

This will create the tables in your PostgreSQL database.

### 5. Start the Server
```bash
npm start
```

## API Changes

### New Endpoints

1. **POST `/api/users/signup`** - Create new user account
2. **POST `/api/users/login`** - Login with email/password
3. **POST `/api/users/refresh`** - Refresh access token
4. **POST `/api/users/logout`** - Logout (requires authentication)

### Updated Endpoints

- **POST `/api/diagrams/generate`** - Now uses `userId` from JWT token (optional)
- **GET `/api/diagrams/:userId`** - Same functionality, but uses PostgreSQL

## Authentication Flow

1. User signs up or logs in → receives `accessToken` and `refreshToken`
2. Include `accessToken` in requests: `Authorization: Bearer <token>`
3. When `accessToken` expires, use `refreshToken` to get a new `accessToken`
4. `refreshToken` is stored in database and can be invalidated on logout

## Token Expiration

- **Access Token**: 90 days (3 months)
- **Refresh Token**: 180 days (6 months)

## File Structure Changes

### New Files
- `backend/db/schema.js` - Drizzle schema definitions
- `backend/db/index.js` - Database connection and Drizzle instance
- `backend/utils/jwt.js` - JWT token utilities
- `backend/utils/crypto.js` - Password hashing utilities
- `backend/middleware/auth.js` - Authentication middleware
- `backend/drizzle.config.js` - Drizzle configuration

### Updated Files
- `backend/server.js` - Now uses ES modules
- `backend/controllers/userController.js` - Full authentication implementation
- `backend/controllers/diagramController.js` - Updated to use Drizzle
- `backend/routes/userRoutes.js` - New authentication routes
- `backend/routes/diagramRoutes.js` - Updated to ES modules
- `backend/config/db.js` - Updated for PostgreSQL

### Removed/Deprecated Files
- `backend/models/User.js` - Replaced by Drizzle schema
- `backend/models/Diagram.js` - Replaced by Drizzle schema

## Testing the API

### Signup
```bash
curl -X POST http://localhost:5000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Generate Diagram (with auth)
```bash
curl -X POST http://localhost:5000/api/diagrams/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"prompt":"Create a flowchart for user login","type":"flowchart","userId":"<user_id>"}'
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/users/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

## Notes

- Old Mongoose models are still in the codebase but are no longer used
- The frontend will need to be updated to use the new authentication endpoints
- Make sure to change the JWT secrets in production!

