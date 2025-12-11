import { getMockMermaidResponse } from './mockData'
import mermaid from 'mermaid'

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const AUTH_STORAGE_KEY = 'authSession'
const MAX_RETRIES = 5

// Initialize Mermaid for validation
let mermaidInitialized = false
const initMermaid = () => {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    })
    mermaidInitialized = true
  }
}

/**
 * Validate Mermaid syntax by attempting to render it
 * @param {string} mermaidCode - Mermaid code to validate
 * @returns {Promise<boolean>} True if valid, false if invalid
 */
const validateMermaidSyntax = async (mermaidCode) => {
  if (!mermaidCode || !mermaidCode.trim()) {
    return false
  }

  try {
    initMermaid()
    // Generate a unique ID for validation
    const id = `validate-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    // Try to render - if it fails, syntax is invalid
    await mermaid.render(id, mermaidCode)
    return true
  } catch (error) {
    console.warn('Mermaid syntax validation failed:', error.message)
    return false
  }
}

const buildAuthHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const parseApiResponse = async (response, fallbackMessage) => {
  let data = null
  try {
    data = await response.json()
  } catch (error) {
    // ignore, some endpoints may not return JSON
  }

  if (!response.ok || data?.success === false) {
    const message = data?.message || data?.error || fallbackMessage || 'Request failed'
    const err = new Error(message)
    err.status = response.status
    throw err
  }

  return data ?? {}
}

/**
 * Send prompt to backend API to generate Mermaid syntax
 * Retries up to MAX_RETRIES times if generated syntax is invalid
 * Falls back to mock data if backend is unavailable or USE_MOCK is true
 * 
 * @param {string} prompt - User's text prompt
 * @returns {Promise<{mermaid: string, isMock: boolean, error?: string, retries?: number}>}
 */
export async function generateMermaid(prompt, { type, userId, accessToken } = {}) {
  // If mock mode is explicitly enabled, use mock data
  if (USE_MOCK) {
    console.log('Using mock data (VITE_USE_MOCK=true)')
    return await getMockMermaidResponse(prompt)
  }

  let lastError = null
  let retryCount = 0

  // Retry loop - up to MAX_RETRIES attempts
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const payload = { prompt }
      if (type) payload.type = type
      if (userId) payload.userId = userId

      console.log(`Attempt ${attempt}/${MAX_RETRIES}: Generating Mermaid diagram...`)

      const response = await fetch(`${API_BASE_URL}/api/diagrams/generate`, {
        method: 'POST',
        headers: buildAuthHeaders(accessToken),
        body: JSON.stringify(payload),
      })

      const data = await parseApiResponse(response, 'Backend failed to generate diagram')
      
      // Extract Mermaid code from response
      const mermaidCode = data.mermaid || data.mermaidCode || data.data?.mermaid
      
      if (!mermaidCode) {
        throw new Error('Invalid response format: mermaid code not found')
      }

      // Validate the Mermaid syntax
      const isValid = await validateMermaidSyntax(mermaidCode)
      
      if (isValid) {
        console.log(`✓ Valid Mermaid syntax received on attempt ${attempt}`)
        return {
          mermaid: mermaidCode,
          diagramId: data.data?.diagramId ?? data.diagramId ?? null,
          type: data.data?.type || data.type || type,
          isMock: false,
          retries: attempt - 1,
        }
      } else {
        console.warn(`✗ Invalid Mermaid syntax on attempt ${attempt}, retrying...`)
        retryCount = attempt
        lastError = new Error('Generated Mermaid syntax is invalid')
        
        // If this is not the last attempt, continue to retry
        if (attempt < MAX_RETRIES) {
          // Small delay before retry
          await new Promise(resolve => setTimeout(resolve, 500))
          continue
        }
      }
    } catch (error) {
      const isNetworkError = error.name === 'TypeError'

      if (isNetworkError) {
        // Network error - fallback to mock data
        console.warn('Backend API unavailable, using mock data:', error.message)
        return await getMockMermaidResponse(prompt)
      }

      // Other errors - store and retry if we have attempts left
      lastError = error
      retryCount = attempt
      
      if (attempt < MAX_RETRIES) {
        console.warn(`Error on attempt ${attempt}, retrying...`, error.message)
        await new Promise(resolve => setTimeout(resolve, 500))
        continue
      }
    }
  }

  // If we get here, all retries failed
  throw new Error(
    `Failed to generate valid Mermaid syntax after ${MAX_RETRIES} attempts. ${lastError?.message || 'Unknown error'}`
  )
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email, password }),
  })

  const data = await parseApiResponse(response, 'Failed to log in')
  const payload = data.data ?? data

  return {
    user: payload.user,
    accessToken: payload.accessToken,
  }
}

export async function signupUser({ email, password, name }) {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email, password, name }),
  })

  const data = await parseApiResponse(response, 'Failed to create account')
  const payload = data.data ?? data

  return {
    user: payload.user,
    accessToken: payload.accessToken,
  }
}

export async function logoutUser(accessToken) {
  if (!accessToken) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: buildAuthHeaders(accessToken),
    })

    await parseApiResponse(response, 'Failed to logout')
  } catch (error) {
    // Logout failures shouldn't block the client from clearing its own session
    console.warn('Logout request failed:', error.message)
  }
}

/**
 * Check if backend is available
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export const authStorage = {
  save(data) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  },
  load() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  clear() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  },
}

