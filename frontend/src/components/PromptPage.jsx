import { useState, useCallback } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { MermaidDiagram } from './MermaidDiagram'
import { generateMermaid } from '../services/api'

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
      setError('Please enter a prompt')
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

  const handleClear = useCallback(() => {
    setPrompt('')
    setMermaidCode('')
    setError(null)
    setIsMock(false)
  }, [])

  const handleCopyMermaid = useCallback(async () => {
    if (!mermaidCode) return

    try {
      await navigator.clipboard.writeText(mermaidCode)
      // You could add a toast notification here
      alert('Mermaid code copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }, [mermaidCode])

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Mermaid Diagram Generator</h1>
          <p className="text-muted-foreground">
            Enter a prompt to generate a Mermaid diagram
          </p>
        </div>

        {/* Prompt Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Prompt</CardTitle>
            <CardDescription>
              Describe the diagram you want to create (e.g., "Create a flowchart for user login process")
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Example: Create a sequence diagram showing the flow from user input to OpenAI API response..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={isLoading}
                className="resize-none"
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1 min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Generating...</span>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </>
                  ) : (
                    'Generate Diagram'
                  )}
                </Button>
                
                {mermaidCode && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCopyMermaid}
                    disabled={isLoading}
                  >
                    Copy Mermaid Code
                  </Button>
                )}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Clear
                </Button>
              </div>
            </form>

            {isMock && (
              <Alert>
                <AlertDescription className="flex items-center gap-2">
                  <Badge variant="secondary">Mock Mode</Badge>
                  <span>Using mock data - backend is unavailable</span>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Diagram Display */}
        <MermaidDiagram 
          mermaidCode={mermaidCode}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}

