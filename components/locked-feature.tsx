"use client"

import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { ReactNode } from "react"

interface LockedFeatureProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function LockedFeature({
  children,
  title = "Pro Feature",
  description = "Upgrade to Pro to unlock this feature",
  className = "",
}: LockedFeatureProps) {
  const router = useRouter()
  const { isPro } = useAuth()

  // If user is already Pro, just render the children
  if (isPro) {
    return <>{children}</>
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border border-[#5EEAD4]/20 ${className}`}>
      {/* Blurred preview of the content */}
      <div className="filter blur-sm opacity-50 pointer-events-none">{children}</div>

      {/* Overlay with lock icon and button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
        <div className="bg-black/40 p-3 rounded-full mb-3 border border-[#5EEAD4]/30">
          <Lock className="h-6 w-6 text-[#5EEAD4]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-300 mb-4 max-w-xs">{description}</p>
        <Button
          onClick={() => router.push("/pricing")}
          className="bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] hover:opacity-90 text-black font-medium"
        >
          Unlock Pro
        </Button>
      </div>
    </div>
  )
}
