import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { authStorage, loginUser, logoutUser, signupUser } from '../services/api'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(initialState)

  // Rehydrate session on mount
  useEffect(() => {
    const stored = authStorage.load()
    if (stored?.accessToken && stored?.user) {
      setAuthState({
        user: stored.user,
        accessToken: stored.accessToken,
        isAuthenticated: true,
      })
    }
  }, [])

  // Persist whenever session changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      authStorage.save({
        user: authState.user,
        accessToken: authState.accessToken,
      })
    } else {
      authStorage.clear()
    }
  }, [authState])

  const login = useCallback(async (email, password) => {
    try {
      const { user, accessToken } = await loginUser({ email, password })
      setAuthState({ user, accessToken, isAuthenticated: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Unable to login' }
    }
  }, [])

  const signup = useCallback(async (email, password, name) => {
    try {
      const { user, accessToken } = await signupUser({ email, password, name })
      setAuthState({ user, accessToken, isAuthenticated: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message || 'Unable to sign up' }
    }
  }, [])

  const logout = useCallback(async () => {
    if (authState.accessToken) {
      await logoutUser(authState.accessToken)
    }
    setAuthState(initialState)
  }, [authState.accessToken])

  const value = useMemo(() => ({
    user: authState.user,
    accessToken: authState.accessToken,
    isAuthenticated: authState.isAuthenticated,
    login,
    signup,
    logout,
  }), [authState, login, signup, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

