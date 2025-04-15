import type { AuthState } from "./types"

// Mock authentication state
let authState: AuthState = {
  authenticated: false,
  broker: null,
  token: null,
}

/**
 * Mock function to authenticate with a broker
 */
export async function mockAuthWithBroker(provider: string): Promise<AuthState> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock successful authentication
  authState = {
    authenticated: true,
    broker: provider === "robinhood" ? "Robinhood" : "Webull",
    token: `mock-token-${Date.now()}`,
  }

  // Store auth state in localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("authState", JSON.stringify(authState))
  }

  return authState
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<AuthState> {
  // Check localStorage first
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("authState")
    if (storedAuth) {
      authState = JSON.parse(storedAuth)
    }
  }

  return authState
}

/**
 * Mock function to log out
 */
export async function logout(): Promise<void> {
  authState = {
    authenticated: false,
    broker: null,
    token: null,
  }

  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("authState")
  }
}
