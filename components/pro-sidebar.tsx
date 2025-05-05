"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, LineChart, Lock, ChevronUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { DashboardCard } from "@/components/ui/dashboard-card"

export function ProSidebar() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="hidden md:block sticky top-24 self-start">
        <DashboardCard
          className="border border-[#5EEAD4]/20 overflow-hidden"
          gradient
          title="Upgrade to TradeCraft Pro"
          headerClassName="pb-2"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5EEAD4] to-[#FACC15]" />
          <Badge className="w-fit bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/30 mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Pro Features
          </Badge>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Zap className="h-4 w-4 text-[#5EEAD4] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Advanced Analytics</p>
                  <p className="text-xs text-muted-foreground">Deep insights into market trends</p>
                </div>
              </div>
              <div className="flex items-start">
                <LineChart className="h-4 w-4 text-[#5EEAD4] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">AI Strategy Builder</p>
                  <p className="text-xs text-muted-foreground">Create custom trading strategies</p>
                </div>
              </div>
              <div className="flex items-start">
                <Lock className="h-4 w-4 text-[#5EEAD4] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Premium Data Access</p>
                  <p className="text-xs text-muted-foreground">Real-time market data and insights</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => router.push("/pricing")}
              className="w-full bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] hover:opacity-90 text-black font-medium"
            >
              Upgrade to Pro
            </Button>
          </div>
        </DashboardCard>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-t border-slate-800">
        <div className="container mx-auto">
          <div className={cn("transition-all duration-300", isCollapsed ? "max-h-16" : "max-h-96")}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <div className="flex items-center">
                <Badge className="bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/30 mr-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
                <span className="text-sm font-medium">Unlock Premium Features</span>
              </div>
              <ChevronUp className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "rotate-0")} />
            </div>

            {!isCollapsed && (
              <div className="px-4 pb-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Zap className="h-4 w-4 text-[#5EEAD4] mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Advanced Analytics</p>
                      <p className="text-xs text-muted-foreground">Deep insights into market trends</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <LineChart className="h-4 w-4 text-[#5EEAD4] mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">AI Strategy Builder</p>
                      <p className="text-xs text-muted-foreground">Create custom trading strategies</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/pricing")}
                  className="w-full bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] hover:opacity-90 text-black font-medium"
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
