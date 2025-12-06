# AI-Driven System Modeling

An intelligent web application that generates Mermaid diagrams from natural language prompts using AI. Users can describe a diagram in plain text, and the system automatically converts it into visual Mermaid syntax and renders it as a diagram.

## Project Overview

This project provides a seamless interface for creating various types of diagrams (flowcharts, sequence diagrams, class diagrams, ER diagrams, etc.) through AI-powered text-to-diagram conversion. The application consists of a modern React frontend and an Express.js backend that integrates with OpenAI's API to generate Mermaid syntax from user prompts.

### Key Features

- **AI-Powered Generation**: Converts natural language prompts into Mermaid diagram syntax using OpenAI
- **Multiple Diagram Types**: Supports flowcharts, sequence diagrams, class diagrams, ER diagrams, Gantt charts, and more
- **Modern UI**: Clean, minimal interface with full-screen diagram display
- **Mock Data Support**: Frontend works independently with mock data when backend is unavailable
- **Real-time Rendering**: Instant diagram rendering using Mermaid.js
- **Responsive Design**: Works seamlessly across different screen sizes

## Architecture

The application follows a client-server architecture:

1. **Frontend**: React application that handles user interactions and diagram rendering
2. **Backend**: Express.js API server that processes prompts and communicates with OpenAI
3. **AI Integration**: OpenAI API generates Mermaid syntax from user prompts

### Flow

```
User Input → Frontend → Backend API → OpenAI API → Mermaid Syntax → Frontend → Rendered Diagram
```

## Technology Stack

### Frontend

- **React 19** - Modern UI library for building interactive user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Mermaid.js** - Diagram rendering library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Utility functions for conditional styling

### Backend

- **Express.js 5** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for data storage
- **Drizzle ORM** - TypeScript ORM for database operations
- **OpenAI API** - AI service for generating Mermaid syntax from prompts

## Project Structure

```
AIDriven-System-Modeling/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services and mock data
│   │   └── lib/          # Utility functions
│   └── package.json
├── backend/              # Express.js backend API
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)
- OpenAI API key (for AI functionality)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
# Configure environment variables
npm start
```

The backend API will be available at `http://localhost:3000`

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK=false
```

**Backend** (`.env`):
```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Development

### Frontend Development

The frontend includes mock data support, allowing development to continue even when the backend is unavailable. Set `VITE_USE_MOCK=true` to always use mock data, or the frontend will automatically fallback to mock data if the backend is unreachable.

### Features

- **Full-screen diagram display**: Diagrams take up the entire viewport
- **Minimal prompt interface**: Compact input box at the bottom with circular submit button
- **Real-time rendering**: Diagrams render instantly as Mermaid syntax is received
- **Error handling**: Graceful error handling with user-friendly messages
- **Loading states**: Visual feedback during diagram generation

## API Endpoints

### Backend API

- `POST /api/generate-mermaid` - Generate Mermaid syntax from text prompt
  - Request body: `{ "prompt": "string" }`
  - Response: `{ "mermaid": "string" }`

## Contributing

This project is part of a university course (CS495 - Web Development). Contributions and improvements are welcome!

## License

This project is for educational purposes.

## Acknowledgments

- OpenAI for AI capabilities
- Mermaid.js for diagram rendering
- shadcn/ui for component library
- All open-source contributors

