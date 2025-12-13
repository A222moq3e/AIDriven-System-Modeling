# AI-Driven System Modeling

An intelligent web application that generates Mermaid diagrams from natural language prompts using AI. Users can describe a diagram in plain text, and the system automatically converts it into visual Mermaid syntax and renders it as a diagram.

## ERD
https://app.eraser.io/workspace/f3MkRV0Oo0kyLIl552qa?origin=share

## Project Overview

This project provides a seamless interface for creating various types of diagrams (flowcharts, sequence diagrams, class diagrams, ER diagrams, etc.) through AI-powered text-to-diagram conversion. The application consists of a modern React frontend and an Express.js backend that integrates with OpenAI's API to generate Mermaid syntax from user prompts.

### Key Features

- **AI-Powered Generation**: Converts natural language prompts into Mermaid diagram syntax using OpenAI GPT-4
- **Diagram Type Selector**: Dropdown menu to select from 7 different diagram types with fixed-width button (180px)
- **Automatic Retry Logic**: Frontend validates Mermaid syntax and retries up to 5 times if invalid with silent error suppression
- **User-Friendly Error Handling**: Technical Mermaid errors are hidden; users see helpful, actionable messages instead
- **User Authentication**: Secure signup, login, and logout with JWT access tokens (90-day expiry)
- **Diagram Persistence**: Save and retrieve user-generated diagrams tied to accounts
- **Profile Management**: Update username, email, and change password
- **7 Supported Diagram Types**: Flowchart, Sequence Diagram, Class Diagram, State Diagram, ERD, User Journey, Gantt Chart
- **Modern UI**: Clean, minimal interface with full-screen diagram display and zoom controls
- **Mock Data Support**: Frontend works independently with mock data when backend is unavailable or `VITE_USE_MOCK=true`
- **Real-time Rendering**: Instant diagram rendering using Mermaid.js with client-side syntax validation
- **Responsive Design**: Works seamlessly across different screen sizes
- **Request Logging**: Comprehensive backend logging for debugging and monitoring

## Architecture

The application follows a client-server architecture:

1. **Frontend**: React application that handles user interactions, diagram rendering, and syntax validation
2. **Backend**: Express.js API server that processes prompts, communicates with OpenAI, and manages user data
3. **Database**: MongoDB for storing user accounts and diagrams (via Mongoose)
4. **AI Integration**: OpenAI API generates Mermaid syntax from user prompts

### Flow

```
User Selects Diagram Type → User Input → Frontend → Backend API → 
OpenAI API (with formatted prompt) → Mermaid Syntax → 
Frontend Validation → (Retry up to 5 times if invalid, errors suppressed) → 
Rendered Diagram with Zoom Controls
```

**Detailed Flow:**
1. User selects diagram type from dropdown (e.g., "Sequence Diagram")
2. User enters prompt (e.g., "user login process")
3. Frontend sends: `{ type: "sequence diagram", prompt: "user login process" }`
4. Backend constructs: `"Create for me a sequence diagram, user login process"`
5. OpenAI GPT-4 generates Mermaid syntax
6. Frontend validates syntax (up to 5 retry attempts, silent error suppression)
7. On success: Diagram rendered with zoom controls; saved to user's history
8. On failure: User-friendly error message displayed

## Technology Stack

### Frontend

- **React 19** - Modern UI library for building interactive user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Mermaid.js** - Diagram rendering and syntax validation library
- **React Router** - Client-side routing
- **class-variance-authority**, **clsx**, **tailwind-merge** - Styling utilities

### Backend

- **Express.js 5** - API framework
- **MongoDB + Mongoose** - Data layer
- **OpenAI API** - Mermaid generation
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## Project Structure

```
AIDriven-System-Modeling/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components (MermaidDiagram, PromptPage, etc.)
│   │   ├── pages/        # Page components (Login, Signup)
│   │   ├── contexts/     # React contexts (AuthContext)
│   │   ├── services/     # API services and mock data
│   │   ├── lib/          # Utility functions
│   │   └── main.jsx      # Application entry point
│   └── package.json
├── backend/              # Express.js backend API
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose models (User, Diagram)
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware (auth, logger)
│   ├── config/           # Configuration files
│   ├── db/               # Database connection
│   ├── utils/            # Utility functions (crypto, jwt)
│   ├── server.js          # Express server
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup

```bash
cd backend
npm install
# create .env with the values below
npm run dev
```

The backend API will be available at `http://localhost:5000`.

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=false
```

**Backend** (`backend/.env`):
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_PROMPT_ID=pmpt_6925efc645008196aef1bed0c7ea4c4b0e39ebb9f904648c
OPENAI_PROMPT_VERSION=4
DATABASE_URL=mongodb://localhost:27017/your_database_name
PORT=5000
ACCESS_TOKEN_SECRET=your-access-token-secret-change-in-production
```

**Note:** 
- `OPENAI_PROMPT_ID` is optional. If provided, the system will use OpenAI's Responses API with your stored prompt instead of the Chat Completions API.
- `OPENAI_PROMPT_VERSION` is optional (defaults to "4"). Specifies the version of your stored prompt to use.
- If `OPENAI_PROMPT_ID` is omitted, the system falls back to the default inline prompt using Chat Completions API.

### OpenAI Configuration Details

**API Key (`OPENAI_API_KEY`):**
- Required for AI diagram generation
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

**Stored Prompt Configuration:**

When using a stored prompt (via `OPENAI_PROMPT_ID`), the system uses OpenAI's **Responses API**:

```javascript
const response = await openai.responses.create({
  prompt: {
    id: "pmpt_6925efc645008196aef1bed0c7ea4c4b0e39ebb9f904648c",
    version: "4"
  },
  input: "Create for me a flowchart, user login process"
});
```

**Environment Variables:**
- `OPENAI_PROMPT_ID`: Your stored prompt ID (e.g., `pmpt_6925efc645008196aef1bed0c7ea4c4b0e39ebb9f904648c`)
- `OPENAI_PROMPT_VERSION`: Version number (default: `"4"`)

**How It Works:**
- The system constructs a full prompt: `"Create for me a {diagramType}, {user's prompt}"`
- Example: `"Create for me a sequence diagram, user authentication flow"`
- This full prompt is sent as the `input` parameter to your stored prompt
- Your stored prompt then interprets the request and generates the Mermaid diagram

**Benefits of Stored Prompts:**
- Version control for prompts on OpenAI platform
- A/B testing different prompt variations
- Easier prompt optimization without code changes
- Centralized prompt management across multiple services
- Built-in prompt analytics and monitoring

---

**Fallback Configuration (Chat Completions API):**

If `OPENAI_PROMPT_ID` is not set, the system uses the standard Chat Completions API:

**Inline System Prompt:**
```
"You are a helpful assistant that generates valid Mermaid.js diagram code. 
Return ONLY the mermaid code, no markdown fencing, no explanation."
```

**Model Configuration:**
- Model: `gpt-4`
- Max Tokens: `500`
- API: `openai.chat.completions.create()`

**Location:** `backend/controllers/diagramController.js`

## Development

### Frontend Development

The frontend includes mock data support, allowing development to continue even when the backend is unavailable. Set `VITE_USE_MOCK=true` to always use mock data, or the frontend will automatically fallback to mock data if the backend is unreachable.

**Key Features:**
- **Full-screen diagram display**: Diagrams take up the entire viewport with zoom controls
- **Diagram Type Selector**: Fixed-width dropdown button (180px) with 7 diagram types
- **Minimal prompt interface**: Compact input box at the bottom with submit button
- **Real-time rendering**: Diagrams render instantly as Mermaid syntax is received
- **Syntax validation**: Automatic validation and retry logic (up to 5 attempts) with silent error suppression
- **Error handling**: Technical errors hidden; users see friendly messages like "Unable to generate diagram after 5 attempts. Please try rephrasing your prompt or selecting a different diagram type."
- **Loading states**: Visual feedback during diagram generation
- **Retry feedback**: Shows notification when retries were needed
- **Zoom Controls**: Zoom in/out and reset zoom functionality for diagrams

### Backend Development

The backend includes comprehensive request logging middleware that logs:
- Request method, path, and full URL
- Query parameters and route parameters
- Request body (with password fields hidden)
- Response status and duration

**Key Features:**
- **User Authentication**: JWT-based authentication with secure password hashing
- **Diagram Management**: Save and retrieve user diagrams
- **Request Logging**: Detailed logging for all API requests
- **Error Handling**: Comprehensive error handling with appropriate status codes

## API Endpoints

All endpoints return JSON responses with a consistent format:
```json
{
  "success": true/false,
  "data": { ... },      // On success
  "message": "..."      // On error or informational
}
```

### Base URL
Development: `http://localhost:5000`

### Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

### 1. User Signup

**Endpoint:** `POST /api/users/signup`  
**Access:** Public  
**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars, lowercase letters/numbers/underscores)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string (MongoDB ObjectId)",
      "username": "string",
      "email": "string",
      "createdAt": "timestamp"
    },
    "accessToken": "string (JWT token, 90-day expiry)"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields, invalid format, or password too short
- `409 Conflict`: Username or email already exists
- `500 Internal Server Error`: Server error during signup

---

### 2. User Login

**Endpoint:** `POST /api/users/login`  
**Access:** Public  
**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "timestamp"
    },
    "accessToken": "string (JWT token, 90-day expiry)"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server error during login

---

### 3. User Logout

**Endpoint:** `POST /api/users/logout`  
**Access:** Protected (requires authentication)  
**Description:** Logout user (client should clear token)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error during logout

---

### 4. Update Profile

**Endpoint:** `PUT /api/users/profile`  
**Access:** Protected (requires authentication)  
**Description:** Update username and email

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "username": "string (required, 3-30 chars, lowercase letters/numbers/underscores)",
  "email": "string (required, valid email format)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "timestamp"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or invalid format
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `409 Conflict`: Username or email already taken by another user
- `500 Internal Server Error`: Server error during update

---

### 5. Change Password

**Endpoint:** `PUT /api/users/password`  
**Access:** Protected (requires authentication)  
**Description:** Change user password

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 6 characters)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or new password too short
- `401 Unauthorized`: Missing/invalid token or incorrect current password
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error during password change

---

### 6. Generate Diagram

**Endpoint:** `POST /api/diagrams/generate`  
**Access:** Protected (requires authentication)  
**Description:** Generate Mermaid diagram from prompt using OpenAI GPT-4

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "prompt": "string (required, user's diagram description)",
  "type": "string (optional, diagram type: 'flowchart', 'sequence diagram', 'class diagram', 'state diagram', 'entity relationship diagram', 'user journey diagram', 'gantt chart')"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "mermaid": "string (generated Mermaid syntax)",
    "type": "string (diagram type)",
    "diagramId": null
  }
}
```

**Notes:**
- The backend constructs the full prompt as: `"Create for me a {type}, {prompt}"`
- Frontend validates the returned Mermaid syntax and retries up to 5 times if invalid
- Diagrams are NOT auto-saved during generation (to avoid duplicates during retries)
- Use the separate save endpoint after successful validation

**Error Responses:**
- `400 Bad Request`: Missing prompt
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: OpenAI API error or server error

---

### 7. Save Diagram

**Endpoint:** `POST /api/diagrams`  
**Access:** Protected (requires authentication)  
**Description:** Save a validated diagram to user's history

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "prompt": "string (required, original user prompt)",
  "mermaidCode": "string (required, validated Mermaid syntax)",
  "type": "string (required, diagram type)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string (MongoDB ObjectId)",
    "diagramId": "string (same as id)",
    "userId": "string",
    "prompt": "string",
    "mermaidCode": "string",
    "type": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error during save

---

### 8. Get User Diagrams

**Endpoint:** `GET /api/diagrams/:userId`  
**Access:** Protected (requires authentication)  
**Description:** Retrieve all diagrams for a specific user

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
- `userId`: string (required, user's ID)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "prompt": "string",
      "mermaidCode": "string",
      "type": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

**Notes:**
- Returns diagrams sorted by creation date (newest first)

**Error Responses:**
- `400 Bad Request`: Missing userId
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error during fetch

---

### 9. Health Check

**Endpoint:** `GET /health`  
**Access:** Public  
**Description:** Check if backend server is running

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

### 10. Root Endpoint

**Endpoint:** `GET /`  
**Access:** Public  
**Description:** Basic server test endpoint

**Success Response (200):**
```
API is running...
```

## Features in Detail

### Diagram Type Selection

Users can choose from 7 different diagram types via a fixed-width dropdown button:
- **Flowchart** (default)
- **Sequence Diagram**
- **Class Diagram**
- **State Diagram**
- **Entity Relationship Diagram (ERD)**
- **User Journey Diagram**
- **Gantt Chart**

The selected type is prepended to the user's prompt when sent to OpenAI: `"Create for me a {type}, {user_prompt}"`

### Automatic Retry Logic & Error Suppression

- Frontend validates all generated Mermaid syntax using Mermaid's renderer
- If syntax is invalid, automatically retries up to 5 times
- **All technical Mermaid errors are suppressed** during validation
- Users never see syntax errors like "Syntax error in text mermaid version X.X.X"
- After 5 failed attempts, shows user-friendly message: "Unable to generate diagram after 5 attempts. Please try rephrasing your prompt or selecting a different diagram type."
- Successful generation after retries shows notification: "Generated successfully after N retries"
- Mermaid configuration includes `suppressErrors: true` and `logLevel: 'error'`

### User Authentication

- Secure password hashing using bcryptjs (min 6 characters)
- JWT tokens for session management (90-day expiry)
- Protected routes with authentication middleware
- User-specific diagram storage
- Username validation (3-30 chars, lowercase letters/numbers/underscores)
- Email validation with proper format checking
- Password change functionality with current password verification
- Profile update (username and email) with uniqueness validation

### Database Schema

**User Model:**
- `_id`: MongoDB ObjectId (auto-generated)
- `email`: String (unique, required)
- `name`: String (optional)
- `password`: String (hashed, required)
- `createdAt`: Date
- `updatedAt`: Date

**Diagram Model:**
- `_id`: MongoDB ObjectId (auto-generated)
- `userId`: String (required)
- `prompt`: String (required)
- `mermaidCode`: String (required)
- `type`: String (default: 'flowchart')
- `createdAt`: Date
- `updatedAt`: Date

### Supported Diagram Types

The application supports 7 Mermaid diagram types:

1. **Flowchart** - Process flows, decision trees, workflows
2. **Sequence Diagram** - Interaction between objects/systems over time
3. **Class Diagram** - Object-oriented class structures and relationships
4. **State Diagram** - State machines and state transitions
5. **Entity Relationship Diagram (ERD)** - Database schema and relationships
6. **User Journey Diagram** - User experience flows and emotions
7. **Gantt Chart** - Project timelines and task scheduling

### JWT Token Details

- **Access Token Expiry**: 90 days (7,776,000 seconds)
- **Token Storage**: Client-side localStorage via `authSession` key
- **Token Format**: JWT (JSON Web Token)
- **Token Payload**: `{ userId, email }`
- **Header Format**: `Authorization: Bearer <token>`

### Error Handling Strategy

**Frontend Error Handling:**
- All Mermaid syntax errors are suppressed during validation retries
- Technical errors never shown to end users
- User-friendly messages with actionable suggestions
- Error examples:
  - ❌ Mermaid Error: "Syntax error in text mermaid version 10.9.5"
  - ✅ User Message: "Unable to generate diagram after 5 attempts. Please try rephrasing your prompt or selecting a different diagram type."

**Backend Error Handling:**
- Consistent JSON response format with `success` boolean
- Appropriate HTTP status codes (400, 401, 404, 409, 500)
- Sensitive information (passwords) hidden in logs
- Detailed error logging for developers (not exposed to users)

**Error Status Codes:**
- `400`: Bad Request (validation errors, missing required fields)
- `401`: Unauthorized (authentication failures)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate username/email)
- `500`: Internal Server Error (server/OpenAI API errors)

### UI Components & Design

**PromptPage (Main Interface):**
- Fixed-width diagram type dropdown (180px) with truncation for long labels
- Flexible prompt input box with circular submit button
- Full-screen diagram display area
- Bottom-aligned prompt controls (width: 500px, centered)
- Real-time loading spinner during generation
- Retry notification alerts (auto-dismiss after 3 seconds)
- Error alerts with user-friendly messages

**MermaidDiagram (Diagram Display):**
- Full viewport diagram rendering
- Zoom controls (zoom in, zoom out, reset) in top-right corner
- Automatic SVG scaling to fit container
- Responsive layout with overflow handling
- Skeleton loading states during generation
- Error suppression for invalid syntax during validation

**Design Principles:**
- Minimal, clean interface with focus on diagram content
- Backdrop blur effects for prompt controls
- Consistent shadcn/ui component styling
- Tailwind CSS utility-first approach
- Responsive design across screen sizes
- Accessible components built on Radix UI primitives

## Contributing

This project is part of a university course (CS495 - Web Development). Contributions and improvements are welcome!

## License

This project is for educational purposes.

## Acknowledgments

- OpenAI for AI capabilities
- Mermaid.js for diagram rendering and validation
- shadcn/ui for component library
- All open-source contributors


update @README.md if needed, also add to it full backend documentation all endpoints with parameters that need, and what type of method and reponse will be