import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useAuth } from '../contexts/AuthContext'
import { CheckCircle2, Eye, EyeOff, Sparkles, Workflow } from 'lucide-react'

const highlights = [
  'Secure, private sessions for your diagrams',
  'Export to PNG or SVG instantly',
  'Version history to revisit your ideas',
]

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success) {
        navigate('/app')
      } else {
        setError(result.error || 'Invalid email or password')
      }
    } catch (err) {
      setError(err.message || 'Unable to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 flex flex-col gap-12">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-sm font-medium shadow-sm hover:border-accent/60 hover:text-foreground transition-colors"
          >
            <Workflow className="h-4 w-4 text-accent" />
            AI System Modeling Generator
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/signup')}>
            Create account
          </Button>
        </header>

        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              Welcome back
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Sign in and keep generating diagrams.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Access your saved prompts, regenerate diagrams, and export production-ready visuals in seconds.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full border-border/80 bg-card/70 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your credentials to access your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">New here?</div>
                <Button variant="link" className="p-0 h-auto font-semibold" onClick={() => navigate('/signup')}>
                  Create an account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
