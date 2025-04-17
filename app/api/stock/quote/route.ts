import { NextResponse } from "next/server"

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

  return {
    symbol,
    price,
    change,
    changePercent,
    previousClose,
    timestamp: now,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const symbols = searchParams.get("symbols")

  if (symbol) {
    // Single quote request
    return NextResponse.json(createMockQuote(symbol))
  } else if (symbols) {
    // Batch quotes request
    const symbolArray = symbols.split(",")
    const quotes: Record<string, any> = {}

    symbolArray.forEach((sym) => {
      quotes[sym] = createMockQuote(sym)
    })

    return NextResponse.json(quotes)
  } else {
    return NextResponse.json({ error: "Missing symbol or symbols parameter" }, { status: 400 })
  }
}
