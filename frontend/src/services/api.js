import { getMockMermaidResponse } from './mockData'

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const AUTH_STORAGE_KEY = 'authSession'

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
 * Falls back to mock data if backend is unavailable or USE_MOCK is true
 * 
 * @param {string} prompt - User's text prompt
 * @returns {Promise<{mermaid: string, isMock: boolean, error?: string}>}
 */
export async function generateMermaid(prompt, { type, userId, accessToken } = {}) {
  // If mock mode is explicitly enabled, use mock data
  if (USE_MOCK) {
    console.log('Using mock data (VITE_USE_MOCK=true)')
    return await getMockMermaidResponse(prompt)
  }

  // Try to call the backend API
  try {
    const payload = { prompt }
    if (type) payload.type = type
    if (userId) payload.userId = userId

    const response = await fetch(`${API_BASE_URL}/api/diagrams/generate`, {
      method: 'POST',
      headers: buildAuthHeaders(accessToken),
      body: JSON.stringify(payload),
    })

    const data = await parseApiResponse(response, 'Backend failed to generate diagram')
    
    // Extract Mermaid code from response
    // Backend should return: { mermaid: "...", ... } or { mermaidCode: "...", ... }
    const mermaidCode = data.mermaid || data.mermaidCode || data.data?.mermaid
    
    if (!mermaidCode) {
      throw new Error('Invalid response format: mermaid code not found')
    }

    return {
      mermaid: mermaidCode,
      diagramId: data.data?.diagramId ?? data.diagramId ?? null,
      type: data.data?.type || data.type || type,
      isMock: false,
    }
  } catch (error) {
    const isNetworkError = error.name === 'TypeError'

    if (!isNetworkError) {
      throw error
    }

    // If backend is unavailable (network failure), fallback to mock data
    console.warn('Backend API unavailable, using mock data:', error.message)
    return await getMockMermaidResponse(prompt)
  }
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

