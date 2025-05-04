"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export function UnlockBanner() {
  const router = useRouter()

  return (
    <Card className="border border-[#5EEAD4]/20 bg-black/40 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#5EEAD4]/10 p-3 rounded-full mb-4 border border-[#5EEAD4]/30">
          <Lock className="h-6 w-6 text-[#5EEAD4]" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Pro Feature</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Upgrade to TradeCraft AI Pro to unlock this feature and get access to advanced trading tools.
        </p>
        <Button
          onClick={() => router.push("/pricing")}
          className="bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] hover:opacity-90 text-black font-medium"
        >
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  )
}
