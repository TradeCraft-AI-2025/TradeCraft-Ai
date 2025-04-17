"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LiveTickerPrice } from "@/components/live-ticker-price"

interface TradingViewChartProps {
  symbol?: string
}

export function TradingViewChart({ symbol = "AAPL" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1D")
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Load TradingView widget script
    if (!scriptLoaded) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        setScriptLoaded(true)
        setIsLoading(false)
      }
      document.head.appendChild(script)
      return () => {
        document.head.removeChild(script)
      }
    }

    // If script is already loaded, just set loading to false
    if (scriptLoaded) {
      setIsLoading(false)
    }
  }, [scriptLoaded])

  useEffect(() => {
    // Create TradingView widget when script is loaded and container is available
    if (scriptLoaded && containerRef.current && !isLoading) {
      const container = containerRef.current
      container.innerHTML = ""

      // Create widget
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: timeframe === "1D" ? "D" : timeframe === "1W" ? "W" : timeframe === "1M" ? "M" : "60",
        container_id: container.id,
        library_path: "https://s3.tradingview.com/tv.js/",
        locale: "en",
        timezone: "exchange",
        theme: "dark",
        style: "1", // Candlestick
        toolbar_bg: "rgba(0, 0, 0, 0.8)",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        withdateranges: true,
        hide_volume: false,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        show_popup_button: true,
      })
    }
  }, [scriptLoaded, isLoading, symbol, timeframe])

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center">
            {symbol}
            <LiveTickerPrice symbol={symbol} className="ml-2" />
          </CardTitle>
          <CardDescription>Real-time chart data</CardDescription>
        </div>
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div id="tradingview_widget" ref={containerRef} className="h-[300px] w-full" />
        )}
      </CardContent>
    </Card>
  )
}

// Add TradingView types
declare global {
  interface Window {
    TradingView: any
  }
}
