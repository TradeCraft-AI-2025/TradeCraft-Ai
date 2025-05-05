"use client"

import { usePro } from "@/lib/pro-context"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export function SubscriptionStatus() {
  const { isPro, loading } = usePro()

  if (loading) {
    return null
  }

  if (!isPro) {
    return (
      <Badge variant="outline" className="ml-2">
        Free
      </Badge>
    )
  }

  return (
    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 ml-2">
      <Sparkles className="h-3 w-3 mr-1" />
      Pro
    </Badge>
  )
}
