"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { getStockQuote, formatPrice, type StockQuote } from "@/lib/market-data"

interface LiveTickerPriceProps {
  symbol: string
  showChange?: boolean
  className?: string
  refreshInterval?: number // in milliseconds
}

export function LiveTickerPrice({
  symbol,
  showChange = true,
  className = "",
  refreshInterval = 60000, // default 1 minute
}: LiveTickerPriceProps) {
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [flashDirection, setFlashDirection] = useState<"up" | "down" | null>(null)
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 3

    // Don't fetch if symbol is empty
    if (!symbol || symbol.trim() === "") {
      setIsLoading(false)
      return
    }

    const fetchQuote = async () => {
      try {
        setIsLoading(true)
        const data = await getStockQuote(symbol)

        if (!isMounted) return

        if (data) {
          // If we have a previous price, determine flash direction
          if (previousPrice !== null && data.price !== previousPrice) {
            if (data.price > previousPrice) {
              setFlashDirection("up")
            } else if (data.price < previousPrice) {
              setFlashDirection("down")
            }

            // Reset flash after animation
            setTimeout(() => {
              if (isMounted) setFlashDirection(null)
            }, 1000)
          }

          setPreviousPrice(data.price)
          setQuote(data)
          setError(null)
          retryCount = 0 // Reset retry count on success
        } else {
          console.warn(`No data returned for symbol ${symbol}`)

          // Retry logic
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`Retrying (${retryCount}/${maxRetries})...`)
            setTimeout(fetchQuote, 1000) // Retry after 1 second
            return
          }

          setError("Unable to fetch price")
        }
      } catch (err) {
        if (!isMounted) return
        console.error(`Error fetching stock quote for ${symbol}:`, err)

        // Retry logic
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying (${retryCount}/${maxRetries})...`)
          setTimeout(fetchQuote, 1000) // Retry after 1 second
          return
        }

        setError("Error fetching price")
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    // Initial fetch
    fetchQuote()

    // Set up interval for refreshing
    const intervalId = setInterval(fetchQuote, refreshInterval)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [symbol, refreshInterval])

  if (isLoading && !quote) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="h-5 w-16 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
      </div>
    )
  }

  if (error || !quote) {
    return <span className={`text-slate-400 ${className}`}>--</span>
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span
        className={`price-display transition-colors duration-500 ${
          flashDirection === "up" ? "text-green-400" : flashDirection === "down" ? "text-red-400" : ""
        }`}
      >
        ${formatPrice(quote.price)}
      </span>

      {showChange && quote && (
        <div className="ml-2 flex items-center">
          {quote.changePercent >= 0 ? (
            <span className="text-green-400 flex items-center text-xs">
              <ArrowUp className="h-3 w-3 mr-0.5" />
              {quote.changePercent.toFixed(2)}%
            </span>
          ) : (
            <span className="text-red-400 flex items-center text-xs">
              <ArrowDown className="h-3 w-3 mr-0.5" />
              {Math.abs(quote.changePercent).toFixed(2)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
