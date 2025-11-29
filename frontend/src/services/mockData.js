// Mock Mermaid diagram examples for development
const mockMermaidDiagrams = [
  {
    id: 1,
    type: 'flowchart',
    mermaid: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix Issue]
    E --> B
    C --> F[End]`,
    description: 'Simple flowchart example'
  },
  {
    id: 2,
    type: 'sequence',
    mermaid: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant OpenAI
    
    User->>Frontend: Enter prompt
    Frontend->>Backend: Send prompt
    Backend->>OpenAI: Request Mermaid syntax
    OpenAI-->>Backend: Return Mermaid code
    Backend-->>Frontend: Return response
    Frontend->>Frontend: Render diagram
    Frontend-->>User: Display diagram`,
    description: 'Sequence diagram for API flow'
  },
  {
    id: 3,
    type: 'class',
    mermaid: `classDiagram
    class User {
      +String name
      +String email
      +login()
      +logout()
    }
    class Admin {
      +String role
      +manageUsers()
    }
    class System {
      +processRequest()
      +validateData()
    }
    User <|-- Admin
    User --> System`,
    description: 'Class diagram example'
  },
  {
    id: 4,
    type: 'er',
    mermaid: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--|{ LINE-ITEM : "ordered in"
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }
    PRODUCT {
        string productName
        float price
    }`,
    description: 'Entity Relationship diagram'
  },
  {
    id: 5,
    type: 'flowchart',
    mermaid: `flowchart LR
    A[Input] --> B[Process]
    B --> C{Decision}
    C -->|Option 1| D[Output 1]
    C -->|Option 2| E[Output 2]
    D --> F[End]
    E --> F`,
    description: 'Decision flowchart'
  },
  {
    id: 6,
    type: 'gantt',
    mermaid: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Design :a1, 2024-01-01, 30d
    section Phase 2
    Development :a2, 2024-01-15, 45d
    section Phase 3
    Testing :a3, 2024-02-15, 20d`,
    description: 'Gantt chart example'
  }
]

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Get a mock Mermaid diagram response
 * @param {string} prompt - User's prompt (optional, for future use)
 * @returns {Promise<{mermaid: string, isMock: boolean}>}
 */
export async function getMockMermaidResponse(prompt = '') {
  // Simulate API delay (200-500ms)
  const delayMs = Math.floor(Math.random() * 300) + 200
  await delay(delayMs)

  // Select a random diagram or match based on prompt keywords
  let selectedDiagram
  
  if (prompt) {
    const lowerPrompt = prompt.toLowerCase()
    
    // Try to match based on keywords
    if (lowerPrompt.includes('sequence') || lowerPrompt.includes('api') || lowerPrompt.includes('flow')) {
      selectedDiagram = mockMermaidDiagrams.find(d => d.type === 'sequence') || mockMermaidDiagrams[1]
    } else if (lowerPrompt.includes('class') || lowerPrompt.includes('object')) {
      selectedDiagram = mockMermaidDiagrams.find(d => d.type === 'class') || mockMermaidDiagrams[2]
    } else if (lowerPrompt.includes('database') || lowerPrompt.includes('er') || lowerPrompt.includes('entity')) {
      selectedDiagram = mockMermaidDiagrams.find(d => d.type === 'er') || mockMermaidDiagrams[3]
    } else if (lowerPrompt.includes('gantt') || lowerPrompt.includes('timeline')) {
      selectedDiagram = mockMermaidDiagrams.find(d => d.type === 'gantt') || mockMermaidDiagrams[5]
    } else {
      // Random selection
      selectedDiagram = mockMermaidDiagrams[Math.floor(Math.random() * mockMermaidDiagrams.length)]
    }
  } else {
    // Random selection if no prompt
    selectedDiagram = mockMermaidDiagrams[Math.floor(Math.random() * mockMermaidDiagrams.length)]
  }

  return {
    mermaid: selectedDiagram.mermaid,
    isMock: true,
    type: selectedDiagram.type,
    description: selectedDiagram.description
  }
}

/**
 * Get all mock diagrams (for testing)
 */
export function getAllMockDiagrams() {
  return mockMermaidDiagrams
}

