import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'

/**
 * Navbar component
 */
export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">AI Mermaid Generator</h1>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

