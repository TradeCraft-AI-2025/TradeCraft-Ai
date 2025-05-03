"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, RefreshCw, Plus, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { useToast } from "@/components/ui/use-toast"
import type { PortfolioHolding } from "@/lib/types"
import { isAuthenticated } from "@/lib/auth"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import { fetchStockQuote } from "@/lib/finnhub-api"
import { AddPositionForm } from "@/components/add-position-form"

// Base portfolio data (without real-time prices)
const basePortfolioData: Omit<
  PortfolioHolding,
  "currentPrice" | "unrealizedPL" | "unrealizedPLPercent" | "dayChangePercent"
>[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 10,
    costBasis: 150.25,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    quantity: 5,
    costBasis: 290.5,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    quantity: 8,
    costBasis: 135.2,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    quantity: 12,
    costBasis: 145.3,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    quantity: 15,
    costBasis: 190.25,
  },
]

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [basePortfolio, setBasePortfolio] = useState(basePortfolioData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [totalPL, setTotalPL] = useState({ value: 0, percent: 0 })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated()
      if (!auth.authenticated) {
        router.push("/")
        return
      }

      setConnectedBroker(auth.broker)
      loadPortfolioData()
    }

    checkAuth()
  }, [router])

  // Load portfolio data whenever the base portfolio changes
  useEffect(() => {
    if (basePortfolio.length > 0) {
      loadPortfolioData()
    }
  }, [basePortfolio])

  const loadPortfolioData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch real-time quotes for each stock in the portfolio
      const updatedPortfolio = await Promise.all(
        basePortfolio.map(async (holding) => {
          try {
            const quote = await fetchStockQuote(holding.symbol)

            // Calculate unrealized P&L
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
            // Return holding with estimated values if API fails
            return {
              ...holding,
              currentPrice: holding.costBasis, // Use cost basis as fallback
              unrealizedPL: 0,
              unrealizedPLPercent: 0,
              dayChangePercent: 0,
            }
          }
        }),
      )

      setPortfolio(updatedPortfolio)
      setLastUpdated(new Date())

      // Calculate total P/L
      const totalCost = updatedPortfolio.reduce((sum, holding) => sum + holding.quantity * holding.costBasis, 0)
      const totalValue = updatedPortfolio.reduce((sum, holding) => sum + holding.quantity * holding.currentPrice, 0)
      const plValue = totalValue - totalCost
      const plPercent = totalCost > 0 ? (plValue / totalCost) * 100 : 0

      setTotalPL({
        value: plValue,
        percent: plPercent,
      })
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
      // Try to get the company name from the API
      let name = symbol
      try {
        const quote = await fetchStockQuote(symbol)
        // In a real app, you would fetch the company name from an API
        // For now, we'll just use the symbol as the name
        name = symbol
      } catch (err) {
        console.error(`Error fetching data for ${symbol}:`, err)
      }

      // Add the new position to the base portfolio
      const newPosition = {
        symbol: symbol.toUpperCase(),
        name,
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

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
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
            {connectedBroker ? `Connected to ${connectedBroker}` : "View and analyze your investments"}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PortfolioSummary portfolio={portfolio} />
        </div>

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

            <PortfolioTable portfolio={portfolio} isLoading={isLoading} onRemovePosition={handleRemovePosition} />

            {/* P/L Summary */}
            {portfolio.length > 0 && (
              <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Total Portfolio P/L</h3>
                    <p className="text-xs text-slate-400">Summary of your portfolio's overall performance</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center">
                    <div className={`text-xl font-bold ${totalPL.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(totalPL.value)}
                    </div>
                    <div className={`ml-2 text-sm ${totalPL.percent >= 0 ? "text-green-500" : "text-red-500"}`}>
                      ({totalPL.percent >= 0 ? "+" : ""}
                      {totalPL.percent.toFixed(2)}%)
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
