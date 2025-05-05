"use client"

import { useEffect, useRef, useState } from "react"
import { LineChart } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LiveTickerPrice } from "@/components/live-ticker-price"
import { DashboardCard } from "@/components/ui/dashboard-card"

interface CustomTradingViewProps {
  symbol?: string
  height?: number
  showToolbar?: boolean
  showVolume?: boolean
}

export function CustomTradingView({
  symbol = "AAPL",
  height = 400,
  showToolbar = true,
  showVolume = true,
}: CustomTradingViewProps) {
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
        hide_top_toolbar: !showToolbar,
        hide_side_toolbar: !showToolbar,
        withdateranges: showToolbar,
        hide_volume: !showVolume,
        studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
        show_popup_button: true,
      })
    }
  }, [scriptLoaded, isLoading, symbol, timeframe, showToolbar, showVolume])

  return (
    <DashboardCard
      title={symbol}
      icon={<LineChart className="h-5 w-5 text-cyan-500" />}
      description="Real-time chart data"
      headerClassName="flex flex-row items-center justify-between"
      contentClassName="p-0"
      footer={<LiveTickerPrice symbol={symbol} className="ml-2" />}
      footerClassName="px-4 py-2 border-t border-slate-800/60"
    >
      <div className="absolute top-4 right-4 z-10">
        <Tabs value={timeframe} onValueChange={setTimeframe}>
          <TabsList>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="p-4">
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <div
          id="tradingview_widget"
          ref={containerRef}
          className="h-full w-full"
          style={{ height: height ? `${height}px` : "100%" }}
        />
      )}
    </DashboardCard>
  )
}

// Add TradingView types
declare global {
  interface Window {
    TradingView: any
  }
}
