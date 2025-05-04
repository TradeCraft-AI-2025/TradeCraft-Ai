"use client"

import { usePro } from "@/lib/pro-context"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"

export function SubscriptionStatus() {
  const { isPro } = usePro()

  if (!isPro) return null

  return (
    <Badge variant="outline" className="bg-gradient-to-r from-amber-500 to-amber-300 text-black border-none">
      <Crown className="h-3 w-3 mr-1" />
      <span className="font-medium">PRO</span>
    </Badge>
  )
}
