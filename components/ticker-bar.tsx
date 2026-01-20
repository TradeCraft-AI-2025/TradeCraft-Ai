"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { formatPrice, type StockQuote } from "@/lib/market-data"

interface TickerBarProps {
  symbols?: string[]
  className?: string
}

interface TickerItem extends StockQuote {
  symbol: string
}

export function TickerBar({ symbols = [], className = "" }: TickerBarProps) {
  const [tickers, setTickers] = useState<TickerItem[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [useMock, setUseMock] = useState(true) // Initialize useMock to true

  // Get watchlist from localStorage if no symbols provided
  useEffect(() => {
    let initialSymbols = symbols
    if (initialSymbols.length === 0) {
      try {
        const savedWatchlist = localStorage.getItem("tradecraft-watchlist")
        if (savedWatchlist) {
          const parsed = JSON.parse(savedWatchlist)
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialSymbols = parsed
          } else {
            // Default symbols if watchlist is empty
            initialSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "SPY", "QQQ"]
          }
        } else {
          // Default symbols if no watchlist
          initialSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "SPY", "QQQ"]
        }
      } catch (e) {
        console.error("Error parsing watchlist from localStorage:", e)
        // Default symbols on error
        initialSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "SPY", "QQQ"]
      }
    }

    // Update symbols state only once after processing localStorage
    if (symbols.length === 0 && initialSymbols !== symbols) {
      symbols = initialSymbols
    }

    useMockData(symbols, setTickers)
  }, [])

  // If no tickers yet, show loading
  if (tickers.length === 0) {
    return (
      <div className={`bg-black border-b border-slate-800 h-10 flex items-center px-4 overflow-hidden ${className}`}>
        <div className="text-slate-400 text-sm animate-pulse">Loading market data...</div>
      </div>
    )
  }

  return (
    <div className={`bg-black border-b border-slate-800 h-10 flex items-center px-4 overflow-hidden ${className}`}>
      <div className="ticker-tape-container w-full overflow-hidden relative">
        <div className="ticker-tape flex animate-marquee whitespace-nowrap">
          {tickers.map((ticker) => (
            <div key={ticker.symbol} className="ticker-item flex items-center mx-4">
              <span className="font-medium text-white mr-2">{ticker.symbol}</span>
              <span className="mr-1">${formatPrice(ticker.price)}</span>
              <span className={`flex items-center ${ticker.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                {ticker.changePercent >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(ticker.changePercent).toFixed(2)}%
              </span>
            </div>
          ))}

          {/* Duplicate tickers for seamless looping */}
          {tickers.map((ticker) => (
            <div key={`${ticker.symbol}-dup`} className="ticker-item flex items-center mx-4">
              <span className="font-medium text-white mr-2">{ticker.symbol}</span>
              <span className="mr-1">${formatPrice(ticker.price)}</span>
              <span className={`flex items-center ${ticker.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                {ticker.changePercent >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(ticker.changePercent).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Fallback function to use mock data if WebSocket fails
function useMockData(symbols: string[], setTickers: React.Dispatch<React.SetStateAction<TickerItem[]>>) {
  useEffect(() => {
    const mockData: Record<string, { price: number; change: number }> = {
      AAPL: { price: 178.72, change: 1.25 },
      MSFT: { price: 338.11, change: 2.45 },
      GOOGL: { price: 142.65, change: 0.87 },
      AMZN: { price: 178.15, change: -0.32 },
      TSLA: { price: 177.8, change: -1.2 },
      META: { price: 474.99, change: 3.21 },
      NVDA: { price: 950.02, change: 15.75 },
      SPY: { price: 504.85, change: 1.05 },
      QQQ: { price: 438.27, change: 1.32 },
      IWM: { price: 201.77, change: 0.45 },
      DIA: { price: 380.12, change: -0.28 },
    }

    // Initial data load
    const initialTickers = symbols
      .filter((symbol) => mockData[symbol] || symbol)
      .map((symbol) => {
        const data = mockData[symbol] || {
          price: 100 + Math.random() * 50,
          change: Math.random() * 4 - 2,
        }

        const price = data.price
        const change = data.change
        const prevClose = price - change
        const changePercent = (change / prevClose) * 100

        return {
          symbol,
          price,
          change,
          changePercent,
          timestamp: Date.now(),
        }
      })

    setTickers(initialTickers)

    // Update every 30 seconds with small random variations
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((ticker) => {
          const variation = ticker.price * 0.001 * (Math.random() - 0.5) // ±0.05% variation
          const newPrice = ticker.price + variation
          const change = ticker.change + variation * 0.5
          const prevClose = newPrice - change
          const changePercent = (change / prevClose) * 100

          return {
            ...ticker,
            price: newPrice,
            change,
            changePercent,
            timestamp: Date.now(),
          }
        }),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [symbols, setTickers])
}
