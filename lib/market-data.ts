// Client-side code that uses mock data instead of API keys

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

// Mock data for common stocks
const mockStockData: Record<string, { price: number; change: number }> = {
  AAPL: { price: 178.72, change: 1.25 },
  MSFT: { price: 338.11, change: 2.45 },
  GOOGL: { price: 142.65, change: 0.87 },
  AMZN: { price: 178.15, change: -0.32 },
  TSLA: { price: 177.8, change: -1.2 },
  META: { price: 474.99, change: 3.21 },
  NVDA: { price: 950.02, change: 15.75 },
  SPY: { price: 504.85, change: 1.05 },
  QQQ: { price: 438.27, change: 1.32 },
}

// Client-side cache to reduce API calls
const quoteCache: Record<string, { data: StockQuote; timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Get stock quote from our server API or mock data
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    // Check cache first
    const now = Date.now()
    if (quoteCache[symbol] && now - quoteCache[symbol].timestamp < CACHE_DURATION) {
      return quoteCache[symbol].data
    }

    // Try to get data from server API
    try {
      const response = await fetch(`/api/stock/quote?symbol=${symbol}`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (response.ok) {
        const quote = await response.json()
        quoteCache[symbol] = { data: quote, timestamp: now }
        return quote
      }
    } catch (error) {
      console.warn(`API error for ${symbol}:`, error)
      // Fall back to mock data
    }

    // Use mock data as fallback
    const mockQuote = createMockQuote(symbol)
    quoteCache[symbol] = { data: mockQuote, timestamp: now }
    return mockQuote
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)

    // If we have a cached quote, return it even if it's expired
    if (quoteCache[symbol]) {
      console.warn(`Using expired cache for ${symbol}`)
      return quoteCache[symbol].data
    }

    return createMockQuote(symbol)
  }
}

/**
 * Create a mock quote for a symbol
 */
function createMockQuote(symbol: string): StockQuote {
  const now = Date.now()

  // Use predefined mock data if available, otherwise generate random data
  const mockData = mockStockData[symbol] || {
    price: Math.random() * 100 + 50, // Random price between 50 and 150
    change: Math.random() * 4 - 2, // Random change between -2 and 2
  }

  const price = mockData.price
  const change = mockData.change
  const previousClose = price - change
  const changePercent = (change / previousClose) * 100

  return {
    symbol,
    price,
    change,
    changePercent,
    previousClose,
    timestamp: now,
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

    // Try to get data from server API
    try {
      const response = await fetch(`/api/stock/quote?symbols=${symbolsToFetch.join(",")}`, {
        signal: AbortSignal.timeout(10000), // 10 second timeout for batch requests
      })

      if (response.ok) {
        const fetchedQuotes = await response.json()

        // Update cache for fetched quotes
        Object.entries(fetchedQuotes).forEach(([symbol, quote]) => {
          quoteCache[symbol] = { data: quote as StockQuote, timestamp: now }
        })

        // Combine cached and fetched quotes
        return { ...cachedQuotes, ...fetchedQuotes }
      }
    } catch (error) {
      console.warn(`API error for batch quotes:`, error)
      // Fall back to mock data
    }

    // Use mock data for symbols that weren't cached
    const mockQuotes: Record<string, StockQuote> = { ...cachedQuotes }

    symbolsToFetch.forEach((symbol) => {
      const mockQuote = createMockQuote(symbol)
      quoteCache[symbol] = { data: mockQuote, timestamp: now }
      mockQuotes[symbol] = mockQuote
    })

    return mockQuotes
  } catch (error) {
    console.error(`Error fetching batch quotes:`, error)

    // Return any cached quotes we have and generate mock data for the rest
    const result: Record<string, StockQuote> = {}

    symbols.forEach((symbol) => {
      if (quoteCache[symbol]) {
        result[symbol] = quoteCache[symbol].data
      } else {
        result[symbol] = createMockQuote(symbol)
      }
    })

    return result
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
