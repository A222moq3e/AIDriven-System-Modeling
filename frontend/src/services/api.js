import { getMockMermaidResponse } from './mockData'

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * Send prompt to backend API to generate Mermaid syntax
 * Falls back to mock data if backend is unavailable or USE_MOCK is true
 * 
 * @param {string} prompt - User's text prompt
 * @returns {Promise<{mermaid: string, isMock: boolean, error?: string}>}
 */
export async function generateMermaid(prompt, { type, userId } = {}) {
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data && data.success === false) {
      throw new Error(data.message || 'Backend failed to generate diagram')
    }
    
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

