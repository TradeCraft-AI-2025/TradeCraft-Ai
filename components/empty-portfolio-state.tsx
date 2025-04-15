"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Plus, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface EmptyPortfolioStateProps {
  onConnect: (broker: string) => void
  onAddManualHolding: (holding: ManualHolding) => void
}

export interface ManualHolding {
  symbol: string
  name: string
  shares: number
  costBasis: number
  currentPrice?: number
  value?: number
  change?: number
}

export function EmptyPortfolioState({ onConnect, onAddManualHolding }: EmptyPortfolioStateProps) {
  const [isAddingHolding, setIsAddingHolding] = useState(false)
  const [newHolding, setNewHolding] = useState<Partial<ManualHolding>>({
    symbol: "",
    name: "",
    shares: 0,
    costBasis: 0,
  })
  const { toast } = useToast()

  const handleAddHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.costBasis) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Create the new holding
    const holding: ManualHolding = {
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || newHolding.symbol.toUpperCase(),
      shares: Number(newHolding.shares),
      costBasis: Number(newHolding.costBasis),
    }

    onAddManualHolding(holding)
    setIsAddingHolding(false)

    // Reset form
    setNewHolding({
      symbol: "",
      name: "",
      shares: 0,
      costBasis: 0,
    })

    toast({
      title: "Holding added",
      description: `${holding.symbol} has been added to your portfolio`,
    })
  }

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="h-24 w-24 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-cyan-500 opacity-70" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Portfolio Data</h3>
            <p className="text-slate-400 max-w-md">
              Track your investments by connecting your brokerage account or manually adding your holdings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Button onClick={() => onConnect("Robinhood")} className="bg-green-600 hover:bg-green-700 text-white">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Broker
            </Button>

            <Dialog open={isAddingHolding} onOpenChange={setIsAddingHolding}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manually
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle>Add Holding</DialogTitle>
                  <DialogDescription>Enter the details of your investment holding.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="symbol" className="text-right">
                      Symbol*
                    </Label>
                    <Input
                      id="symbol"
                      placeholder="AAPL"
                      className="col-span-3 bg-slate-800 border-slate-700 text-white"
                      value={newHolding.symbol}
                      onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Apple Inc."
                      className="col-span-3 bg-slate-800 border-slate-700 text-white"
                      value={newHolding.name}
                      onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shares" className="text-right">
                      Shares*
                    </Label>
                    <Input
                      id="shares"
                      type="number"
                      placeholder="10"
                      className="col-span-3 bg-slate-800 border-slate-700 text-white"
                      value={newHolding.shares || ""}
                      onChange={(e) => setNewHolding({ ...newHolding, shares: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="costBasis" className="text-right">
                      Cost Basis*
                    </Label>
                    <Input
                      id="costBasis"
                      type="number"
                      placeholder="150.00"
                      className="col-span-3 bg-slate-800 border-slate-700 text-white"
                      value={newHolding.costBasis || ""}
                      onChange={(e) => setNewHolding({ ...newHolding, costBasis: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingHolding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHolding} className="bg-cyan-600 hover:bg-cyan-700">
                    Add Holding
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            <p>Your data is stored locally and never shared with third parties.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
