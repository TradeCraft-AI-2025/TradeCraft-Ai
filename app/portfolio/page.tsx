"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { ArrowLeft, RefreshCw, Plus, X, Upload } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { PortfolioHolding } from "@/lib/types"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"
import { fetchStockQuote } from "@/lib/finnhub-api"
import { AddPositionForm } from "@/components/add-position-form"
import { CsvImportForm } from "@/components/csv-import-form"
import { PortfolioInsights } from "@/components/portfolio-insights"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"
import { analyzePortfolio } from "@/lib/portfolio-analysis"

type InputMode = "none" | "manual" | "csv"

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>("none")
  const { toast } = useToast()

  const analysis = useMemo(
    () => (portfolio.length > 0 ? analyzePortfolio(portfolio) : null),
    [portfolio],
  )

  const refreshQuotes = useCallback(async (holdings: PortfolioHolding[]) => {
    if (holdings.length === 0) return holdings

    return Promise.all(
      holdings.map(async (h) => {
        try {
          const quote = await fetchStockQuote(h.symbol)
          if (!quote) return h
          const currentPrice = quote.price
          const totalCost = h.quantity * h.costBasis
          const currentValue = h.quantity * currentPrice
          const unrealizedPL = currentValue - totalCost
          const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0
          return { ...h, currentPrice, unrealizedPL, unrealizedPLPercent, dayChangePercent: quote.changePercent || 0 }
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
          await saveToSupabase(refreshed)
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshQuotes, saveToSupabase])

  const handleRefresh = async () => {
    if (portfolio.length === 0) return
    setIsLoading(true)
    setError(null)
    try {
      const refreshed = await refreshQuotes(portfolio)
      setPortfolio(refreshed)
      setLastUpdated(new Date())
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
      if (quote) {
        newHolding.currentPrice = quote.price
        const totalCost = quantity * costBasis
        const currentValue = quantity * quote.price
        newHolding.unrealizedPL = currentValue - totalCost
        newHolding.unrealizedPLPercent = totalCost > 0 ? (newHolding.unrealizedPL / totalCost) * 100 : 0
        newHolding.dayChangePercent = quote.changePercent || 0
      }
    } catch {
      // keep cost-basis defaults
    }

    const updated = [...portfolio, newHolding]
    setPortfolio(updated)
    setInputMode("none")
    await saveToSupabase(updated)
    toast({ title: "Position added", description: `Added ${quantity} shares of ${symbol.toUpperCase()}.` })
  }

  const handleCsvImport = async (imported: PortfolioHolding[]) => {
    const refreshed = await refreshQuotes(imported)
    const merged = [...portfolio, ...refreshed]
    setPortfolio(merged)
    setInputMode("none")
    setLastUpdated(new Date())
    await saveToSupabase(merged)
    toast({ title: "CSV imported", description: `Added ${imported.length} holdings to your portfolio.` })
  }

  const handleRemovePosition = async (index: number) => {
    const updated = portfolio.filter((_, i) => i !== index)
    setPortfolio(updated)
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

      {/* Header */}
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
            Manage holdings and view portfolio insights
            {lastUpdated && <span className="text-xs ml-2">• Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="h-9" onClick={handleRefresh} disabled={isLoading || portfolio.length === 0}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column: Holdings */}
        <div className="lg:col-span-2">
          <ErrorBoundary>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Holdings</CardTitle>
                  <CardDescription>
                    {portfolio.length > 0
                      ? `${portfolio.length} position${portfolio.length !== 1 ? "s" : ""}`
                      : "Add holdings to get started"}
                    {lastUpdated && <span className="text-xs ml-2">• Prices as of {lastUpdated.toLocaleTimeString()}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => setInputMode(inputMode === "csv" ? "none" : "csv")}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                  >
                    {inputMode === "csv" ? <><X className="h-4 w-4" /> Cancel</> : <><Upload className="h-4 w-4" /> Import CSV</>}
                  </Button>
                  <Button
                    onClick={() => setInputMode(inputMode === "manual" ? "none" : "manual")}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                  >
                    {inputMode === "manual" ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Input forms */}
                {inputMode === "manual" && (
                  <div className="mb-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                    <h3 className="text-sm font-medium mb-3">Add Position</h3>
                    <AddPositionForm onSubmit={handleAddPosition} onCancel={() => setInputMode("none")} />
                  </div>
                )}

                {inputMode === "csv" && (
                  <div className="mb-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                    <h3 className="text-sm font-medium mb-3">Import from CSV</h3>
                    <CsvImportForm onImport={handleCsvImport} onCancel={() => setInputMode("none")} />
                  </div>
                )}

                {/* Holdings table */}
                {portfolio.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="text-left py-3 px-2">Symbol</th>
                          <th className="text-right py-3 px-2">Qty</th>
                          <th className="text-right py-3 px-2">Price</th>
                          <th className="text-right py-3 px-2">Value</th>
                          <th className="text-right py-3 px-2">P/L</th>
                          <th className="py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.map((h, i) => {
                          const value = h.quantity * h.currentPrice
                          return (
                            <tr key={h.symbol + i} className="border-b border-slate-800">
                              <td className="py-3 px-2">
                                <div className="font-medium">{h.symbol}</div>
                                <div className="text-xs text-slate-500">{h.quantity} shares</div>
                              </td>
                              <td className="py-3 px-2 text-right">{h.quantity}</td>
                              <td className="py-3 px-2 text-right">{formatCurrency(h.currentPrice)}</td>
                              <td className="py-3 px-2 text-right">{formatCurrency(value)}</td>
                              <td className={`py-3 px-2 text-right ${h.unrealizedPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                                {formatCurrency(h.unrealizedPL)}
                                <div className="text-xs">
                                  {h.unrealizedPLPercent >= 0 ? "+" : ""}{h.unrealizedPLPercent.toFixed(2)}%
                                </div>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400" onClick={() => handleRemovePosition(i)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !isLoading && (
                    <div className="text-center py-12">
                      <p className="text-slate-400 mb-2">No holdings yet</p>
                      <p className="text-sm text-slate-500 mb-4">Add positions manually or import a CSV to get started.</p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setInputMode("csv")}>
                          <Upload className="h-4 w-4 mr-2" /> Import CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setInputMode("manual")}>
                          <Plus className="h-4 w-4 mr-2" /> Add manually
                        </Button>
                      </div>
                    </div>
                  )
                )}

                {/* P/L summary */}
                {analysis && (
                  <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-800/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Total Portfolio</h3>
                        <p className="text-xs text-slate-400">{analysis.holdingCount} positions · {formatCurrency(analysis.totalValue)}</p>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center">
                        <div className={`text-xl font-bold ${analysis.totalPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {formatCurrency(analysis.totalPL)}
                        </div>
                        <div className={`ml-2 text-sm ${analysis.plPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                          ({analysis.plPercent >= 0 ? "+" : ""}{analysis.plPercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </ErrorBoundary>
        </div>

        {/* Sidebar: Insights */}
        <div className="lg:col-span-1">
          {analysis ? (
            <PortfolioInsights analysis={analysis} />
          ) : (
            !isLoading && (
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-slate-500">Add holdings to see portfolio insights.</p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  )
}
