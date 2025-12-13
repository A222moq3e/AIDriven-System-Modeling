# API Documentation

Base URL: `http://localhost:5000/api`

## **1. User Authentication**

### **POST /users/auth**
Logs in an existing user or signs up a new one.

*   **Body Parameters:**
    *   `email` (string, required): User's email address.
    *   `name` (string, optional): User's display name.

*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "email": "user@example.com",
        "name": "User Name",
        "createdAt": "2023-10-27T10:00:00.000Z",
        "__v": 0
      }
    }
    ```

*   **Response (Error - 400):**
    ```json
    {
      "message": "Email is required"
    }
    ```

---

## **2. Diagrams**

### **POST /diagrams/generate**
Generates a Mermaid.js diagram from a text prompt. If a `userId` is provided, it automatically saves the generated diagram to the user's history.

*   **Body Parameters:**
    *   `prompt` (string, required): Description of the system or process to model.
    *   `type` (string, optional): Diagram type (e.g., 'flowchart', 'sequence', 'class'). Defaults to 'flowchart'.
    *   `userId` (string, optional): The ID of the user requesting the diagram. If provided, the diagram is saved.

*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "data": {
        "mermaid": "graph TD; A-->B;",
        "type": "flowchart",
        "diagramId": "60d0fe4f5311236168a109cb" // Null if userId was not provided
      }
    }
    ```

*   **Response (Error - 400):**
    ```json
    {
      "message": "Prompt is required"
    }
    ```

### **GET /diagrams/:userId**
Retrieves all diagrams saved by a specific user.

*   **Path Parameters:**
    *   `userId` (string, required): The ID of the user.

*   **Response (Success - 200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "60d0fe4f5311236168a109cb",
          "userId": "60d0fe4f5311236168a109ca",
          "prompt": "Login flow",
          "mermaidCode": "graph TD; A-->B;",
          "type": "flowchart",
          "createdAt": "2023-10-27T10:05:00.000Z",
          "__v": 0
        }
      ]
    }
    ```
