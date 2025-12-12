// API Client Wrapper
// The backend developer should configure the baseURL here.

export const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://2c8186ee0c04.ngrok-free.app/api/v1/"















export async function apiClient(endpoint, { method = "GET", body, headers = {} } = {}) {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Request Failed:", error)
    throw error
  }
}
