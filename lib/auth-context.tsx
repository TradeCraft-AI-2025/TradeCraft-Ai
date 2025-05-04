"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./db-types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isPro: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  updateUserProfile: (profileData: any) => Promise<void>
  updateSubscriptionStatus: (isSubscribed: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error loading user:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Check if user has pro access
  const isPro = Boolean(
    user &&
      (user.subscriptionStatus === "active" ||
        user.subscriptionStatus === "lifetime" ||
        (user.subscriptionExpires && new Date(user.subscriptionExpires) > new Date())),
  )

  // Sync subscription status with localStorage on mount and when isPro changes
  useEffect(() => {
    try {
      // If user is logged in and has pro access, set localStorage
      if (user && isPro) {
        localStorage.setItem("subscribed", "true")
      }

      // If user is logged in but doesn't have pro access, check localStorage
      // to see if we need to clear it (only if user is logged in to avoid clearing during loading)
      else if (user && !isPro && localStorage.getItem("subscribed") === "true") {
        // Only clear if we're sure the user doesn't have pro access
        localStorage.removeItem("subscribed")
      }
    } catch (error) {
      console.error("Error syncing subscription status:", error)
    }
  }, [user, isPro])

  // Auth functions
  async function login(email: string, password: string) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const userData = await response.json()
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      // Clear subscription status on logout
      localStorage.removeItem("subscribed")
    } finally {
      setIsLoading(false)
    }
  }

  async function signup(email: string, password: string, name?: string) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error("Signup failed")
      }

      const userData = await response.json()
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateUserProfile(profileData: any) {
    if (!user) return

    // In a real app, this would call an API endpoint
    // For now, we'll just update the local state
    setUser({
      ...user,
      ...profileData,
    })

    // Store in localStorage for demo purposes
    localStorage.setItem(
      "user-profile",
      JSON.stringify({
        ...user,
        ...profileData,
      }),
    )

    return Promise.resolve()
  }

  // Function to update subscription status
  function updateSubscriptionStatus(isSubscribed: boolean) {
    try {
      if (isSubscribed) {
        localStorage.setItem("subscribed", "true")
      } else {
        localStorage.removeItem("subscribed")
      }

      // If we have a user, update their subscription status
      if (user) {
        setUser({
          ...user,
          subscriptionStatus: isSubscribed ? "active" : "inactive",
        })
      }
    } catch (error) {
      console.error("Error updating subscription status:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isPro,
        login,
        logout,
        signup,
        updateUserProfile,
        updateSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
