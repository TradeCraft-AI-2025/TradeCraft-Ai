"use client"

import { useState, useEffect } from "react"

export function StatusStrip() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAlert, setCurrentAlert] = useState(0)
  const [marketStatus, setMarketStatus] = useState<"open" | "closed" | "pre" | "after">("closed")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const [connectionBroker, setConnectionBroker] = useState("Robinhood")

  const alerts = [
    "AAPL: Earnings report expected to beat estimates by 12% - Analysts",
    "TSLA: New factory opening announced in Austin, production to start Q3",
    "SPY: Market volatility increasing, VIX up 15% - Consider hedging positions",
    "NVDA: Goldman Sachs upgrades to Strong Buy with $1200 target price",
    "MSFT: Cloud division revenue up 32% YoY, exceeding expectations",
    "AMZN: Prime Day sales projected to reach $13.5B, up 18% from last year",
    "GOOGL: Antitrust ruling expected next week - Potential market impact",
    "JPM: Raising interest rate outlook for Q4, forecasting Fed pause",
  ]

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Determine market status based on NY time
      const nyHour = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getHours()
      const nyMinute = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getMinutes()
      const nyDay = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getDay()

      // Weekend check
      if (nyDay === 0 || nyDay === 6) {
        setMarketStatus("closed")
      }
      // Pre-market: 4:00 AM - 9:30 AM
      else if ((nyHour === 4 && nyMinute >= 0) || (nyHour > 4 && nyHour < 9) || (nyHour === 9 && nyMinute < 30)) {
        setMarketStatus("pre")
      }
      // Regular hours: 9:30 AM - 4:00 PM
      else if ((nyHour === 9 && nyMinute >= 30) || (nyHour > 9 && nyHour < 16)) {
        setMarketStatus("open")
      }
      // After hours: 4:00 PM - 8:00 PM
      else if ((nyHour === 16 && nyMinute >= 0) || (nyHour > 16 && nyHour < 20)) {
        setMarketStatus("after")
      }
      // Closed
      else {
        setMarketStatus("closed")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate occasional connection status changes
  useEffect(() => {
    const connectionCheck = setInterval(() => {
      // 98% chance to stay connected, 2% chance to briefly disconnect
      if (Math.random() > 0.98) {
        setConnectionStatus("connecting")

        // Reconnect after 2 seconds
        setTimeout(() => {
          setConnectionStatus("connected")
        }, 2000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(connectionCheck)
  }, [])

  // Rotate alerts every 5 seconds
  useEffect(() => {
    const alertTimer = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length)
    }, 5000)

    return () => clearInterval(alertTimer)
  }, [alerts.length])

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="h-8 bg-black border-b border-slate-800 text-xs text-slate-400 flex items-center px-4 overflow-hidden">
      <div className="flex items-center space-x-2 mr-4">
        <div className="text-cyan-500">{formatTime(currentTime)}</div>
        <div>{formatDate(currentTime)}</div>
      </div>

      <div className="flex items-center space-x-2 mr-4">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            marketStatus === "open"
              ? "bg-green-500"
              : marketStatus === "pre" || marketStatus === "after"
                ? "bg-amber-500"
                : "bg-red-500"
          }`}
        ></div>
        <div>
          Market:{" "}
          <span
            className={
              marketStatus === "open"
                ? "text-green-500"
                : marketStatus === "pre"
                  ? "text-amber-500"
                  : marketStatus === "after"
                    ? "text-amber-500"
                    : "text-red-500"
            }
          >
            {marketStatus === "open"
              ? "Open"
              : marketStatus === "pre"
                ? "Pre-Market"
                : marketStatus === "after"
                  ? "After-Hours"
                  : "Closed"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mr-4">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-500"
              : connectionStatus === "connecting"
                ? "bg-amber-500"
                : "bg-red-500"
          } ${connectionStatus === "connecting" ? "animate-pulse" : ""}`}
        ></div>
        <div>
          {connectionStatus === "connected"
            ? `${connectionBroker} Connected`
            : connectionStatus === "connecting"
              ? "Connecting..."
              : "Disconnected"}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-y-0 flex items-center animate-marquee">
          <div className="whitespace-nowrap">{alerts[currentAlert]}</div>
        </div>
      </div>
    </div>
  )
}
