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
      setCurrentAlert((prev) => (prev + 1) % alerts.\
