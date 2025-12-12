# AI-Driven System Modeling

An intelligent web application that generates Mermaid diagrams from natural language prompts using AI. Users can describe a diagram in plain text, and the system automatically converts it into visual Mermaid syntax and renders it as a diagram.

## ERD
https://app.eraser.io/workspace/f3MkRV0Oo0kyLIl552qa?origin=share

## Project Overview

This project provides a seamless interface for creating various types of diagrams (flowcharts, sequence diagrams, class diagrams, ER diagrams, etc.) through AI-powered text-to-diagram conversion. The application consists of a modern React frontend and an Express.js backend that integrates with OpenAI's API to generate Mermaid syntax from user prompts.

### Key Features

- **AI-Powered Generation**: Converts natural language prompts into Mermaid diagram syntax using OpenAI GPT-4
- **Automatic Retry Logic**: Frontend validates Mermaid syntax and retries up to 5 times if invalid
- **User Authentication**: Secure signup, login, and logout with JWT access tokens (90-day expiry)
- **Diagram Persistence**: Save and retrieve user-generated diagrams tied to accounts
- **Multiple Diagram Types**: Supports flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and more
- **Modern UI**: Clean, minimal interface with full-screen diagram display
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
User Input → Frontend → Backend API → OpenAI API → Mermaid Syntax → 
Frontend Validation → (Retry if invalid) → Rendered Diagram
```

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
DATABASE_URL=mongodb://localhost:27017/your_database_name
PORT=5000
ACCESS_TOKEN_SECRET=your-access-token-secret-change-in-production
```

## Development

### Frontend Development

The frontend includes mock data support, allowing development to continue even when the backend is unavailable. Set `VITE_USE_MOCK=true` to always use mock data, or the frontend will automatically fallback to mock data if the backend is unreachable.

**Key Features:**
- **Full-screen diagram display**: Diagrams take up the entire viewport
- **Minimal prompt interface**: Compact input box at the bottom with circular submit button
- **Real-time rendering**: Diagrams render instantly as Mermaid syntax is received
- **Syntax validation**: Automatic validation and retry logic for invalid Mermaid syntax
- **Error handling**: Graceful error handling with user-friendly messages
- **Loading states**: Visual feedback during diagram generation
- **Retry feedback**: Shows notification when retries were needed

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

### Authentication (JWT)

- `POST /api/users/signup` — Body: `{ "username": "string", "email": "string", "password": "string" }` → `{ success, data: { user, accessToken } }`
- `POST /api/users/login` — Body: `{ "email": "string", "password": "string" }` → `{ success, data: { user, accessToken } }`
- `POST /api/users/logout` — Header: `Authorization: Bearer <token>` → `{ success, message }`

### Diagrams (all protected)

- `POST /api/diagrams/generate` — Body: `{ "prompt": "string", "type": "string" (optional) }` → `{ success, data: { mermaid, type, diagramId: null } }`
  - Generation requires auth; the frontend saves to history via the separate save endpoint after validating Mermaid syntax.
- `POST /api/diagrams` — Body: `{ "prompt": "string", "mermaidCode": "string", "type": "string" }` → `{ success, data: { id, ... } }`
- `GET /api/diagrams/:userId` — Returns all diagrams for a user `{ success, data: [...] }`

### Health Check

- `GET /health` - Check if backend is running
  - Response: `{ "status": "ok" }`

## Features in Detail

### Automatic Retry Logic

The frontend validates all generated Mermaid syntax using Mermaid’s renderer. If syntax is invalid, it retries up to 5 times before surfacing an error, and it shows when retries were needed.

### User Authentication

- Secure password hashing using bcryptjs
- JWT tokens for session management
- Protected routes with authentication middleware
- User-specific diagram storage

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

## Contributing

This project is part of a university course (CS495 - Web Development). Contributions and improvements are welcome!

## License

This project is for educational purposes.

## Acknowledgments

- OpenAI for AI capabilities
- Mermaid.js for diagram rendering and validation
- shadcn/ui for component library
- All open-source contributors
