# Backend Execution Plan

Based on the **Backend Documentation**, this plan outlines the steps to build the Node.js/Express API with MongoDB.

## **Phase 1: Setup & Configuration**
1.  **Install Dependencies**
    *   **Action**: Install missing packages to match the documentation's requirements (Mongoose vs Drizzle) and necessary utilities.
    *   **Packages**: `mongoose` (Schemas), `cors` (Frontend access), `dotenv` (Environment variables), `openai` (AI generation), `nodemon` (Dev server).
2.  **Environment Variables**
    *   **Action**: Create a `.env` file in the `backend/` root.
    *   **Variables**:
        *   `MONGO_URI` (Database connection string)
        *   `PORT` (Server port, e.g., 5000)
        *   `OPENAI_API_KEY` (For generating Mermaid code)
        *   `JWT_SECRET` (Optional, if auth becomes more complex later)
3.  **Database Connection**
    *   **Action**: Create `config/db.js`.
    *   **Logic**: Establish an asynchronous connection to MongoDB using Mongoose.

## **Phase 2: Data Models (Schemas)**
1.  **User Model** (`models/User.js`)
    *   **Fields**:
        *   `email` (String, required, unique)
        *   `name` (String)
        *   `createdAt` (Date, default: Date.now)
2.  **Diagram Model** (`models/Diagram.js`)
    *   **Fields**:
        *   `userId` (ObjectId, ref: 'User')
        *   `prompt` (String, required)
        *   `mermaidCode` (String, required)
        *   `type` (String, e.g., 'flowchart', 'sequence')
        *   `createdAt` (Date, default: Date.now)

## **Phase 3: Core Logic (Controllers)**
1.  **Diagram Controller** (`controllers/diagramController.js`)
    *   **`generateDiagram`**:
        *   Accepts `prompt` and `type`.
        *   Calls OpenAI API to generate Mermaid.js syntax.
        *   Returns structured JSON.
    *   **`saveDiagram`**:
        *   Validates input.
        *   Saves a new `Diagram` document linked to a `User`.
    *   **`getDiagrams`**:
        *   Retrieves all diagrams for a specific `userId`.
2.  **User Controller** (`controllers/userController.js`)
    *   **`loginOrSignup`**:
        *   Checks if email exists; returns user if yes, creates new one if no.
        *   Keeps auth lightweight as per docs.

## **Phase 4: API Routes**
1.  **Diagram Routes** (`routes/diagramRoutes.js`)
    *   `POST /api/diagrams/generate`
    *   `POST /api/diagrams/save`
    *   `GET /api/diagrams/:userId`
2.  **User Routes** (`routes/userRoutes.js`)
    *   `POST /api/users/auth`
3.  **Response Format**
    *   Success: `{ "data": { ... } }`
    *   Error: `{ "message": "Error description" }`

## **Phase 5: Server Entry Point**
1.  **Server File** (`server.js` or `index.js`)
    *   Initialize Express.
    *   Use Middleware: `cors()`, `express.json()`.
    *   Connect to DB (`config/db.js`).
    *   Mount Routes (`/api/diagrams`, `/api/users`).
    *   Start Server.
