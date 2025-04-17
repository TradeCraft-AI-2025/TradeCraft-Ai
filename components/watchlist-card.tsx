"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export function WatchlistCard() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // Simulate API call with mock data
        const mockStocks: Stock[] = [
          { symbol: "AAPL", name: "Apple Inc.", price: 173.75, change: 2.35, changePercent: 1.37 },
          { symbol: "MSFT", name: "Microsoft Corp.", price: 338.11, change: -0.89, changePercent: -0.26 },
          { symbol: "GOOGL", name: "Alphabet Inc.", price: 125.3, change: 1.56, changePercent: 1.26 },
          { symbol: "AMZN", name: "Amazon.com Inc.", price: 127.74, change: -0.45, changePercent: -0.35 },
          { symbol: "TSLA", name: "Tesla Inc.", price: 243.84, change: 4.28, changePercent: 1.79 },
        ]

        setStocks(mockStocks)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching watchlist:", err)
        setError("Failed to load watchlist data")
        setLoading(false)
      }
    }

    fetchStocks()
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Track your favorite stocks</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">{error}</div>
        ) : (
          <div className="max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Symbol</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-4 w-16 ml-auto" />
                          </TableCell>
                        </TableRow>
                      ))
                  : stocks.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell className="hidden md:table-cell">{stock.name}</TableCell>
                        <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={stock.change >= 0 ? "success" : "destructive"} className="ml-auto">
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
