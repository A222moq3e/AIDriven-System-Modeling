import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'

/**
 * MermaidDiagram component for rendering Mermaid syntax as diagrams
 * @param {Object} props
 * @param {string} props.mermaidCode - Mermaid syntax code to render
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 */
export function MermaidDiagram({ mermaidCode, isLoading, error }) {
  const diagramRef = useRef(null)
  const containerRef = useRef(null)
  const [renderError, setRenderError] = useState(null)
  const [isRendering, setIsRendering] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 'error', // Only log critical errors
      suppressErrors: true, // Don't render error diagrams with syntax errors
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

        // Make SVG responsive and fit to container
        const svgElement = diagramRef.current?.querySelector('svg')
        if (svgElement) {
          // Get container dimensions
          const container = containerRef.current
          if (container) {
            const containerWidth = container.clientWidth
            const containerHeight = container.clientHeight
            const svgWidth = svgElement.viewBox?.baseVal?.width || svgElement.width?.baseVal?.value || 800
            const svgHeight = svgElement.viewBox?.baseVal?.height || svgElement.height?.baseVal?.value || 600
            
            // Calculate scale to fit container
            const scaleX = containerWidth / svgWidth
            const scaleY = containerHeight / svgHeight
            const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down if needed
            
            svgElement.style.width = `${svgWidth * scale}px`
            svgElement.style.height = `${svgHeight * scale}px`
            svgElement.style.maxWidth = '100%'
            svgElement.style.maxHeight = '100%'
          } else {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
          }
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        if (isMounted) {
          // Show user-friendly error without exposing technical details
          setRenderError('Unable to display the diagram. Please try generating a new one.')
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

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)) // Max zoom 3x
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25)) // Min zoom 0.25x
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  // Determine what to show (moved before useEffects that use it)
  const showLoading = (isLoading || isRendering) && !mermaidCode
  const showError = (error || renderError) && !isLoading && !isRendering
  const showDiagram = mermaidCode && !isLoading && !isRendering && !error && !renderError

  // Reset zoom when new diagram is loaded
  useEffect(() => {
    if (mermaidCode && !isLoading) {
      setZoomLevel(1)
    }
  }, [mermaidCode, isLoading])

  // Update SVG size when zoom changes
  useEffect(() => {
    if (!diagramRef.current || !showDiagram) return
    
    const svgElement = diagramRef.current.querySelector('svg')
    if (svgElement && containerRef.current) {
      const container = containerRef.current
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const svgWidth = svgElement.viewBox?.baseVal?.width || svgElement.width?.baseVal?.value || 800
      const svgHeight = svgElement.viewBox?.baseVal?.height || svgElement.height?.baseVal?.value || 600
      
      // Calculate scale to fit container (only scale down, not up)
      const scaleX = containerWidth / svgWidth
      const scaleY = containerHeight / svgHeight
      const baseScale = Math.min(scaleX, scaleY, 1)
      
      svgElement.style.width = `${svgWidth * baseScale}px`
      svgElement.style.height = `${svgHeight * baseScale}px`
      svgElement.style.maxWidth = '100%'
      svgElement.style.maxHeight = '100%'
    }
  }, [zoomLevel, showDiagram])

  return (
    <div className="absolute inset-0 pt-14 pb-20 flex items-center justify-center">
      {/* Zoom Controls */}
      {showDiagram && (
        <div className="absolute top-20 right-4 z-10 flex flex-col gap-2 bg-background/95 backdrop-blur-sm border rounded-md p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="h-8 w-8"
            title="Zoom In"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.25}
            className="h-8 w-8"
            title="Zoom Out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="h-8 w-8"
            title="Reset Zoom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </Button>
        </div>
      )}
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
          ref={containerRef}
          className={`mermaid-diagram-container absolute inset-0 flex items-center justify-center ${
            showDiagram ? (zoomLevel > 1 ? 'overflow-auto' : 'overflow-hidden') : 'hidden'
          }`}
        >
          <div
            ref={diagramRef}
            className="flex justify-center items-center"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </div>
      )}
    </div>
  )
}

