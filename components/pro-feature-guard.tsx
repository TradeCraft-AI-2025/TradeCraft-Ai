"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { useState } from "react"
import { ProSubscriptionModal } from "./pro-subscription-modal"

interface ProFeatureGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProFeatureGuard({ children, fallback }: ProFeatureGuardProps) {
  const { isPro, isLoading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (isPro) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      <Card className="bg-black/40 border-[#5EEAD4]/30 max-w-md mx-auto my-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5 text-[#5EEAD4]" />
            Pro Feature
          </CardTitle>
          <CardDescription>This feature is available exclusively to TradeCraft AI Pro subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to Pro to access advanced trading tools, AI-powered insights, and personalized strategy
            recommendations.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsModalOpen(true)} className="w-full bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
            Upgrade to Pro
          </Button>
        </CardFooter>
      </Card>

      <ProSubscriptionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
