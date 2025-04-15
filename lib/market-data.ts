// Replace the entire file with this new version that uses our server API

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  previousClose?: number
  open?: number
  high?: number
  low?: number
  volume?: number
  timestamp: number
}

// Client-side cache to reduce API calls
const quoteCache: Record<string, { data: StockQuote; timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Get stock quote from our server API
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    // Check cache first
    const now = Date.now()
    if (quoteCache[symbol] && now - quoteCache[symbol].timestamp < CACHE_DURATION) {
      return quoteCache[symbol].data
    }

    // Call our server API
    const response = await fetch(`/api/stock/quote?symbol=${symbol}`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const quote = await response.json()

    // Update cache
    quoteCache[symbol] = { data: quote, timestamp: now }

    return quote
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)

    // If we have a cached quote, return it even if it's expired
    if (quoteCache[symbol]) {
      console.warn(`Using expired cache for ${symbol}`)
      return quoteCache[symbol].data
    }

    return null
  }
}

/**
 * Get quotes for multiple symbols
 */
export async function getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
  try {
    // Check if we have all symbols in cache
    const now = Date.now()
    const cachedQuotes: Record<string, StockQuote> = {}
    const symbolsToFetch: string[] = []

    // Check which symbols we need to fetch
    symbols.forEach((symbol) => {
      if (quoteCache[symbol] && now - quoteCache[symbol].timestamp < CACHE_DURATION) {
        cachedQuotes[symbol] = quoteCache[symbol].data
      } else {
        symbolsToFetch.push(symbol)
      }
    })

    // If all symbols are cached, return them
    if (symbolsToFetch.length === 0) {
      return cachedQuotes
    }

    // Call our server API for the symbols we need
    const response = await fetch(`/api/stock/quote?symbols=${symbolsToFetch.join(",")}`, {
      signal: AbortSignal.timeout(10000), // 10 second timeout for batch requests
    })

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const fetchedQuotes = await response.json()

    // Update cache for fetched quotes
    Object.entries(fetchedQuotes).forEach(([symbol, quote]) => {
      quoteCache[symbol] = { data: quote as StockQuote, timestamp: now }
    })

    // Combine cached and fetched quotes
    return { ...cachedQuotes, ...fetchedQuotes }
  } catch (error) {
    console.error(`Error fetching batch quotes:`, error)

    // Return any cached quotes we have
    const cachedResults: Record<string, StockQuote> = {}
    symbols.forEach((symbol) => {
      if (quoteCache[symbol]) {
        cachedResults[symbol] = quoteCache[symbol].data
      }
    })

    return cachedResults
  }
}

/**
 * Format price with appropriate precision
 */
export function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else if (price >= 100) {
    return price.toFixed(2)
  } else if (price >= 10) {
    return price.toFixed(3)
  } else if (price >= 1) {
    return price.toFixed(4)
  } else {
    return price.toFixed(6)
  }
}

/**
 * Format large numbers (like volume) with K, M, B suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}
