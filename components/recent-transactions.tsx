"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { getStockQuote } from "@/lib/market-data"

interface Transaction {
  id: string
  type: "buy" | "sell"
  symbol: string
  shares: number
  price: number
  date: string
  time: string
  status: "completed" | "pending" | "failed"
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate realistic transactions with actual stock prices
    const fetchData = async () => {
      try {
        const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"]
        const quotes = await Promise.all(symbols.map((symbol) => getStockQuote(symbol)))

        const validQuotes = quotes.filter((quote) => quote !== null)

        // Generate dates for the last 7 days
        const dates = Array(7)
          .fill(0)
          .map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - i)
            return date.toISOString().split("T")[0]
          })

        // Generate timestamps
        const times = ["09:32:45", "10:15:23", "11:05:47", "13:22:14", "14:45:03", "15:28:36"]

        // Generate mock transactions using real price data
        const mockTransactions: Transaction[] = []

        for (let i = 0; i < 10; i++) {
          const randomQuoteIndex = Math.floor(Math.random() * validQuotes.length)
          const quote = validQuotes[randomQuoteIndex]

          if (!quote) continue

          const dateIndex = Math.floor(Math.random() * dates.length)
          const timeIndex = Math.floor(Math.random() * times.length)

          // Randomly vary price slightly from the current price
          const priceVariation = Math.random() * 0.05 - 0.025 // ±2.5%
          const transactionPrice = quote.price * (1 + priceVariation)

          mockTransactions.push({
            id: `tx-${i + 1}`,
            type: Math.random() > 0.4 ? "buy" : "sell",
            symbol: quote.symbol,
            shares: Math.floor(Math.random() * 20) + 1,
            price: transactionPrice,
            date: dates[dateIndex],
            time: times[timeIndex],
            status: Math.random() > 0.9 ? "pending" : "completed",
          })
        }

        // Sort by date, most recent first
        mockTransactions.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`)
          const dateB = new Date(`${b.date}T${b.time}`)
          return dateB.getTime() - dateA.getTime()
        })

        setTransactions(mockTransactions)
        setLoading(false)
      } catch (error) {
        console.error("Error generating transactions:", error)
        setLoading(false)
      }
    }

    fetchData()
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

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today"
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest trading activity</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-auto">
          {loading ? (
            <div className="space-y-4 p-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-500">No recent transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"} mr-3`}
                      >
                        {tx.type === "buy" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{tx.symbol}</span>
                          <span className="text-slate-500 ml-2 text-xs capitalize">{tx.type}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {formatDate(tx.date)} • {tx.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(tx.price * tx.shares)}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {tx.shares} × {formatCurrency(tx.price)}
                      </div>
                    </div>
                  </div>

                  {tx.status !== "completed" && (
                    <div className="mt-2 flex justify-end">
                      <Badge variant={tx.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
