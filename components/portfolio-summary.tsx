"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, BarChart2, Wallet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PortfolioSummaryProps {
  className?: string
  isEmpty?: boolean
  onConnect?: () => void
}

interface PortfolioData {
  totalValue: number
  previousValue: number
  change: number
  changePercent: number
  dayChange: number
  dayChangePercent: number
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

  useEffect(() => {
    // Simulate loading portfolio data
    const timer = setTimeout(() => {
      // Mock portfolio data
      const mockData: PortfolioData = {
        totalValue: 124568.42,
        previousValue: 122568.42,
        change: 2000,
        changePercent: 1.63,
        dayChange: 1245.68,
        dayChangePercent: 1.01,
        allocation: [
          {
            category: "US Equities",
            value: 68512.63,
            percent: 55,
            change: 2.3,
          },
          {
            category: "Crypto",
            value: 24913.68,
            percent: 20,
            change: -1.2,
          },
          {
            category: "Fixed Income",
            value: 18685.26,
            percent: 15,
            change: 0.5,
          },
          {
            category: "Cash",
            value: 12456.84,
            percent: 10,
            change: 0,
          },
        ],
      }

      setPortfolioData(mockData)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
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

  return (
    <Card className={`premium-card ${className}`}>
      <CardHeader className="pb-2 border-b border-[#D4AF37]/20">
        <CardTitle className="font-serif flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-[#D4AF37]" />
          Portfolio Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading && !isEmpty ? (
          <div className="space-y-4">
            <div className="h-10 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
            <div className="h-20 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
            <div className="h-40 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <DollarSign className="h-12 w-12 text-slate-500/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Portfolio Data</h3>
            <p className="text-slate-500 mb-6">Add holdings to see your portfolio summary</p>
            {onConnect && (
              <Button onClick={onConnect} className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            )}
          </div>
        ) : portfolioData ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <div className="text-sm text-slate-400 mb-1">Total Portfolio Value</div>
              <div className="text-3xl font-serif gold-text-gradient">{formatCurrency(portfolioData.totalValue)}</div>
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

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-3 rounded-lg border border-[#D4AF37]/10">
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

              <div className="bg-black/30 p-3 rounded-lg border border-[#D4AF37]/10">
                <div className="text-xs text-slate-400 mb-1">Performance</div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-[#D4AF37] mr-1" />
                  <span className="text-sm text-[#D4AF37]">Outperforming</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">vs S&P 500</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Asset Allocation</div>
                <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  Diversified
                </Badge>
              </div>

              {portfolioData.allocation.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{item.category}</div>
                    <div className="text-xs text-slate-400">{item.percent}%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress
                      value={item.percent}
                      className="h-1.5 bg-slate-700/50"
                      indicatorClassName={
                        index === 0
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                          : index === 1
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : index === 2
                              ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
                              : "bg-gradient-to-r from-green-500 to-emerald-500"
                      }
                    />
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
          </motion.div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-500">No portfolio data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
