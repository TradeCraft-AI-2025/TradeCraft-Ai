"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, BarChart2, Wallet, ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBatchQuotes } from "@/lib/market-data"
import { DashboardCard } from "@/components/ui/dashboard-card"

interface PortfolioSummaryProps {
  className?: string
  isEmpty?: boolean
  onConnect?: () => void
}

interface PortfolioHolding {
  symbol: string
  shares: number
  costBasis: number
  currentPrice?: number
  value?: number
  change?: number
  changePercent?: number
}

interface PortfolioData {
  totalValue: number
  previousValue: number
  change: number
  changePercent: number
  dayChange: number
  dayChangePercent: number
  holdings: PortfolioHolding[]
  allocation: {
    category: string
    value: number
    percent: number
    change: number
  }[]
}

export function PortfolioSummary({ className = "", isEmpty = false, onConnect }: PortfolioSummaryProps) {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWatchlist, setShowWatchlist] = useState(false)

  useEffect(() => {
    // Load portfolio data with real prices
    const loadPortfolioData = async () => {
      try {
        // Mock portfolio holdings
        let mockHoldings: PortfolioHolding[] = [
          { symbol: "AAPL", shares: 15, costBasis: 150.25 },
          { symbol: "MSFT", shares: 10, costBasis: 290.5 },
          { symbol: "GOOGL", shares: 5, costBasis: 135.2 },
          { symbol: "AMZN", shares: 8, costBasis: 145.3 },
          { symbol: "TSLA", shares: 20, costBasis: 190.25 },
        ]

        // Get real prices for these symbols
        const symbols = mockHoldings.map((h) => h.symbol)
        const quotes = await getBatchQuotes(symbols)

        // Calculate portfolio values with real prices
        let totalValue = 0
        let totalCost = 0

        // Update holdings with current prices and values
        mockHoldings = mockHoldings.map((holding) => {
          const quote = quotes[holding.symbol]
          const currentPrice = quote?.price || holding.costBasis
          const value = holding.shares * currentPrice
          const costValue = holding.shares * holding.costBasis
          totalValue += value
          totalCost += costValue

          return {
            ...holding,
            currentPrice,
            value,
            change: value - costValue,
            changePercent: (value / costValue - 1) * 100,
          }
        })

        // Calculate overall portfolio metrics
        const previousValue = totalValue - totalValue * 0.01 // Assume 1% daily change
        const change = totalValue - totalCost
        const changePercent = (totalValue / totalCost - 1) * 100

        // Calculate allocation by category (here we're just using sectors as an example)
        const sectorAllocation = [
          {
            category: "Technology",
            value: mockHoldings
              .filter((h) => ["AAPL", "MSFT", "GOOGL"].includes(h.symbol))
              .reduce((sum, h) => sum + (h.value || 0), 0),
            percent: 0, // Will be calculated below
            change: 2.3,
          },
          {
            category: "Consumer Cyclical",
            value: mockHoldings
              .filter((h) => ["AMZN", "TSLA"].includes(h.symbol))
              .reduce((sum, h) => sum + (h.value || 0), 0),
            percent: 0, // Will be calculated below
            change: -0.8,
          },
        ]

        // Calculate percentages
        sectorAllocation.forEach((sector) => {
          sector.percent = (sector.value / totalValue) * 100
        })

        // Create the portfolio data object
        const portfolio: PortfolioData = {
          totalValue,
          previousValue,
          change,
          changePercent,
          dayChange: totalValue - previousValue,
          dayChangePercent: (totalValue / previousValue - 1) * 100,
          holdings: mockHoldings,
          allocation: sectorAllocation,
        }

        setPortfolioData(portfolio)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading portfolio data:", error)
        setIsLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  if (isEmpty) {
    return (
      <DashboardCard
        title="Portfolio Summary"
        icon={<DollarSign className="h-5 w-5 text-cyan-500" />}
        description="Your investment overview"
        className={className}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <DollarSign className="h-12 w-12 text-slate-500/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Portfolio Data</h3>
          <p className="text-slate-500 mb-6">Add holdings to see your portfolio summary</p>
          {onConnect && (
            <Button onClick={onConnect} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          )}
        </div>
      </DashboardCard>
    )
  }

  if (isLoading) {
    return (
      <DashboardCard
        title="Portfolio Summary"
        icon={<DollarSign className="h-5 w-5 text-cyan-500" />}
        description="Your investment overview"
        className={className}
      >
        <div className="space-y-4">
          <div className="h-10 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
          <div className="h-20 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
          <div className="h-40 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
        </div>
      </DashboardCard>
    )
  }

  if (!portfolioData) {
    return (
      <DashboardCard
        title="Portfolio Summary"
        icon={<DollarSign className="h-5 w-5 text-cyan-500" />}
        description="Your investment overview"
        className={className}
      >
        <div className="space-y-4 text-center">
          <p>Unable to load portfolio data</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title="Portfolio Summary"
      icon={<DollarSign className="h-5 w-5 text-cyan-500" />}
      description="Your investment overview"
      className={className}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="text-sm text-slate-400 mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-cyan-400">{formatCurrency(portfolioData.totalValue)}</div>
          <div className="flex items-center mt-1">
            {portfolioData.changePercent >= 0 ? (
              <span className="text-green-400 flex items-center text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                {formatCurrency(portfolioData.change)} ({portfolioData.changePercent.toFixed(2)}%)
              </span>
            ) : (
              <span className="text-red-400 flex items-center text-sm">
                <ArrowDown className="h-4 w-4 mr-1" />
                {formatCurrency(Math.abs(portfolioData.change))} ({Math.abs(portfolioData.changePercent).toFixed(2)}
                %)
              </span>
            )}
          </div>
        </motion.div>

        {/* Collapsible Watchlist */}
        <motion.div variants={itemVariants} className="w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWatchlist(!showWatchlist)}
            className="w-full flex justify-between items-center mb-2 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50"
          >
            <span>Holdings Watchlist</span>
            {showWatchlist ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showWatchlist && (
            <div className="rounded-md border border-slate-700/50 overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/70">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-slate-400">Ticker</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-slate-400">Last Price</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-slate-400">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.holdings.map((holding, index) => (
                    <tr key={index} className="border-t border-slate-700/30">
                      <td className="py-2 px-3 font-medium">{holding.symbol}</td>
                      <td className="py-2 px-3 text-right">{formatCurrency(holding.currentPrice || 0)}</td>
                      <td
                        className={`py-2 px-3 text-right ${
                          holding.changePercent && holding.changePercent > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {holding.changePercent && holding.changePercent > 0 ? "+" : ""}
                        {holding.changePercent?.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1">Today's Change</div>
            <div className="flex items-center">
              {portfolioData.dayChangePercent >= 0 ? (
                <span className="text-green-400 flex items-center text-sm">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {portfolioData.dayChangePercent.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-400 flex items-center text-sm">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(portfolioData.dayChangePercent).toFixed(2)}%
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-1">{formatCurrency(portfolioData.dayChange)}</div>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1">Performance</div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-cyan-500 mr-1" />
              <span className="text-sm text-cyan-500">
                {portfolioData.changePercent >= 0 ? "Outperforming" : "Underperforming"}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">vs S&P 500</div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Asset Allocation</div>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              <BarChart2 className="h-3 w-3 mr-1" />
              Diversified
            </Badge>
          </div>

          {portfolioData.allocation.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm">{item.category}</div>
                <div className="text-xs text-slate-400">{item.percent.toFixed(1)}%</div>
              </div>
              <div className="flex items-center justify-between">
                <Progress value={item.percent} className="h-1.5 bg-slate-700/50" />
                <div
                  className={`text-xs ml-2 ${
                    item.change > 0 ? "text-green-400" : item.change < 0 ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <div className="text-sm font-medium">Top Holdings</div>
          {portfolioData.holdings.slice(0, 3).map((holding, index) => (
            <div key={index} className="flex items-center justify-between text-xs p-2 bg-slate-800/30 rounded-md">
              <div>
                <div className="font-medium">{holding.symbol}</div>
                <div className="text-slate-400">{holding.shares} shares</div>
              </div>
              <div className="text-right">
                <div>{formatCurrency(holding.value || 0)}</div>
                <div className={holding.changePercent && holding.changePercent > 0 ? "text-green-400" : "text-red-400"}>
                  {holding.changePercent && holding.changePercent > 0 ? "+" : ""}
                  {holding.changePercent?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </DashboardCard>
  )
}
