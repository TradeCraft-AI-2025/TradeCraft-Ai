import { NextResponse } from "next/server"

// API endpoints for market data
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "sandbox_c7c3j0qad3iefuoamu60"
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo"

// Mock data for common stocks to use as fallback
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

// Cache to store quotes and reduce API calls
const quoteCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 minute cache

// Track API calls to avoid rate limits
const apiCallTimestamps: { finnhub: number[]; alphaVantage: number[] } = {
  finnhub: [],
  alphaVantage: [],
}

// Rate limits (calls per minute)
const RATE_LIMITS = {
  finnhub: 30,
  alphaVantage: 5,
}

/**
 * Check if we're approaching API rate limits
 */
function isRateLimited(api: "finnhub" | "alphaVantage"): boolean {
  const now = Date.now()
  const oneMinuteAgo = now - 60000

  // Remove timestamps older than 1 minute
  apiCallTimestamps[api] = apiCallTimestamps[api].filter((timestamp) => timestamp > oneMinuteAgo)

  // Check if we're at or near the rate limit
  return apiCallTimestamps[api].length >= RATE_LIMITS[api]
}

/**
 * Record an API call
 */
function recordApiCall(api: "finnhub" | "alphaVantage"): void {
  apiCallTimestamps[api].push(Date.now())
}

/**
 * Create a mock quote for a symbol
 */
function createMockQuote(symbol: string) {
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

  const quote = {
    symbol,
    price,
    change,
    changePercent,
    previousClose,
    timestamp: now,
  }

  // Cache the mock data with a shorter expiration
  quoteCache[symbol] = { data: quote, timestamp: now - CACHE_DURATION / 2 }

  console.log(`Created mock quote for ${symbol}:`, quote)
  return quote
}

/**
 * Fallback to Alpha Vantage if Finnhub fails
 */
async function getAlphaVantageQuote(symbol: string) {
  try {
    recordApiCall("alphaVantage")
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
      },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`Alpha Vantage API returned status ${response.status} for ${symbol}`)
      return null
    }

    const data = await response.json()

    // Check for API limit message or error responses
    if (data.Note || data["Information"] || data["Error Message"]) {
      console.warn("Alpha Vantage API issue:", data.Note || data["Information"] || data["Error Message"])
      return null
    }

    const globalQuote = data["Global Quote"]

    // More robust validation
    if (!globalQuote) {
      console.warn("Missing Global Quote data from Alpha Vantage for", symbol)
      return null
    }

    if (!globalQuote["05. price"] || !globalQuote["10. change percent"]) {
      console.warn("Invalid data structure from Alpha Vantage for", symbol)
      return null
    }

    // Parse values with error handling
    let price = 0
    let change = 0
    let changePercent = 0

    try {
      price = Number.parseFloat(globalQuote["05. price"])
      change = Number.parseFloat(globalQuote["09. change"] || "0")
      changePercent = Number.parseFloat((globalQuote["10. change percent"] || "0").replace("%", ""))
    } catch (parseError) {
      console.error("Error parsing Alpha Vantage data:", parseError)
      return null
    }

    // Validate parsed values
    if (isNaN(price) || price === 0) {
      console.warn("Invalid price from Alpha Vantage for", symbol)
      return null
    }

    const quote = {
      symbol,
      price,
      change,
      changePercent,
      previousClose: price - change,
      timestamp: Date.now(),
    }

    return quote
  } catch (error) {
    console.error(`Error fetching Alpha Vantage quote for ${symbol}:`, error)
    return null
  }
}

/**
 * Get real-time stock quote using Finnhub API with fallback to Alpha Vantage
 */
async function getStockQuote(symbol: string) {
  try {
    // Check cache first
    const now = Date.now()
    if (quoteCache[symbol] && now - quoteCache[symbol].timestamp < CACHE_DURATION) {
      return quoteCache[symbol].data
    }

    // Try Finnhub API first if not rate limited
    if (!isRateLimited("finnhub")) {
      try {
        recordApiCall("finnhub")
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Finnhub API returned status ${response.status}`)
        }

        const data = await response.json()

        // Check if we got valid data
        if (data.c === 0 && data.pc === 0) {
          throw new Error("Invalid data received from Finnhub")
        }

        // Format the response
        const quote = {
          symbol,
          price: data.c || 0,
          change: (data.c || 0) - (data.pc || 0),
          changePercent: data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0,
          previousClose: data.pc || 0,
          open: data.o || 0,
          high: data.h || 0,
          low: data.l || 0,
          timestamp: data.t ? data.t * 1000 : now, // Convert to milliseconds
        }

        // Update cache
        quoteCache[symbol] = { data: quote, timestamp: now }

        return quote
      } catch (finnhubError) {
        console.warn(`Finnhub API error for ${symbol}:`, finnhubError)
        // Continue to Alpha Vantage fallback
      }
    } else {
      console.warn("Finnhub API rate limit reached, skipping request")
    }

    // Try Alpha Vantage as fallback if not rate limited
    if (!isRateLimited("alphaVantage")) {
      try {
        const alphaVantageQuote = await getAlphaVantageQuote(symbol)
        if (alphaVantageQuote) {
          // Update cache
          quoteCache[symbol] = { data: alphaVantageQuote, timestamp: now }
          return alphaVantageQuote
        }
      } catch (alphaVantageError) {
        console.warn(`Alpha Vantage API error for ${symbol}:`, alphaVantageError)
        // Continue to fallbacks
      }
    } else {
      console.warn("Alpha Vantage API rate limit reached, skipping request")
    }

    // If we have a cached quote, return it even if it's expired
    if (quoteCache[symbol]) {
      console.warn(`Using expired cache for ${symbol}`)
      return quoteCache[symbol].data
    }

    // Both APIs failed or rate limited and no cache, create a mock quote
    return createMockQuote(symbol)
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)

    // If we have a cached quote, return it even if it's expired
    if (quoteCache[symbol]) {
      console.warn(`Using expired cache for ${symbol}`)
      return quoteCache[symbol].data
    }

    // Last resort: return mock data
    return createMockQuote(symbol)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const symbols = searchParams.get("symbols")

  if (symbol) {
    // Single quote request
    try {
      const quote = await getStockQuote(symbol)
      return NextResponse.json(quote)
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 })
    }
  } else if (symbols) {
    // Batch quotes request
    try {
      const symbolArray = symbols.split(",")
      const quotes: Record<string, any> = {}

      // Process in smaller batches to avoid rate limits
      const batchSize = 2
      const batches = []

      for (let i = 0; i < symbolArray.length; i += batchSize) {
        batches.push(symbolArray.slice(i, i + batchSize))
      }

      for (const batch of batches) {
        // Use Promise.allSettled to handle partial failures
        const results = await Promise.allSettled(batch.map((sym) => getStockQuote(sym)))

        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            quotes[batch[index]] = result.value
          } else if (result.status === "rejected") {
            console.error(`Failed to get quote for ${batch[index]}:`, result.reason)
            // Create a mock quote for failed symbols
            quotes[batch[index]] = createMockQuote(batch[index])
          }
        })

        // Increased delay between batches to avoid rate limits
        if (batches.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      return NextResponse.json(quotes)
    } catch (error) {
      console.error(`Error fetching batch quotes:`, error)
      return NextResponse.json({ error: "Failed to fetch batch quotes" }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Missing symbol or symbols parameter" }, { status: 400 })
  }
}
