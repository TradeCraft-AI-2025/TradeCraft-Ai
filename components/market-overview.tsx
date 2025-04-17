"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { getStockQuote, type StockQuote } from "@/lib/market-data"
import { ArrowUp, ArrowDown } from "lucide-react"

interface MarketData {
  name: string
  symbol: string
  value: number
  change: number
  changePercent: number
  data: { time: string; value: number }[]
}

export function MarketOverview() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const symbols = ["SPY", "QQQ", "IWM", "DIA"]
    const marketNames = ["S&P 500", "NASDAQ", "Russell 2000", "Dow Jones"]

    const fetchMarketData = async () => {
      try {
        const promises = symbols.map((symbol) => getStockQuote(symbol))
        const results = await Promise.allSettled(promises)

        const marketData: MarketData[] = []

        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            const quote: StockQuote = result.value

            // Generate mock chart data based on the current price
            const basePrice = quote.price
            const chartData = Array(24)
              .fill(0)
              .map((_, i) => {
                // Create price variations that reflect the overall trend
                const variation = (Math.random() - 0.5) * 2 * Math.abs(quote.change) * 0.2
                const trendFactor =
                  quote.change > 0 ? (i / 24) * quote.change : ((24 - i) / 24) * Math.abs(quote.change)

                return {
                  time: `${i}:00`,
                  value: basePrice - quote.change + trendFactor + variation,
                }
              })

            marketData.push({
              name: marketNames[index],
              symbol: symbols[index],
              value: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
              data: chartData,
            })
          } else {
            // If the API call failed, add mock data
            const mockValue = 100 + Math.random() * 10
            const mockChange = (Math.random() - 0.5) * 5
            const mockPercent = (mockChange / mockValue) * 100

            marketData.push({
              name: marketNames[index],
              symbol: symbols[index],
              value: mockValue,
              change: mockChange,
              changePercent: mockPercent,
              data: Array(24)
                .fill(0)
                .map((_, i) => ({
                  time: `${i}:00`,
                  value: mockValue - mockChange + (mockChange * i) / 24 + (Math.random() - 0.5) * mockChange * 0.4,
                })),
            })
          }
        })

        setMarkets(marketData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching market data:", err)
        setLoading(false)
      }
    }

    fetchMarketData()

    // Set up interval to refresh data
    const intervalId = setInterval(fetchMarketData, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, [])

  const activeMarket = markets[activeIndex] || null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        <CardDescription>Global market performance</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {markets.map((market, idx) => (
                <div
                  key={market.symbol}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? "bg-cyan-500/20 border border-cyan-500/50"
                      : "bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="text-sm font-medium">{market.name}</div>
                  <div className="text-lg font-bold mt-1">{market.value.toFixed(2)}</div>
                  <div
                    className={`text-sm mt-1 flex items-center ${
                      market.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {market.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {market.change >= 0 ? "+" : ""}
                    {market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
                  </div>
                </div>
              ))}
            </div>

            {activeMarket && (
              <div className="h-[250px] mt-4">
                <ChartContainer
                  config={{
                    value: {
                      label: "Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeMarket.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{ fill: "rgba(255,255,255,0.6)" }} />
                      <YAxis
                        domain={["auto", "auto"]}
                        stroke="rgba(255,255,255,0.4)"
                        tick={{ fill: "rgba(255,255,255,0.6)" }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background/90 border border-border p-2 rounded-md shadow-md">
                                <p className="text-xs text-slate-300">{`Time: ${payload[0].payload.time}`}</p>
                                <p className="text-xs font-bold text-cyan-400">{`Price: $${payload[0].value?.toFixed(2)}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={activeMarket.change >= 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: activeMarket.change >= 0 ? "#10b981" : "#ef4444" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
