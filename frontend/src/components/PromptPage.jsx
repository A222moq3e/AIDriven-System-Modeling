import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { MermaidDiagram } from './MermaidDiagram'
import { generateMermaid, saveDiagram } from '../services/api'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'

// Define all available diagram types
const DIAGRAM_TYPES = [
  { value: 'flowchart', label: 'Flowchart' },
  { value: 'sequence diagram', label: 'Sequence Diagram' },
  { value: 'class diagram', label: 'Class Diagram' },
  { value: 'state diagram', label: 'State Diagram' },
  { value: 'entity relationship diagram', label: 'Entity Relationship Diagram (ERD)' },
  { value: 'user journey diagram', label: 'User Journey Diagram' },
  { value: 'gantt chart', label: 'Gantt Chart' },
  { value: 'c4 diagram', label: 'C4 Diagram' },
  { value: 'zenuml diagram', label: 'ZenUML Diagram' },
]

/**
 * Main prompt page component
 */
export function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [diagramType, setDiagramType] = useState('flowchart')
  const [mermaidCode, setMermaidCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)
  const [retryInfo, setRetryInfo] = useState(null)
  const { user, accessToken } = useAuth()

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    
    if (!prompt.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setMermaidCode('')
    setRetryInfo(null)

    try {
      const result = await generateMermaid(prompt.trim(), {
        type: diagramType,
        accessToken,
      })
      setMermaidCode(result.mermaid)
      setIsMock(result.isMock || false)

      // Save the validated diagram only once (after successful validation)
      if (user?.id) {
        try {
          await saveDiagram({
            userId: user.id,
            prompt: prompt.trim(),
            mermaid: result.mermaid,
            type: diagramType,
            accessToken,
          })
        } catch (saveError) {
          console.warn('Failed to save diagram:', saveError.message)
        }
      }

      if (result.retries > 0) {
        setRetryInfo(`Generated successfully after ${result.retries} retr${result.retries === 1 ? 'y' : 'ies'}`)
        // Clear retry info after 3 seconds
        setTimeout(() => setRetryInfo(null), 3000)
      }
    } catch (err) {
      console.error('Error generating Mermaid:', err)
      setError(err.message || 'Failed to generate diagram. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [prompt, diagramType, user?.id, accessToken])

  const handleCopyMermaid = useCallback(async () => {
    if (!mermaidCode) return

    try {
      await navigator.clipboard.writeText(mermaidCode)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [mermaidCode])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Full Screen Diagram */}
      <div className="absolute inset-0">
        <MermaidDiagram 
          mermaidCode={mermaidCode}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Prompt Box - Small box positioned near bottom with spacing */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[500px]">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Diagram Type Selector and Input Row */}
          <div className="relative flex gap-2">
            {/* Diagram Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className={cn(
                    "h-10 w-[180px] px-3 bg-background/95 backdrop-blur-sm",
                    "text-sm border-input hover:bg-accent hover:text-accent-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "justify-between"
                  )}
                >
                  <span className="truncate">
                    {DIAGRAM_TYPES.find(t => t.value === diagramType)?.label || 'Flowchart'}
                  </span>
                  <svg className="ml-2 h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[280px] max-h-[300px] overflow-y-auto">
                {DIAGRAM_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setDiagramType(type.value)}
                    className={cn(
                      "cursor-pointer",
                      diagramType === type.value && "bg-accent"
                    )}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Prompt Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full h-10 px-4 pr-12 rounded-md border border-input bg-background/95 backdrop-blur-sm",
                  "text-sm ring-offset-background placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e)
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !prompt.trim()}
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </form>
        {retryInfo && (
          <Alert className="mt-2 bg-blue-50 border-blue-200">
            <AlertDescription className="text-xs text-blue-800">{retryInfo}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

