import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchDiagrams } from '../services/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import mermaid from 'mermaid'

let mermaidInitialized = false
const ensureMermaid = () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    })
    mermaidInitialized = true
  }
}

const isValidMermaid = (code) => {
  if (!code) return false
  try {
    ensureMermaid()
    mermaid.parse(code)
    return true
  } catch {
    return false
  } finally {
    // Clean up validation artifacts that Mermaid creates in the DOM
    // These are error SVG elements that should not be visible
    requestAnimationFrame(() => {
      document.querySelectorAll('[id^="dvalidate-"], [id^="validate-"], [id^="dhistory-"]').forEach((el) => {
        el.remove()
      })
    })
  }
}

function HistoryDiagram({ mermaidCode }) {
  const containerRef = useRef(null)
  const [isRendering, setIsRendering] = useState(false)
  const [renderFailed, setRenderFailed] = useState(false)

  useEffect(() => {
    ensureMermaid()
  }, [])

  useEffect(() => {
    let active = true
    setRenderFailed(false)

    const render = async () => {
      if (!mermaidCode || !containerRef.current) {
        if (active) setRenderFailed(true)
        return
      }
      if (!isValidMermaid(mermaidCode)) {
        if (active) setRenderFailed(true)
        return
      }
      setIsRendering(true)
      try {
        const id = `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const { svg } = await mermaid.render(id, mermaidCode)
        if (!active || !containerRef.current) return
        containerRef.current.innerHTML = svg
      } catch {
        if (active) setRenderFailed(true)
      } finally {
        if (active) setIsRendering(false)
      }
    }

    render()

    return () => {
      active = false
      // Clean up any error artifacts when component unmounts or mermaidCode changes
      document.querySelectorAll('[id^="dvalidate-"], [id^="validate-"], [id^="dhistory-"]').forEach((el) => {
        el.remove()
      })
    }
  }, [mermaidCode])

  return (
    <div className="border rounded-md bg-muted/40 p-3">
      {isRendering && <Skeleton className="h-6 w-32 mb-2" />}
      {renderFailed && !isRendering && (
        <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ minHeight: '160px' }}>
          No diagram available
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full overflow-auto"
        style={{ minHeight: '160px', display: renderFailed ? 'none' : 'block' }}
      />
    </div>
  )
}

export function HistoryPage() {
  const { user, accessToken } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    setError(null)
    try {
      ensureMermaid()
      const data = await fetchDiagrams(user.id, accessToken)
      const list = Array.isArray(data) ? data : []
      // Filter out entries with empty/invalid mermaid code
      const validOnly = list.filter((item) => {
        const code = item?.mermaidCode
        // Must have non-empty mermaid code and be valid syntax
        return code && code.trim().length > 0 && isValidMermaid(code)
      })
      setItems(validOnly)
    } catch (err) {
      setError(err.message || 'Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, accessToken])

  useEffect(() => {
    load()
  }, [load])

  // Cleanup any stray Mermaid error artifacts periodically
  useEffect(() => {
    const cleanup = () => {
      document.querySelectorAll('[id^="dvalidate-"], [id^="validate-"], [id^="dhistory-"]').forEach((el) => {
        el.remove()
      })
    }
    
    // Initial cleanup
    cleanup()
    
    // Periodic cleanup every 500ms while component is mounted
    const interval = setInterval(cleanup, 500)
    
    return () => {
      clearInterval(interval)
      cleanup() // Final cleanup on unmount
    }
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (!items.length) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>No history yet</CardTitle>
            <CardDescription>Your generated diagrams will appear here.</CardDescription>
          </CardHeader>
        </Card>
      )
    }

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id || item.diagramId}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base line-clamp-2">{item.prompt}</CardTitle>
                <CardDescription>
                  {new Date(item.createdAt || item.updatedAt).toLocaleString()}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <HistoryDiagram mermaidCode={item.mermaidCode} />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-8 container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">History</h1>
            <p className="text-sm text-muted-foreground">All prompts and generated Mermaid results.</p>
          </div>
          <Button variant="ghost" onClick={load} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

