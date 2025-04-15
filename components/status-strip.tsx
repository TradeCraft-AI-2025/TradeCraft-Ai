"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, Clock, BarChart2, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LiveTickerPrice } from "@/components/live-ticker-price"

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

  // Format time for New York (Eastern Time)
  const formatNYTime = () => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(currentTime)
  }

  // Get market status display
  const getMarketStatusDisplay = () => {
    switch (marketStatus) {
      case "open":
        return { text: "MARKET OPEN", color: "text-green-400", bg: "bg-green-400" }
      case "closed":
        return { text: "MARKET CLOSED", color: "text-red-400", bg: "bg-red-400" }
      case "pre":
        return { text: "PRE-MARKET", color: "text-amber-400", bg: "bg-amber-400" }
      case "after":
        return { text: "AFTER-HOURS", color: "text-blue-400", bg: "bg-blue-400" }
    }
  }

  // Get connection status display
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case "connected":
        return { text: `Connected to ${connectionBroker}`, color: "text-green-400", bg: "bg-green-400" }
      case "connecting":
        return { text: "Reconnecting...", color: "text-amber-400", bg: "bg-amber-400" }
      case "disconnected":
        return { text: "Disconnected", color: "text-red-400", bg: "bg-red-400" }
    }
  }

  const marketStatusDisplay = getMarketStatusDisplay()
  const connectionStatusDisplay = getConnectionStatusDisplay()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 shadow-sm h-8 px-4 flex items-center justify-between text-xs text-white/80 font-sans">
      {/* Left: NY Time and Market Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-[#5EEAD4]" />
          <div className="font-mono tracking-wider">
            <span className="text-[#5EEAD4]">NYC</span> {formatNYTime()}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <motion.div
            animate={{ opacity: marketStatus === "open" ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className={`h-1.5 w-1.5 rounded-full ${marketStatusDisplay.bg}`}
          ></motion.div>
          <span className={marketStatusDisplay.color}>{marketStatusDisplay.text}</span>
        </div>
      </div>

      {/* Center: Alert Ticker */}
      <div className="flex-1 mx-8 overflow-hidden relative h-full">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-10"></div>
        <div className="flex items-center h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAlert}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <Zap className="h-3 w-3 text-amber-400 mr-2" />
              <span>{alerts[currentAlert]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Connection Status and Market Index */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-3 w-3 text-[#5EEAD4]" />
          <Badge variant="outline" className="h-5 px-1 py-0 text-[10px] border-[#5EEAD4]/30 bg-[#5EEAD4]/5">
            S&P 500 <LiveTickerPrice symbol="SPY" showChange={false} className="ml-1 text-[10px]" />
          </Badge>
          <Badge variant="outline" className="h-5 px-1 py-0 text-[10px] border-[#5EEAD4]/30 bg-[#5EEAD4]/5">
            NASDAQ <LiveTickerPrice symbol="QQQ" showChange={false} className="ml-1 text-[10px]" />
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          <motion.div
            animate={{
              opacity:
                connectionStatus === "connected"
                  ? [0.5, 1, 0.5]
                  : connectionStatus === "connecting"
                    ? [0.3, 0.8, 0.3]
                    : 1,
            }}
            transition={{ duration: connectionStatus === "connecting" ? 0.8 : 2, repeat: Number.POSITIVE_INFINITY }}
            className={`h-1.5 w-1.5 rounded-full ${connectionStatusDisplay.bg}`}
          ></motion.div>
          <div className="flex items-center">
            <Wifi className={`h-3 w-3 mr-1 ${connectionStatusDisplay.color}`} />
            <span>{connectionStatusDisplay.text}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
