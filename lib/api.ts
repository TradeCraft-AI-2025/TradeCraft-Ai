import type { PortfolioHolding } from "./types"

/**
 * Mock function to fetch portfolio data
 */
export async function fetchPortfolioData(): Promise<PortfolioHolding[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock portfolio data
  return [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 10,
      currentPrice: 178.72,
      costBasis: 150.25,
      unrealizedPL: 284.7,
      unrealizedPLPercent: 18.95,
      dayChangePercent: 0.85,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      quantity: 5,
      currentPrice: 338.11,
      costBasis: 290.5,
      unrealizedPL: 238.05,
      unrealizedPLPercent: 16.39,
      dayChangePercent: 1.2,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      quantity: 8,
      currentPrice: 142.65,
      costBasis: 135.2,
      unrealizedPL: 59.6,
      unrealizedPLPercent: 5.51,
      dayChangePercent: 0.32,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      quantity: 12,
      currentPrice: 178.15,
      costBasis: 145.3,
      unrealizedPL: 394.2,
      unrealizedPLPercent: 22.61,
      dayChangePercent: 1.75,
    },
    {
      symbol: "TSLA",
      name: "Tesla, Inc.",
      quantity: 15,
      currentPrice: 177.8,
      costBasis: 190.25,
      unrealizedPL: -186.75,
      unrealizedPLPercent: -6.54,
      dayChangePercent: -2.1,
    },
    {
      symbol: "META",
      name: "Meta Platforms, Inc.",
      quantity: 7,
      currentPrice: 474.99,
      costBasis: 325.4,
      unrealizedPL: 1047.13,
      unrealizedPLPercent: 45.97,
      dayChangePercent: 0.95,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      quantity: 20,
      currentPrice: 950.02,
      costBasis: 450.75,
      unrealizedPL: 9985.4,
      unrealizedPLPercent: 110.76,
      dayChangePercent: 3.25,
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase & Co.",
      quantity: 18,
      currentPrice: 183.97,
      costBasis: 160.3,
      unrealizedPL: 426.06,
      unrealizedPLPercent: 14.77,
      dayChangePercent: 0.45,
    },
  ]
}
