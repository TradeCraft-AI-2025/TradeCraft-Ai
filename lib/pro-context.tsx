"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface ProContextType {
  isPro: boolean
  loading: boolean
  checkSubscription: () => Promise<void>
}

const ProContext = createContext<ProContextType>({
  isPro: false,
  loading: true,
  checkSubscription: async () => {},
})

export const usePro = () => useContext(ProContext)

interface ProProviderProps {
  children: ReactNode
}

export function ProProvider({ children }: ProProviderProps) {
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkSubscription = async () => {
    try {
      setLoading(true)

      // First check localStorage for cached status
      const cachedStatus = localStorage.getItem("subscribed")
      if (cachedStatus === "true") {
        setIsPro(true)
      }

      // Then verify with the server
      const response = await fetch("/api/user/status")

      if (response.ok) {
        const data = await response.json()
        setIsPro(data.isPro)

        // Update localStorage to match server state
        localStorage.setItem("subscribed", data.isPro ? "true" : "false")
      } else if (response.status === 401) {
        // User is not logged in
        setIsPro(false)
        localStorage.removeItem("subscribed")
      }
    } catch (error) {
      console.error("Error checking subscription status:", error)
      // On error, fall back to localStorage if available
      const fallback = localStorage.getItem("subscribed") === "true"
      setIsPro(fallback)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check subscription status on mount
    checkSubscription()

    // Set up interval to periodically check (every 5 minutes)
    const interval = setInterval(checkSubscription, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return <ProContext.Provider value={{ isPro, loading, checkSubscription }}>{children}</ProContext.Provider>
}
