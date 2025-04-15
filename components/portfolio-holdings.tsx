"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, RefreshCw, Trash2, Wallet } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ManualHolding } from "./empty-portfolio-state"

interface PortfolioHoldingsProps {
  holdings: ManualHolding[]
  onAddHolding: () => void
  onDeleteHolding: (symbol: string) => void
  onConnectBroker: () => void
  connectedBroker: string | null
}

export function PortfolioHoldings({
  holdings,
  onAddHolding,
  onDeleteHolding,
  onConnectBroker,
  connectedBroker,
}: PortfolioHoldingsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.value || 0), 0)

  const refreshPrices = async () => {
    setIsRefreshing(true)

    try {
      // This would be replaced with a more efficient batch update in a real app
      toast({
        title: "Refreshing prices",
        description: "Fetching latest market data...",
      })

      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Prices updated",
        description: "Latest market data has been loaded.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Unable to refresh prices. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white flex items-center">
            Your Portfolio
            {connectedBroker && (
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                {connectedBroker} Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {holdings.length} holdings • Total value: ${totalValue.toLocaleString()}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshPrices} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onAddHolding}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holdings.map((holding) => (
            <div key={holding.symbol} className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="text-sm text-slate-300 font-medium">{holding.symbol}</div>
                  <div className="text-xs text-slate-500 ml-2">{holding.name}</div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    (holding.change || 0) > 0
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  } text-xs`}
                >
                  {(holding.change || 0) > 0 ? "+" : ""}
                  {(holding.change || 0).toFixed(2)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-500">
                  {holding.shares} shares @ ${holding.costBasis.toFixed(2)}
                </div>
                <div className="text-sm font-medium text-slate-200">
                  ${(holding.value || holding.shares * holding.costBasis).toLocaleString()}
                </div>
              </div>
              <Progress value={((holding.value || 0) / totalValue) * 100} className="h-1.5 bg-slate-700">
                <div
                  className={`h-full rounded-full ${(holding.change || 0) > 0 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${((holding.value || 0) / totalValue) * 100}%` }}
                />
              </Progress>
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                  onClick={() => onDeleteHolding(holding.symbol)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {!connectedBroker && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <Button onClick={onConnectBroker} className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Brokerage Account
              </Button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Connect your brokerage account to automatically import your holdings
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
