# Backend API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Set up PostgreSQL database:
   - Create a PostgreSQL database
   - Update `DATABASE_URL` in `.env` file

4. Run database migrations:
```bash
npm run db:push
# or
npm run db:generate
npm run db:migrate
```

5. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `ACCESS_TOKEN_SECRET` - Secret key for access tokens (change in production!)
- `OPENAI_API_KEY` - OpenAI API key for diagram generation

## API Endpoints

### Authentication

#### POST `/api/users/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_token"
  }
}
```

#### POST `/api/users/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_token"
  }
}
```

#### POST `/api/users/logout`
Logout. Requires authentication.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Diagrams

#### POST `/api/diagrams/generate`
Generate Mermaid diagram from prompt.

**Request Body:**
```json
{
  "prompt": "Create a flowchart for user login",
  "type": "flowchart", // optional
  "userId": "uuid" // optional, for saving
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mermaid": "graph TD\n    A[Start] --> B[End]",
    "type": "flowchart",
    "diagramId": "uuid" // if userId was provided
  }
}
```

#### GET `/api/diagrams/:userId`
Get all diagrams for a user.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "prompt": "Create a flowchart",
      "mermaidCode": "graph TD\n    A[Start] --> B[End]",
      "type": "flowchart",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Authentication

- Access tokens expire in **90 days (3 months)**
- Include access token in Authorization header: `Authorization: Bearer <token>`

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique, Required)
- `name` (String, Optional)
- `password` (String, Hashed, Required)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Diagrams Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key -> users.id)
- `prompt` (Text, Required)
- `mermaidCode` (Text, Required)
- `type` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

