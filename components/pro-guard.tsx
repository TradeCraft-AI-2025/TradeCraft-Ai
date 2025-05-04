"use client"

import { useEffect, useState, type ReactNode } from "react"
import { UnlockBanner } from "./unlock-banner"
import { usePro } from "@/lib/pro-context"

interface ProGuardProps {
  children: ReactNode
  invert?: boolean // If true, show children when NOT pro
}

export function ProGuard({ children, invert = false }: ProGuardProps) {
  const { isPro } = usePro()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null
  }

  // If invert is true, show children when NOT pro
  if (invert) {
    return isPro ? null : <>{children}</>
  }

  // Normal case: show children when pro, otherwise show UnlockBanner
  return isPro ? <>{children}</> : <UnlockBanner />
}
