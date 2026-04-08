import type { PortfolioHolding } from "./types"

// ─── Types ──────────────────────────────────────────────────────────────────

export type Severity = "low" | "moderate" | "high"

export interface HoldingWeight {
  symbol: string
  name: string
  value: number
  weight: number
  severity: Severity
}

export interface SectorExposure {
  sector: string
  weight: number
  symbols: string[]
  severity: Severity
}

export interface RiskFlag {
  id: string
  severity: Severity
  title: string
  description: string
}

export interface PortfolioAnalysis {
  totalValue: number
  totalCost: number
  totalPL: number
  plPercent: number
  holdingCount: number
  weights: HoldingWeight[]
  sectors: SectorExposure[]
  riskFlags: RiskFlag[]
  summary: string
}

// ─── Sector mapping ─────────────────────────────────────────────────────────
// Static GICS-style mapping for common US equities. Covers the major names
// investors are likely to hold. Unknown symbols map to "Other".

const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology", MSFT: "Technology", GOOGL: "Technology", GOOG: "Technology",
  META: "Technology", NVDA: "Technology", AMD: "Technology", INTC: "Technology",
  CRM: "Technology", ADBE: "Technology", ORCL: "Technology", CSCO: "Technology",
  AVGO: "Technology", QCOM: "Technology", TXN: "Technology", IBM: "Technology",
  NOW: "Technology", SHOP: "Technology", SQ: "Technology", PLTR: "Technology",
  SNOW: "Technology", NET: "Technology", CRWD: "Technology", PANW: "Technology",
  MU: "Technology", MRVL: "Technology", KLAC: "Technology", LRCX: "Technology",
  AMAT: "Technology", SNPS: "Technology", CDNS: "Technology", MSTR: "Technology",

  AMZN: "Consumer Discretionary", TSLA: "Consumer Discretionary",
  HD: "Consumer Discretionary", MCD: "Consumer Discretionary",
  NKE: "Consumer Discretionary", SBUX: "Consumer Discretionary",
  LOW: "Consumer Discretionary", TJX: "Consumer Discretionary",
  BKNG: "Consumer Discretionary", CMG: "Consumer Discretionary",
  ABNB: "Consumer Discretionary", LULU: "Consumer Discretionary",

  AMGN: "Healthcare", JNJ: "Healthcare", UNH: "Healthcare",
  PFE: "Healthcare", ABBV: "Healthcare", MRK: "Healthcare",
  LLY: "Healthcare", TMO: "Healthcare", ABT: "Healthcare",
  DHR: "Healthcare", BMY: "Healthcare", GILD: "Healthcare",
  ISRG: "Healthcare", VRTX: "Healthcare", REGN: "Healthcare",
  MDT: "Healthcare", SYK: "Healthcare", ZTS: "Healthcare",

  JPM: "Financials", BAC: "Financials", WFC: "Financials",
  GS: "Financials", MS: "Financials", BLK: "Financials",
  C: "Financials", AXP: "Financials", SCHW: "Financials",
  V: "Financials", MA: "Financials", PYPL: "Financials",
  BRK: "Financials", "BRK.B": "Financials", "BRK.A": "Financials",
  COIN: "Financials", HOOD: "Financials",

  XOM: "Energy", CVX: "Energy", COP: "Energy",
  SLB: "Energy", EOG: "Energy", OXY: "Energy",
  MPC: "Energy", PSX: "Energy", VLO: "Energy",

  PG: "Consumer Staples", KO: "Consumer Staples", PEP: "Consumer Staples",
  WMT: "Consumer Staples", COST: "Consumer Staples",
  CL: "Consumer Staples", MDLZ: "Consumer Staples",
  PM: "Consumer Staples", MO: "Consumer Staples",

  NEE: "Utilities", DUK: "Utilities", SO: "Utilities",
  D: "Utilities", AEP: "Utilities", SRE: "Utilities",

  AMT: "Real Estate", PLD: "Real Estate", CCI: "Real Estate",
  EQIX: "Real Estate", SPG: "Real Estate", O: "Real Estate",

  CAT: "Industrials", HON: "Industrials", UNP: "Industrials",
  BA: "Industrials", RTX: "Industrials", DE: "Industrials",
  GE: "Industrials", LMT: "Industrials", UPS: "Industrials",
  FDX: "Industrials", MMM: "Industrials", WM: "Industrials",

  LIN: "Materials", APD: "Materials", SHW: "Materials",
  ECL: "Materials", NEM: "Materials", FCX: "Materials",

  T: "Communication Services", VZ: "Communication Services",
  TMUS: "Communication Services", DIS: "Communication Services",
  NFLX: "Communication Services", CMCSA: "Communication Services",
  SPOT: "Communication Services",

  // Major ETFs
  SPY: "Broad Market ETF", VOO: "Broad Market ETF", IVV: "Broad Market ETF",
  QQQ: "Tech ETF", VTI: "Broad Market ETF", VT: "Broad Market ETF",
  IWM: "Small Cap ETF", DIA: "Broad Market ETF",
  VGT: "Tech ETF", XLK: "Tech ETF", ARKK: "Tech ETF",
  VHT: "Healthcare ETF", XLV: "Healthcare ETF",
  XLF: "Financials ETF", VFH: "Financials ETF",
  XLE: "Energy ETF", VDE: "Energy ETF",
  SCHD: "Dividend ETF", VYM: "Dividend ETF", DVY: "Dividend ETF",
  BND: "Bond ETF", AGG: "Bond ETF", TLT: "Bond ETF",
  GLD: "Commodity ETF", SLV: "Commodity ETF", USO: "Commodity ETF",
}

function getSector(symbol: string): string {
  return SECTOR_MAP[symbol.toUpperCase()] ?? "Other"
}

// ─── Weight calculation ─────────────────────────────────────────────────────

function concentrationSeverity(weight: number): Severity {
  if (weight >= 35) return "high"
  if (weight >= 20) return "moderate"
  return "low"
}

function sectorSeverity(weight: number): Severity {
  if (weight >= 50) return "high"
  if (weight >= 35) return "moderate"
  return "low"
}

export function calculateWeights(holdings: PortfolioHolding[]): HoldingWeight[] {
  const totalValue = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
  if (totalValue === 0) return []

  return holdings
    .map((h) => {
      const value = h.quantity * h.currentPrice
      const weight = (value / totalValue) * 100
      return {
        symbol: h.symbol,
        name: h.name,
        value,
        weight,
        severity: concentrationSeverity(weight),
      }
    })
    .sort((a, b) => b.weight - a.weight)
}

// ─── Sector exposure ────────────────────────────────────────────────────────

export function calculateSectorExposure(holdings: PortfolioHolding[]): SectorExposure[] {
  const totalValue = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
  if (totalValue === 0) return []

  const sectorValues: Record<string, { value: number; symbols: string[] }> = {}

  for (const h of holdings) {
    const sector = getSector(h.symbol)
    const value = h.quantity * h.currentPrice
    if (!sectorValues[sector]) {
      sectorValues[sector] = { value: 0, symbols: [] }
    }
    sectorValues[sector].value += value
    sectorValues[sector].symbols.push(h.symbol)
  }

  return Object.entries(sectorValues)
    .map(([sector, { value, symbols }]) => {
      const weight = (value / totalValue) * 100
      return { sector, weight, symbols, severity: sectorSeverity(weight) }
    })
    .sort((a, b) => b.weight - a.weight)
}

// ─── Risk flags ─────────────────────────────────────────────────────────────

export function generateRiskFlags(
  weights: HoldingWeight[],
  sectors: SectorExposure[],
  holdingCount: number,
): RiskFlag[] {
  const flags: RiskFlag[] = []

  // Single-name concentration
  for (const w of weights) {
    if (w.weight >= 35) {
      flags.push({
        id: `conc-high-${w.symbol}`,
        severity: "high",
        title: `${w.symbol} is ${w.weight.toFixed(0)}% of your portfolio`,
        description: `Heavy concentration in a single holding. Consider whether this level of exposure matches your risk tolerance.`,
      })
    } else if (w.weight >= 20) {
      flags.push({
        id: `conc-mod-${w.symbol}`,
        severity: "moderate",
        title: `${w.symbol} is ${w.weight.toFixed(0)}% of your portfolio`,
        description: `Notable position size. Not necessarily a problem, but worth monitoring.`,
      })
    }
  }

  // Top-heavy check
  if (weights.length >= 3) {
    const top3Weight = weights.slice(0, 3).reduce((s, w) => s + w.weight, 0)
    if (top3Weight >= 80) {
      flags.push({
        id: "top-heavy",
        severity: "high",
        title: `Top 3 holdings are ${top3Weight.toFixed(0)}% of your portfolio`,
        description: `Your portfolio is heavily concentrated in just a few positions.`,
      })
    }
  }

  // Sector concentration
  for (const s of sectors) {
    if (s.sector === "Broad Market ETF" || s.sector === "Bond ETF") continue
    if (s.weight >= 50) {
      flags.push({
        id: `sector-high-${s.sector}`,
        severity: "high",
        title: `${s.weight.toFixed(0)}% exposure to ${s.sector}`,
        description: `Over half your portfolio is in ${s.sector}. A downturn in this sector would significantly impact your portfolio.`,
      })
    } else if (s.weight >= 35) {
      flags.push({
        id: `sector-mod-${s.sector}`,
        severity: "moderate",
        title: `${s.weight.toFixed(0)}% exposure to ${s.sector}`,
        description: `Significant tilt toward ${s.sector}. Consider whether this is intentional.`,
      })
    }
  }

  // Under-diversification
  if (holdingCount <= 2) {
    flags.push({
      id: "under-diversified",
      severity: "high",
      title: `Only ${holdingCount} holding${holdingCount === 1 ? "" : "s"}`,
      description: `Very concentrated portfolio. Most advisors suggest at least 10-20 holdings for meaningful diversification.`,
    })
  } else if (holdingCount <= 5) {
    flags.push({
      id: "low-diversification",
      severity: "moderate",
      title: `Only ${holdingCount} holdings`,
      description: `Relatively concentrated. Adding more positions across different sectors could reduce risk.`,
    })
  }

  // Sort: high first
  const order: Record<Severity, number> = { high: 0, moderate: 1, low: 2 }
  return flags.sort((a, b) => order[a.severity] - order[b.severity])
}

// ─── Plain-English summary ──────────────────────────────────────────────────

function formatUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(0)}`
}

export function generateSummary(
  totalValue: number,
  totalCost: number,
  weights: HoldingWeight[],
  sectors: SectorExposure[],
): string {
  const count = weights.length
  const pl = totalValue - totalCost
  const plPct = totalCost > 0 ? (pl / totalCost) * 100 : 0

  const parts: string[] = []

  // Portfolio size
  parts.push(`Your portfolio has ${count} holding${count !== 1 ? "s" : ""} worth ${formatUSD(totalValue)}.`)

  // P/L
  if (totalCost > 0) {
    const direction = pl >= 0 ? "up" : "down"
    parts.push(`Overall you're ${direction} ${formatUSD(Math.abs(pl))} (${plPct >= 0 ? "+" : ""}${plPct.toFixed(1)}%).`)
  }

  // Concentration
  if (weights.length > 0) {
    const top = weights[0]
    if (top.weight >= 35) {
      parts.push(`It's heavily concentrated — ${top.symbol} alone is ${top.weight.toFixed(0)}% of the total.`)
    } else if (top.weight >= 20) {
      parts.push(`It's moderately concentrated — your largest position (${top.symbol}) is ${top.weight.toFixed(0)}%.`)
    } else {
      parts.push(`Concentration looks reasonable — no single holding exceeds 20%.`)
    }
  }

  // Sector tilt
  if (sectors.length > 0) {
    const topSector = sectors[0]
    if (topSector.weight >= 50) {
      parts.push(`${topSector.weight.toFixed(0)}% is in ${topSector.sector}, which is a significant tilt.`)
    } else if (topSector.weight >= 35) {
      parts.push(`${topSector.sector} is your largest sector at ${topSector.weight.toFixed(0)}%.`)
    } else {
      parts.push(`Sector exposure is relatively balanced across ${sectors.length} sectors.`)
    }
  }

  return parts.join(" ")
}

// ─── Main analysis entry point ──────────────────────────────────────────────

export function analyzePortfolio(holdings: PortfolioHolding[]): PortfolioAnalysis {
  const totalValue = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
  const totalCost = holdings.reduce((s, h) => s + h.quantity * h.costBasis, 0)
  const totalPL = totalValue - totalCost
  const plPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0

  const weights = calculateWeights(holdings)
  const sectors = calculateSectorExposure(holdings)
  const riskFlags = generateRiskFlags(weights, sectors, holdings.length)
  const summary = generateSummary(totalValue, totalCost, weights, sectors)

  return {
    totalValue,
    totalCost,
    totalPL,
    plPercent,
    holdingCount: holdings.length,
    weights,
    sectors,
    riskFlags,
    summary,
  }
}
