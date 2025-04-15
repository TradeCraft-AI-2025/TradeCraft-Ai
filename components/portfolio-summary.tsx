"use client"

import { ArrowDown, ArrowUp, DollarSign, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioHolding } from "@/lib/types"

interface PortfolioSummaryProps {
  portfolio: PortfolioHolding[]
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  // Calculate total portfolio value
  const totalValue = portfolio.reduce((sum, holding) => {
    return sum + holding.quantity * holding.currentPrice
  }, 0)

  // Calculate total unrealized P/L
  const totalPL = portfolio.reduce((sum, holding) => {
    return sum + holding.unrealizedPL
  }, 0)

  // Calculate total P/L percentage (weighted average)
  const totalCost = totalValue - totalPL
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0

  // Calculate day change
  const dayChange = portfolio.reduce((sum, holding) => {
    return sum + (holding.quantity * holding.currentPrice * holding.dayChangePercent) / 100
  }, 0)

  const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{portfolio.length} holdings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Unrealized P/L</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold flex items-center ${totalPL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPL >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}$
            {Math.abs(totalPL).toFixed(2)}
          </div>
          <p className={`text-xs ${totalPLPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPLPercent >= 0 ? "+" : ""}
            {totalPLPercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold flex items-center ${dayChange >= 0 ? "text-green-600" : "text-red-600"}`}>
            {dayChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}$
            {Math.abs(dayChange).toFixed(2)}
          </div>
          <p className={`text-xs ${dayChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
            {dayChangePercent >= 0 ? "+" : ""}
            {dayChangePercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
    </>
  )
}
