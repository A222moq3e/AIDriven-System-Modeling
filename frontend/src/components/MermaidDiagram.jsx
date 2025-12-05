import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

/**
 * MermaidDiagram component for rendering Mermaid syntax as diagrams
 * @param {Object} props
 * @param {string} props.mermaidCode - Mermaid syntax code to render
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 */
export function MermaidDiagram({ mermaidCode, isLoading, error }) {
  const diagramRef = useRef(null)
  const [renderError, setRenderError] = useState(null)
  const [isRendering, setIsRendering] = useState(false)

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    })
  }, [])

  // Render diagram when mermaidCode changes
  useEffect(() => {
    if (!mermaidCode || isLoading) {
      setRenderError(null)
      return
    }

    let isMounted = true

    const renderDiagram = async () => {
      // Wait a bit to ensure the ref is attached to DOM
      await new Promise(resolve => setTimeout(resolve, 0))
      
      if (!isMounted || !diagramRef.current) {
        return
      }

      setIsRendering(true)
      setRenderError(null)

      try {
        // Double-check ref is still valid
        if (!diagramRef.current) {
          setIsRendering(false)
          return
        }

        // Clear previous content
        diagramRef.current.innerHTML = ''

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

        // Validate and render
        const { svg } = await mermaid.render(id, mermaidCode)
        
        // Check again before setting innerHTML
        if (!isMounted || !diagramRef.current) {
          return
        }

        diagramRef.current.innerHTML = svg

        // Make SVG responsive
        const svgElement = diagramRef.current?.querySelector('svg')
        if (svgElement) {
          svgElement.style.maxWidth = '100%'
          svgElement.style.height = 'auto'
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        if (isMounted) {
          setRenderError(err.message || 'Failed to render diagram')
          if (diagramRef.current) {
            diagramRef.current.innerHTML = ''
          }
        }
      } finally {
        if (isMounted) {
          setIsRendering(false)
        }
      }
    }

    renderDiagram()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [mermaidCode, isLoading])

  // Determine what to show
  const showLoading = (isLoading || isRendering) && !mermaidCode
  const showError = (error || renderError) && !isLoading && !isRendering
  const showDiagram = mermaidCode && !isLoading && !isRendering && !error && !renderError

  return (
    <div className="w-full h-full flex items-center justify-center p-8 pt-24 pb-32">
      {/* Show loading state */}
      {showLoading && (
        <div className="space-y-2 w-full max-w-2xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}

      {/* Show error state */}
      {showError && (
        <Alert variant="destructive" className="max-w-2xl">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || renderError || 'Failed to render diagram'}
          </AlertDescription>
        </Alert>
      )}

      {/* Always render the ref container when we have mermaidCode or are rendering */}
      {/* This ensures the ref is available when the async render completes */}
      {(mermaidCode || isRendering) && (
        <div
          ref={diagramRef}
          className={`mermaid-diagram flex justify-center items-center w-full h-full overflow-auto ${
            showDiagram ? '' : 'hidden'
          }`}
        />
      )}
    </div>
  )
}

