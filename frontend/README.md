# AI System Modeling Generator - Frontend

A React application that generates Mermaid diagrams from text prompts using AI. The frontend sends prompts to a backend API (which calls OpenAI) and displays the rendered diagrams.

## Features

- 🎨 Modern UI built with shadcn/ui and Tailwind CSS
- 📊 Renders various Mermaid diagram types (flowcharts, sequence diagrams, class diagrams, ER diagrams, etc.)
- 🔄 Automatic fallback to mock data when backend is unavailable
- 📋 Copy Mermaid code to clipboard
- ♿ Accessible components built on Radix UI
- 🎯 Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK=false
```

- `VITE_API_URL`: Backend API URL 
  - **Development**: `http://localhost:5000` (default)
  - **Production with nginx proxy**: Leave empty or set to `''` to use relative URLs (recommended)
  - **Production without proxy**: Set to your full backend URL (e.g., `https://api.yourdomain.com`)
- `VITE_USE_MOCK`: Set to `true` to always use mock data, `false` to try backend first (default: `false`)

**Note for Production Deployment:**
- When using nginx with `/api/` proxy, leave `VITE_API_URL` empty or unset
- The frontend will automatically use relative URLs (`/api/...`) in production mode
- This ensures requests go through your nginx proxy correctly

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Mock Data

The application includes mock data that automatically activates when:
- `VITE_USE_MOCK=true` is set in `.env`
- Backend API is unavailable (network errors, connection refused, etc.)

This allows frontend development to continue independently of the backend.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── PromptPage.jsx   # Main prompt input component
│   │   └── MermaidDiagram.jsx  # Mermaid rendering component
│   ├── services/
│   │   ├── api.js           # Backend API integration with mock fallback
│   │   └── mockData.js      # Mock Mermaid diagram examples
│   ├── lib/
│   │   └── utils.js         # Utility functions (cn helper)
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind and shadcn/ui styles
├── components.json          # shadcn/ui configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json
```

## Usage

1. Enter a text prompt describing the diagram you want (e.g., "Create a flowchart for user login process")
2. Click "Generate Diagram" or press Enter
3. The diagram will be rendered below
4. Use "Copy Mermaid Code" to copy the generated Mermaid syntax
5. Use "Clear" to reset the form

## Technologies

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Mermaid** - Diagram rendering
- **Radix UI** - Accessible primitives (via shadcn/ui)

