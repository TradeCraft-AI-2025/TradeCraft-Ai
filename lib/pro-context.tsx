"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

type ProContextType = {
  isPro: boolean
  setIsPro: (value: boolean) => void
  checkProStatus: () => boolean
}

const ProContext = createContext<ProContextType | undefined>(undefined)

export function ProProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const { user } = useAuth()

  // Check if user is Pro on mount and when user changes
  useEffect(() => {
    const checkStatus = () => {
      try {
        // First check localStorage
        const localStatus = localStorage.getItem("subscribed") === "true"

        // Then check user object from auth context if available
        const userStatus =
          user &&
          (user.subscriptionStatus === "active" ||
            user.subscriptionStatus === "lifetime" ||
            (user.subscriptionExpires && new Date(user.subscriptionExpires) > new Date()))

        // Use either source of truth
        const finalStatus = localStatus || !!userStatus

        // Update state
        setIsPro(finalStatus)

        // Sync localStorage with our determination
        if (finalStatus) {
          localStorage.setItem("subscribed", "true")
        }

        return finalStatus
      } catch (error) {
        console.error("Error checking Pro status:", error)
        return false
      }
    }

    checkStatus()

    // Add event listener for storage changes (in case another tab updates subscription)
    const handleStorageChange = () => {
      checkStatus()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [user])

  const checkProStatus = () => {
    try {
      return isPro || localStorage.getItem("subscribed") === "true"
    } catch (error) {
      console.error("Error checking Pro status:", error)
      return false
    }
  }

  return <ProContext.Provider value={{ isPro, setIsPro, checkProStatus }}>{children}</ProContext.Provider>
}

export function usePro() {
  const context = useContext(ProContext)
  if (context === undefined) {
    throw new Error("usePro must be used within a ProProvider")
  }
  return context
}
