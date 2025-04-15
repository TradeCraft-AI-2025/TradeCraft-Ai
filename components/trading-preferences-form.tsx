"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export function TradingPreferencesForm() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState({
    defaultOrderType: "market",
    defaultTimeInForce: "day",
    riskPerTrade: [2],
    maxDrawdown: [10],
    enableStopLoss: true,
    enableTakeProfit: true,
    enableTrailingStop: false,
    confirmOrders: true,
  })

  const handleSavePreferences = () => {
    // In a real app, this would call an API to save preferences
    toast({
      title: "Preferences saved",
      description: "Your trading preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="defaultOrderType">Default Order Type</Label>
          <Select
            value={preferences.defaultOrderType}
            onValueChange={(value) => setPreferences({ ...preferences, defaultOrderType: value })}
          >
            <SelectTrigger className="bg-background/80">
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="limit">Limit</SelectItem>
              <SelectItem value="stop">Stop</SelectItem>
              <SelectItem value="stop_limit">Stop Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultTimeInForce">Default Time in Force</Label>
          <Select
            value={preferences.defaultTimeInForce}
            onValueChange={(value) => setPreferences({ ...preferences, defaultTimeInForce: value })}
          >
            <SelectTrigger className="bg-background/80">
              <SelectValue placeholder="Select time in force" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="gtc">Good Till Canceled</SelectItem>
              <SelectItem value="ioc">Immediate or Cancel</SelectItem>
              <SelectItem value="fok">Fill or Kill</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
            <span className="text-sm">{preferences.riskPerTrade}%</span>
          </div>
          <Slider
            id="riskPerTrade"
            min={0.5}
            max={10}
            step={0.5}
            value={preferences.riskPerTrade}
            onValueChange={(value) => setPreferences({ ...preferences, riskPerTrade: value })}
          />
          <p className="text-xs text-muted-foreground">Maximum percentage of your account to risk on a single trade</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
            <span className="text-sm">{preferences.maxDrawdown}%</span>
          </div>
          <Slider
            id="maxDrawdown"
            min={5}
            max={30}
            step={1}
            value={preferences.maxDrawdown}
            onValueChange={(value) => setPreferences({ ...preferences, maxDrawdown: value })}
          />
          <p className="text-xs text-muted-foreground">Maximum allowed drawdown before trading is paused</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableStopLoss">Automatic Stop Loss</Label>
            <p className="text-xs text-muted-foreground">
              Automatically set stop loss orders based on your risk settings
            </p>
          </div>
          <Switch
            id="enableStopLoss"
            checked={preferences.enableStopLoss}
            onCheckedChange={(checked) => setPreferences({ ...preferences, enableStopLoss: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableTakeProfit">Automatic Take Profit</Label>
            <p className="text-xs text-muted-foreground">
              Automatically set take profit orders based on risk/reward ratio
            </p>
          </div>
          <Switch
            id="enableTakeProfit"
            checked={preferences.enableTakeProfit}
            onCheckedChange={(checked) => setPreferences({ ...preferences, enableTakeProfit: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enableTrailingStop">Trailing Stop Loss</Label>
            <p className="text-xs text-muted-foreground">
              Use trailing stops to lock in profits as price moves in your favor
            </p>
          </div>
          <Switch
            id="enableTrailingStop"
            checked={preferences.enableTrailingStop}
            onCheckedChange={(checked) => setPreferences({ ...preferences, enableTrailingStop: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="confirmOrders">Order Confirmation</Label>
            <p className="text-xs text-muted-foreground">Show confirmation dialog before submitting orders</p>
          </div>
          <Switch
            id="confirmOrders"
            checked={preferences.confirmOrders}
            onCheckedChange={(checked) => setPreferences({ ...preferences, confirmOrders: checked })}
          />
        </div>
      </div>

      <Button onClick={handleSavePreferences} className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
        <Save className="mr-2 h-4 w-4" />
        Save Trading Preferences
      </Button>
    </div>
  )
}
