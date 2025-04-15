"use client"

import { useEffect, useRef } from "react"

interface CustomTradingViewProps {
  symbol: string
  interval?: string
  chartType?: "candlestick" | "line" | "bar" | "area"
  theme?: "dark" | "light"
  height?: number
  width?: string
  showToolbar?: boolean
  showVolume?: boolean
  showDateRanges?: boolean
  studies?: string[]
  isMinichart?: boolean
}

export function CustomTradingView({
  symbol,
  interval = "D",
  chartType = "candlestick",
  theme = "dark",
  height = 600,
  width = "100%",
  showToolbar = true,
  showVolume = true,
  showDateRanges = true,
  studies = [],
  isMinichart = false,
}: CustomTradingViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current || !symbol || symbol.trim() === "") return

    // Generate a unique ID for this chart
    const containerId = `tradingview_${Math.random().toString(36).substring(2, 15)}`
    containerRef.current.id = containerId

    // Check if TradingView widget script is already loaded
    if (!scriptLoadedRef.current && !window.TradingView) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = () => {
        scriptLoadedRef.current = true
        createWidget(containerId)
      }
      document.head.appendChild(script)
    } else if (window.TradingView) {
      createWidget(containerId)
    }

    function createWidget(id: string) {
      if (!window.TradingView || !symbol || symbol.trim() === "") return

      // Define chart style based on chartType
      let chartStyle = 1 // Default: Candlestick
      if (chartType === "line") chartStyle = 3
      if (chartType === "bar") chartStyle = 0
      if (chartType === "area") chartStyle = 2

      // Custom theme colors for a luxury look
      const customColors = {
        bg: "rgb(0, 0, 0)",
        gridColor: "rgba(212, 175, 55, 0.06)",
        downColor: "#f23645",
        upColor: "#26a69a",
        borderUpColor: "#26a69a",
        borderDownColor: "#f23645",
        wickUpColor: "#26a69a",
        wickDownColor: "#f23645",
        textColor: "rgba(255, 255, 255, 0.9)",
        axisColor: "rgba(212, 175, 55, 0.2)",
      }

      // Create the widget with custom settings
      new window.TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: interval,
        container_id: id,
        library_path: "https://s3.tradingview.com/tv.js/",
        locale: "en",
        timezone: "exchange",
        theme: theme,
        style: chartStyle,
        toolbar_bg: "rgba(0, 0, 0, 0.8)",
        enable_publishing: false,
        hide_top_toolbar: !showToolbar,
        hide_side_toolbar: isMinichart,
        withdateranges: showDateRanges,
        hide_volume: !showVolume,
        studies: studies,
        show_popup_button: !isMinichart,
        popup_width: "1000",
        popup_height: "650",
        // Custom colors for a luxury look
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": customColors.upColor,
          "mainSeriesProperties.candleStyle.downColor": customColors.downColor,
          "mainSeriesProperties.candleStyle.borderUpColor": customColors.borderUpColor,
          "mainSeriesProperties.candleStyle.borderDownColor": customColors.borderDownColor,
          "mainSeriesProperties.candleStyle.wickUpColor": customColors.wickUpColor,
          "mainSeriesProperties.candleStyle.wickDownColor": customColors.wickDownColor,
          "paneProperties.background": customColors.bg,
          "paneProperties.vertGridProperties.color": customColors.gridColor,
          "paneProperties.horzGridProperties.color": customColors.gridColor,
          "scalesProperties.textColor": customColors.textColor,
          "scalesProperties.lineColor": customColors.axisColor,
        },
        loading_screen: {
          backgroundColor: "rgb(0, 0, 0)",
          foregroundColor: "rgba(212, 175, 55, 0.2)",
        },
      })
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, interval, chartType, theme, height, showToolbar, showVolume, showDateRanges, studies, isMinichart])

  return <div ref={containerRef} style={{ height: `${height}px`, width }} />
}

// Add TradingView types
declare global {
  interface Window {
    TradingView: any
  }
}
