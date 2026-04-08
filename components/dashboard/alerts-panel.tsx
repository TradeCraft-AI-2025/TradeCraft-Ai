"use client"

import { useState } from "react"
import { BellRing, Plus, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Alert {
  id: string
  symbol: string
  type: "price" | "percentage"
  condition: "above" | "below"
  value: number
  createdAt: Date
  triggered: boolean
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState<{ type: string; condition: string; value: string; symbol: string }>({
    type: "price", condition: "above", value: "", symbol: "",
  })

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return
    setAlerts([...alerts, {
      id: `alert-${Date.now()}`,
      symbol: newAlert.symbol,
      type: newAlert.type as "price" | "percentage",
      condition: newAlert.condition as "above" | "below",
      value: Number.parseFloat(newAlert.value),
      createdAt: new Date(),
      triggered: false,
    }])
    setNewAlert({ type: "price", condition: "above", value: "", symbol: "" })
  }

  const deleteAlert = (id: string) => setAlerts(alerts.filter((a) => a.id !== id))

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-slate-100 flex items-center text-base">
          <BellRing className="mr-2 h-5 w-5 text-amber-500" />
          Price Alerts
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 bg-slate-800 hover:bg-slate-700">
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">New Alert</DialogTitle>
              <DialogDescription className="text-slate-400">
                Get notified when a price condition is met.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alert-symbol" className="text-right text-slate-400">Symbol</Label>
                <Input id="alert-symbol" placeholder="AAPL" className="col-span-3 bg-slate-800 border-slate-700 text-slate-100" value={newAlert.symbol} onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-slate-400">Type</Label>
                <Select value={newAlert.type} onValueChange={(v) => setNewAlert({ ...newAlert, type: v })}>
                  <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-slate-100"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="percentage">% Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-slate-400">When</Label>
                <Select value={newAlert.condition} onValueChange={(v) => setNewAlert({ ...newAlert, condition: v })}>
                  <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-slate-100"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-slate-400">Value</Label>
                <Input placeholder={newAlert.type === "price" ? "180.00" : "5.0"} className="col-span-3 bg-slate-800 border-slate-700 text-slate-100" value={newAlert.value} onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createAlert} className="bg-cyan-600 hover:bg-cyan-700">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-500">
            <BellRing className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">No alerts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-2 rounded-md border ${alert.triggered ? "bg-red-500/10 border-red-500/30" : "bg-slate-800/50 border-slate-700/50"}`}>
                <div className="flex items-center">
                  <div className={`p-1 rounded-full ${alert.triggered ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {alert.triggered ? <AlertTriangle className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-slate-200">{alert.symbol}</div>
                    <div className="text-xs text-slate-400">
                      {alert.type === "price" ? "Price " : "Change "}
                      {alert.condition} {alert.type === "price" ? "$" : ""}{alert.value}{alert.type === "percentage" ? "%" : ""}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => deleteAlert(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
