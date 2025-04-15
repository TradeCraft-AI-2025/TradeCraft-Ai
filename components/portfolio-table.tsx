"use client"

import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PortfolioHolding } from "@/lib/types"

interface PortfolioTableProps {
  portfolio: PortfolioHolding[]
  isLoading: boolean
}

export function PortfolioTable({ portfolio, isLoading }: PortfolioTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No holdings found in your portfolio.</p>
        <p className="text-xs text-muted-foreground mt-2">
          Add holdings manually or connect your brokerage account to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">Unrealized P/L</TableHead>
            <TableHead className="text-right">P/L %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolio.map((holding) => (
            <TableRow key={holding.symbol}>
              <TableCell className="font-medium">{holding.symbol}</TableCell>
              <TableCell>{holding.name}</TableCell>
              <TableCell className="text-right">{holding.quantity}</TableCell>
              <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${(holding.quantity * holding.currentPrice).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${holding.unrealizedPL >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {holding.unrealizedPL >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}$
                  {Math.abs(holding.unrealizedPL).toFixed(2)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className={`${holding.unrealizedPLPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {holding.unrealizedPLPercent >= 0 ? "+" : ""}
                  {holding.unrealizedPLPercent.toFixed(2)}%
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
