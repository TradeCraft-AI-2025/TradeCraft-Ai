"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddPositionFormProps {
  onSubmit: (symbol: string, quantity: number, costBasis: number) => void
  onCancel: () => void
}

export function AddPositionForm({ onSubmit, onCancel }: AddPositionFormProps) {
  const [symbol, setSymbol] = useState("")
  const [quantity, setQuantity] = useState<number | undefined>(undefined)
  const [costBasis, setCostBasis] = useState<number | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol || !quantity || !costBasis) return
    onSubmit(symbol, quantity, costBasis)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Input
            id="symbol"
            placeholder="AAPL"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-background/80"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="10"
            value={quantity === undefined ? "" : quantity.toString()}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-background/80"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="costBasis">Cost Basis</Label>
        <Input
          id="costBasis"
          type="number"
          placeholder="150.00"
          value={costBasis === undefined ? "" : costBasis.toString()}
          onChange={(e) => setCostBasis(Number(e.target.value))}
          className="bg-background/80"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
          Add Position
        </Button>
      </div>
    </form>
  )
}
