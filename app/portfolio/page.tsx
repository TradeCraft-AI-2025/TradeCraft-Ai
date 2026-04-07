"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

const basePortfolioData: Omit<
  PortfolioHolding,
  "currentPrice" | "unrealizedPL" | "unrealizedPLPercent" | "dayChangePercent"
>[] = [
  { symbol: "AAPL", name: "Apple Inc.", quantity: 10, costBasis: 150.25 },
  { symbol: "MSFT", name: "Microsoft Corporation", quantity: 5, costBasis: 290.5 },
  { symbol: "GOOGL", name: "Alphabet Inc.", quantity: 8, costBasis: 135.2 },
  { symbol: "AMZN", name: "Amazon.com Inc.", quantity: 12, costBasis: 145.3 },
  { symbol: "TSLA", name: "Tesla, Inc.", quantity: 15, costBasis: 190.25 },
]

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [basePortfolio, setBasePortfolio] = useState(basePortfolioData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [totalPL, setTotalPL] = useState({ value: 0, percent: 0 })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadPortfolioData()
  }, [])

  useEffect(() => {
    if (basePortfolio.length > 0) {
      loadPortfolioData()
    }
  }, [basePortfolio])

  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("portfolios")
          .select("holdings")
          .eq("user_id", user.id)
          .single()

        if (error || !data) return
        setPortfolio(data.holdings as PortfolioHolding[])
        setShowAddForm(false)
      } catch (err) {
        console.error("Failed to load portfolio from Supabase:", err)
      }
    }
    loadFromSupabase()
  }, [])

  const loadPortfolioData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedPortfolio = await Promise.all(
        basePortfolio.map(async (holding) => {
          try {
            const quote = await fetchStockQuote(holding.symbol)
            const currentPrice = quote.c
            const totalCost = holding.quantity * holding.costBasis
            const currentValue = holding.quantity * currentPrice
            const unrealizedPL = currentValue - totalCost
            const unrealizedPLPercent = (unrealizedPL / totalCost) * 100

            return {
              ...holding,
              currentPrice,
              unrealizedPL,
              unrealizedPLPercent,
              dayChangePercent: quote.dp || 0,
            }
          } catch (err) {
            console.error(`Error fetching data for ${holding.symbol}:`, err)
            return {
              ...holding,
              currentPrice: holding.costBasis,
              unrealizedPL: 0,
              unrealizedPLPercent: 0,
              dayChangePercent: 0,
            }
          }
        }),
      )

      setPortfolio(updatedPortfolio)
      setLastUpdated(new Date())

      try {
        const supabase = createBrowserSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from("portfolios").upsert(
            {
              user_id: user.id,
              holdings: updatedPortfolio,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          )
        }
      } catch (err) {
        console.error("Failed to save portfolio to Supabase:", err)
      }

      const totalCost = updatedPortfolio.reduce((sum, h) => sum + h.quantity * h.costBasis, 0)
      const totalValue = updatedPortfolio.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0)
      const plValue = totalValue - totalCost
      const plPercent = totalCost > 0 ? (plValue / totalCost) * 100 : 0
      setTotalPL({ value: plValue, percent: plPercent })
    } catch (err) {
      console.error("Error loading portfolio data:", err)
      setError(err instanceof Error ? err : new Error("Failed to load portfolio data"))
      toast({
        title: "Error loading portfolio",
        description: "There was an error loading your portfolio data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadPortfolioData()
    toast({
      title: "Portfolio refreshed",
      description: "Your portfolio data has been updated with the latest market prices.",
    })
  }

  const handleAddPosition = async (symbol: string, quantity: number, costBasis: number) => {
    try {
      const newPosition = {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        quantity,
        costBasis,
      }
      setBasePortfolio((prev) => [...prev, newPosition])
      setShowAddForm(false)
      toast({
        title: "Position added",
        description: `Added ${quantity} shares of ${symbol.toUpperCase()} to your portfolio.`,
      })
    } catch (err) {
      console.error("Error adding position:", err)
      toast({
        title: "Error adding position",
        description: "There was an error adding the position to your portfolio.",
        variant: "destructive",
      })
    }
  }

  const handleRemovePosition = (index: number) => {
    setBasePortfolio((prev) => prev.filter((_, i) => i !== index))
    toast({
      title: "Position removed",
      description: "The position has been removed from your portfolio.",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        <ErrorBoundary onReset={loadPortfolioData}>
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-4">Unable to load portfolio data</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || "There was an error fetching your portfolio data from the market API."}
            </p>
            <Button onClick={loadPortfolioData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </ErrorBoundary>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl relative">
      {isLoading && <LoadingSpinner text="Fetching latest market data..." />}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
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
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
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
                {lastUpdated && (
                  <span className="text-xs ml-2">• Market data as of {lastUpdated.toLocaleTimeString()}</span>
                )}
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="outline" size="sm" className="h-8 gap-1">
              {showAddForm ? (
                <>
                  <X className="h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add Position
                </>
              )}
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
                      <tr key={h.symbol} className="border-b border-slate-800">
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
              !isLoading && <p className="text-center text-slate-500 py-8">No holdings yet. Add a position to get started.</p>
            )}

            {portfolio.length > 0 && (
              <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Total Portfolio P/L</h3>
                    <p className="text-xs text-slate-400">Summary of your portfolio&apos;s overall performance</p>
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
