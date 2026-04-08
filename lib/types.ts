export interface PortfolioHolding {
  symbol: string
  name: string
  quantity: number
  currentPrice: number
  costBasis: number
  unrealizedPL: number
  unrealizedPLPercent: number
  dayChangePercent: number
}
