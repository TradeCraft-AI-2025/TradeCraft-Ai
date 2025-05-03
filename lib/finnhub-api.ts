export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: number
  previousClose: number
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  try {
    // Mock API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate a random price and change for the symbol
    const price = 100 + Math.random() * 1000
    const change = (Math.random() - 0.5) * 50
    const changePercent = (change / price) * 100
    const previousClose = price - change

    const quote: StockQuote = {
      symbol,
      price,
      change,
      changePercent,
      timestamp: Date.now(),
      previousClose,
    }

    return quote
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error)
    return null
  }
}
