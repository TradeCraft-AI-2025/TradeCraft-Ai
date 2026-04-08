"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowLeft, Download, RefreshCw, Plus, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { PortfolioHolding } from "@/lib/types"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import { fetchStockQuote } from "@/lib/finnhub-api"
import { AddPositionForm } from "@/components/add-position-form"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [totalPL, setTotalPL] = useState({ value: 0, percent: 0 })
  const { toast } = useToast()

  const refreshQuotes = useCallback(async (holdings: PortfolioHolding[]) => {
    if (holdings.length === 0) return holdings

    return Promise.all(
      holdings.map(async (h) => {
        try {
          const quote = await fetchStockQuote(h.symbol)
          const currentPrice = quote.c
          const totalCost = h.quantity * h.costBasis
          const currentValue = h.quantity * currentPrice
          const unrealizedPL = currentValue - totalCost
          const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0
          return { ...h, currentPrice, unrealizedPL, unrealizedPLPercent, dayChangePercent: quote.dp || 0 }
        } catch {
          return { ...h, currentPrice: h.currentPrice || h.costBasis, unrealizedPL: h.unrealizedPL || 0, unrealizedPLPercent: h.unrealizedPLPercent || 0, dayChangePercent: h.dayChangePercent || 0 }
        }
      })
    )
  }, [])

  const saveToSupabase = useCallback(async (holdings: PortfolioHolding[]) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("portfolios").upsert(
          { user_id: user.id, holdings, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        )
      }
    } catch (err) {
      console.error("Failed to save portfolio to Supabase:", err)
    }
  }, [])

  const recalcPL = useCallback((holdings: PortfolioHolding[]) => {
    const totalCost = holdings.reduce((sum, h) => sum + h.quantity * h.costBasis, 0)
    const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (h.currentPrice || h.costBasis), 0)
    const plValue = totalValue - totalCost
    setTotalPL({ value: plValue, percent: totalCost > 0 ? (plValue / totalCost) * 100 : 0 })
  }, [])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const supabase = createBrowserSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setIsLoading(false); return }

        const { data } = await supabase
          .from("portfolios")
          .select("holdings")
          .eq("user_id", user.id)
          .single()

        if (data?.holdings && (data.holdings as PortfolioHolding[]).length > 0) {
          const saved = data.holdings as PortfolioHolding[]
          const refreshed = await refreshQuotes(saved)
          setPortfolio(refreshed)
          setLastUpdated(new Date())
          recalcPL(refreshed)
          await saveToSupabase(refreshed)
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshQuotes, saveToSupabase, recalcPL])

  const handleRefresh = async () => {
    if (portfolio.length === 0) return
    setIsLoading(true)
    setError(null)
    try {
      const refreshed = await refreshQuotes(portfolio)
      setPortfolio(refreshed)
      setLastUpdated(new Date())
      recalcPL(refreshed)
      await saveToSupabase(refreshed)
      toast({ title: "Portfolio refreshed", description: "Market prices updated." })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to refresh"))
      toast({ title: "Error refreshing", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPosition = async (symbol: string, quantity: number, costBasis: number) => {
    const newHolding: PortfolioHolding = {
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(),
      quantity,
      costBasis,
      currentPrice: costBasis,
      unrealizedPL: 0,
      unrealizedPLPercent: 0,
      dayChangePercent: 0,
    }

    try {
      const quote = await fetchStockQuote(newHolding.symbol)
      newHolding.currentPrice = quote.c
      const totalCost = quantity * costBasis
      const currentValue = quantity * quote.c
      newHolding.unrealizedPL = currentValue - totalCost
      newHolding.unrealizedPLPercent = totalCost > 0 ? (newHolding.unrealizedPL / totalCost) * 100 : 0
      newHolding.dayChangePercent = quote.dp || 0
    } catch {
      // keep cost-basis defaults
    }

    const updated = [...portfolio, newHolding]
    setPortfolio(updated)
    recalcPL(updated)
    setShowAddForm(false)
    await saveToSupabase(updated)
    toast({ title: "Position added", description: `Added ${quantity} shares of ${symbol.toUpperCase()}.` })
  }

  const handleRemovePosition = async (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index)
    setPortfolio(updated)
    recalcPL(updated)
    await saveToSupabase(updated)
    toast({ title: "Position removed", description: "The position has been removed." })
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <ErrorBoundary onReset={handleRefresh}>
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Unable to load portfolio data</h2>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl relative">
      {isLoading && <LoadingSpinner text="Loading portfolio..." />}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Your Portfolio</h1>
          </div>
          <p className="text-muted-foreground">
            View and analyze your investments
            {lastUpdated && <span className="text-xs ml-2">• Last updated: {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading || portfolio.length === 0}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <ErrorBoundary>
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>
                Your current portfolio holdings and performance
                {lastUpdated && <span className="text-xs ml-2">• Market data as of {lastUpdated.toLocaleTimeString()}</span>}
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm" className="h-8 gap-1">
              {showAddForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Position</>}
            </Button>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <div className="mb-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                <h3 className="text-sm font-medium mb-3">Add New Position</h3>
                <AddPositionForm onSubmit={handleAddPosition} onCancel={() => setShowAddForm(false)} />
              </div>
            )}

            {portfolio.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="text-left py-3 px-2">Symbol</th>
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-right py-3 px-2">Qty</th>
                      <th className="text-right py-3 px-2">Price</th>
                      <th className="text-right py-3 px-2">P/L</th>
                      <th className="text-right py-3 px-2">Day</th>
                      <th className="py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((h, i) => (
                      <tr key={h.symbol + i} className="border-b border-slate-800">
                        <td className="py-3 px-2 font-medium">{h.symbol}</td>
                        <td className="py-3 px-2 text-slate-400">{h.name}</td>
                        <td className="py-3 px-2 text-right">{h.quantity}</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(h.currentPrice)}</td>
                        <td className={`py-3 px-2 text-right ${h.unrealizedPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(h.unrealizedPL)} ({h.unrealizedPLPercent >= 0 ? "+" : ""}{h.unrealizedPLPercent.toFixed(2)}%)
                        </td>
                        <td className={`py-3 px-2 text-right ${h.dayChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {h.dayChangePercent >= 0 ? "+" : ""}{h.dayChangePercent.toFixed(2)}%
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400" onClick={() => handleRemovePosition(i)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-2">No holdings yet</p>
                  <p className="text-sm text-slate-500 mb-4">Add positions to start tracking your portfolio.</p>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add your first position
                  </Button>
                </div>
              )
            )}

            {portfolio.length > 0 && (
              <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Total Portfolio P/L</h3>
                    <p className="text-xs text-slate-400">Overall performance</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center">
                    <div className={`text-xl font-bold ${totalPL.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(totalPL.value)}
                    </div>
                    <div className={`ml-2 text-sm ${totalPL.percent >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ({totalPL.percent >= 0 ? "+" : ""}{totalPL.percent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </ErrorBoundary>
    </div>
  )
}
