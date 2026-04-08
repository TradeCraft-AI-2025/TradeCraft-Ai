import type { PortfolioHolding } from "./types"

export interface CsvImportResult {
  holdings: PortfolioHolding[]
  skipped: string[]
  total: number
}

const SYMBOL_ALIASES = ["symbol", "ticker", "stock", "sym"]
const QUANTITY_ALIASES = ["quantity", "shares", "qty", "amount", "units"]
const COST_ALIASES = ["cost basis", "cost_basis", "costbasis", "avg cost", "avg_cost", "avgcost", "average cost", "average_cost", "price paid", "purchase price", "cost"]

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9 _]/g, "")
}

function findColumn(headers: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const idx = headers.findIndex((h) => normalizeHeader(h) === alias)
    if (idx !== -1) return idx
  }
  return -1
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "")
  if (!cleaned) return null
  const num = Number(cleaned)
  return Number.isFinite(num) && num > 0 ? num : null
}

export function parsePortfolioCsv(csvText: string): CsvImportResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) {
    return { holdings: [], skipped: ["File has no data rows"], total: 0 }
  }

  const headers = parseCsvLine(lines[0])
  const symbolIdx = findColumn(headers, SYMBOL_ALIASES)
  const quantityIdx = findColumn(headers, QUANTITY_ALIASES)
  const costIdx = findColumn(headers, COST_ALIASES)

  if (symbolIdx === -1) {
    return { holdings: [], skipped: ["Could not find a Symbol column. Expected: symbol, ticker, or stock."], total: 0 }
  }
  if (quantityIdx === -1) {
    return { holdings: [], skipped: ["Could not find a Quantity column. Expected: quantity, shares, or qty."], total: 0 }
  }
  if (costIdx === -1) {
    return { holdings: [], skipped: ["Could not find a Cost Basis column. Expected: cost basis, avg cost, or cost."], total: 0 }
  }

  const holdings: PortfolioHolding[] = []
  const skipped: string[] = []
  const dataRows = lines.slice(1)

  for (let i = 0; i < dataRows.length; i++) {
    const fields = parseCsvLine(dataRows[i])
    const symbol = fields[symbolIdx]?.trim().toUpperCase()
    const quantity = parseNumber(fields[quantityIdx] ?? "")
    const costBasis = parseNumber(fields[costIdx] ?? "")

    if (!symbol || !/^[A-Z.]{1,10}$/.test(symbol)) {
      skipped.push(`Row ${i + 2}: invalid symbol "${fields[symbolIdx] ?? ""}"`)
      continue
    }
    if (quantity === null) {
      skipped.push(`Row ${i + 2}: invalid quantity for ${symbol}`)
      continue
    }
    if (costBasis === null) {
      skipped.push(`Row ${i + 2}: invalid cost basis for ${symbol}`)
      continue
    }

    holdings.push({
      symbol,
      name: symbol,
      quantity,
      costBasis,
      currentPrice: costBasis,
      unrealizedPL: 0,
      unrealizedPLPercent: 0,
      dayChangePercent: 0,
    })
  }

  return { holdings, skipped, total: dataRows.length }
}
