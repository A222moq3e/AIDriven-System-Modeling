import { Button } from './ui/button'

/**
 * Navbar component
 */
export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">AI System Modeling Generator</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button variant="default" size="sm">
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  )
}

