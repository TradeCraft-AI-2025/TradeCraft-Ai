// Simplified market data library with mock data for reliability

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
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
  IWM: { price: 201.77, change: 0.45 },
  DIA: { price: 380.12, change: -0.28 },
}

// Simple in-memory cache
const quoteCache: Record<string, { data: StockQuote; timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 minute cache

/**
 * Get stock quote - simplified version that uses mock data with small random variations
 */
export async function getStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    // Check cache first
    const now = Date.now()
    if (quoteCache[symbol] && now - quoteCache[symbol].timestamp < CACHE_DURATION) {
      return quoteCache[symbol].data
    }

    // Create a quote with mock data
    const mockData = mockStockData[symbol] || {
      price: 100 + Math.random() * 50, // Random price between 100 and 150
      change: Math.random() * 4 - 2, // Random change between -2 and 2
    }

    // Add small random variation to make it look like real-time data
    const variation = mockData.price * 0.001 * (Math.random() - 0.5) // ±0.05% variation
    const price = mockData.price + variation
    const change = mockData.change
    const previousClose = price - change
    const changePercent = (change / previousClose) * 100

    const quote: StockQuote = {
      symbol,
      price,
      change,
      changePercent,
      timestamp: now,
    }

    // Update cache
    quoteCache[symbol] = { data: quote, timestamp: now }

    return quote
  } catch (error) {
    console.error(`Error creating quote for ${symbol}:`, error)
    return null
  }
}

/**
 * Get quotes for multiple symbols - simplified version
 */
export async function getBatchQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
  const result: Record<string, StockQuote> = {}

  // Process each symbol individually
  for (const symbol of symbols) {
    const quote = await getStockQuote(symbol)
    if (quote) {
      result[symbol] = quote
    }
  }

  return result
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
