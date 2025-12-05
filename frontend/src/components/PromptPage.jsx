import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { MermaidDiagram } from './MermaidDiagram'
import { generateMermaid } from '../services/api'
import { cn } from '../lib/utils'

/**
 * Main prompt page component
 */
export function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    
    if (!prompt.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)
    setMermaidCode('')

    try {
      const result = await generateMermaid(prompt.trim())
      setMermaidCode(result.mermaid)
      setIsMock(result.isMock || false)
    } catch (err) {
      console.error('Error generating Mermaid:', err)
      setError(err.message || 'Failed to generate diagram. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [prompt])

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
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[400px]">
        <form onSubmit={handleSubmit} className="relative">
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
        </form>
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

