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

export interface AuthState {
  authenticated: boolean
  broker: string | null
  token: string | null
}
