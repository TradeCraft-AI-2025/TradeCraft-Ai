"use client"

import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { PortfolioHolding } from "@/lib/types"

interface PortfolioTableProps {
  portfolio: PortfolioHolding[]
  isLoading: boolean
  onRemovePosition?: (index: number) => void
}

export function PortfolioTable({ portfolio, isLoading, onRemovePosition }: PortfolioTableProps) {
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
            <TableHead className="text-right">Cost Basis</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Market Value</TableHead>
            <TableHead className="text-right">Unrealized P/L</TableHead>
            <TableHead className="text-right">P/L %</TableHead>
            {onRemovePosition && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolio.map((holding, index) => (
            <TableRow key={`${holding.symbol}-${index}`}>
              <TableCell className="font-medium">{holding.symbol}</TableCell>
              <TableCell>{holding.name}</TableCell>
              <TableCell className="text-right">{holding.quantity}</TableCell>
              <TableCell className="text-right">${holding.costBasis.toFixed(2)}</TableCell>
              <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">${(holding.quantity * holding.currentPrice).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    holding.unrealizedPL >= 0 ? "text-green-600" : "text-red-600"
                  }`}
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
              {onRemovePosition && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                    onClick={() => onRemovePosition(index)}
                    title="Remove position"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
