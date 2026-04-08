"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  BarChart3,
  BellRing,
  Globe,
  Hexagon,
  LineChart,
  type LucideIcon,
  MessageSquare,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  ArrowRight,
  AlertTriangle,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"
import type { PortfolioHolding } from "@/lib/types"

interface PortfolioData {
  totalValue: number
  totalCost: number
  changePercent: number
  positions: { symbol: string; name: string; shares: number; price: number; value: number; change: number }[]
}

interface Alert {
  id: string
  symbol: string
  type: "price" | "percentage"
  condition: "above" | "below"
  value: number
  createdAt: Date
  triggered: boolean
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    type: "price",
    condition: "above",
    value: "",
    symbol: "",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setIsLoading(false); return }

        const { data, error } = await supabase
          .from("portfolios")
          .select("holdings")
          .eq("user_id", user.id)
          .single()

        if (!error && data) {
          const holdings = data.holdings as PortfolioHolding[]
          if (holdings && holdings.length > 0) {
            const totalValue = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0)
            const totalCost = holdings.reduce((sum, h) => sum + h.quantity * h.costBasis, 0)
            const changePercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
            setPortfolio({
              totalValue,
              totalCost,
              changePercent,
              positions: holdings.map((h) => ({
                symbol: h.symbol,
                name: h.name,
                shares: h.quantity,
                price: h.currentPrice,
                value: h.quantity * h.currentPrice,
                change: h.dayChangePercent,
              })),
            })
          }
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return
    setAlerts([...alerts, {
      id: `alert-${Date.now()}`,
      symbol: newAlert.symbol,
      type: newAlert.type as "price" | "percentage",
      condition: newAlert.condition as "above" | "below",
      value: Number.parseFloat(newAlert.value as string),
      createdAt: new Date(),
      triggered: false,
    }])
    setNewAlert({ type: "price", condition: "above", value: "", symbol: "" })
  }

  const deleteAlert = (id: string) => setAlerts(alerts.filter((a) => a.id !== id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading overview...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4 bg-slate-900/90 border border-slate-700/50 rounded-lg p-8">
          <Wallet className="h-12 w-12 text-slate-500 mx-auto" />
          <p className="text-lg text-slate-200">No holdings yet</p>
          <p className="text-sm text-slate-400">Add positions to your portfolio to see your overview here.</p>
          <Link href="/portfolio">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              Go to Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TradeCraft
            </span>
          </div>
          <div className="text-sm text-slate-400 font-mono">{formatTime(currentTime)} · {formatDate(currentTime)}</div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={BarChart3} label="Overview" active />
                  <NavItem icon={LineChart} label="Portfolio" />
                  <NavItem icon={Shield} label="Risk" />
                  <NavItem icon={Globe} label="Market Context" />
                  <NavItem icon={MessageSquare} label="News" />
                  <NavItem icon={BellRing} label="Alerts" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-slate-500 font-mono">PORTFOLIO DATA</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Loaded</Badge>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{portfolio.positions.length} holdings tracked</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* Portfolio summary */}
              <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <LineChart className="mr-2 h-5 w-5 text-cyan-500" />
                      Portfolio Overview
                    </CardTitle>
                    <Link href="/portfolio">
                      <Button variant="ghost" size="sm" className="text-slate-400 text-xs">
                        View holdings <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard
                      label="Total Value"
                      value={formatCurrency(portfolio.totalValue)}
                      sub={`${portfolio.changePercent >= 0 ? "+" : ""}${portfolio.changePercent.toFixed(2)}% overall`}
                      positive={portfolio.changePercent >= 0}
                    />
                    <SummaryCard
                      label="Total Cost"
                      value={formatCurrency(portfolio.totalCost)}
                      sub={`${portfolio.positions.length} positions`}
                    />
                    <SummaryCard
                      label="P/L"
                      value={formatCurrency(portfolio.totalValue - portfolio.totalCost)}
                      sub={`${portfolio.changePercent >= 0 ? "+" : ""}${portfolio.changePercent.toFixed(2)}%`}
                      positive={portfolio.totalValue >= portfolio.totalCost}
                    />
                  </div>

                  {/* Holdings list */}
                  <div className="mt-6">
                    <h3 className="text-sm text-slate-400 mb-3">Holdings</h3>
                    <div className="space-y-2">
                      {portfolio.positions.map((p) => (
                        <div key={p.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                          <div>
                            <div className="text-sm font-medium text-slate-200">{p.symbol}</div>
                            <div className="text-xs text-slate-500">{p.shares} shares · {p.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-200">{formatCurrency(p.value)}</div>
                            <div className={`text-xs ${p.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concentration */}
                  <div className="mt-6">
                    <h3 className="text-sm text-slate-400 mb-3">Concentration</h3>
                    <div className="space-y-3">
                      {portfolio.positions.map((p) => {
                        const pct = (p.value / portfolio.totalValue) * 100
                        return (
                          <div key={p.symbol}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-300">{p.symbol}</span>
                              <span className="text-slate-400">{pct.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk + Alerts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <Shield className="mr-2 h-5 w-5 text-green-500" />
                      Risk Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <RiskRow label="Concentration Risk" level={portfolio.positions.length <= 3 ? "High" : portfolio.positions.length <= 6 ? "Moderate" : "Low"} />
                      <RiskRow label="Sector Diversification" level="Moderate" />
                      <RiskRow label="Volatility Exposure" level="Moderate" />
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-700/50">
                        Risk assessment is illustrative during the beta.
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            <Label htmlFor="symbol" className="text-right text-slate-400">Symbol</Label>
                            <Input id="symbol" placeholder="AAPL" className="col-span-3 bg-slate-800 border-slate-700 text-slate-100" value={newAlert.symbol} onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })} />
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
              </div>

              {/* Market context */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Market Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <NewsItem label="Market" text="Tech sector showing strength after positive earnings from major players." />
                    <NewsItem label="Insight" text="Rising momentum in large-cap tech may affect portfolio concentration." />
                    <NewsItem label="Macro" text="Federal Reserve signals potential rate cut in upcoming meeting." />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <div className="text-xs text-slate-500">Market context is illustrative during the beta.</div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <PrefRow icon={BellRing} label="Price Alerts" defaultOn />
                    <PrefRow icon={Shield} label="Risk Notifications" defaultOn />
                    <PrefRow icon={MessageSquare} label="Daily Brief" />
                    <PrefRow icon={RefreshCw} label="Auto-refresh Data" defaultOn />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---- Sub-components ---- */

function SummaryCard({ label, value, sub, positive }: { label: string; value: string; sub: string; positive?: boolean }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-2xl font-mono text-slate-100">{value}</div>
        <div className={`text-xs mt-1 ${positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-slate-400"}`}>{sub}</div>
      </CardContent>
    </Card>
  )
}

function RiskRow({ label, level }: { label: string; level: "Low" | "Moderate" | "High" }) {
  const colors = { Low: "bg-green-500/20 text-green-400 border-green-500/50", Moderate: "bg-amber-500/20 text-amber-400 border-amber-500/50", High: "bg-red-500/20 text-red-400 border-red-500/50" }
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-400">{label}</div>
      <Badge className={colors[level]}>{level}</Badge>
    </div>
  )
}

function NewsItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs">{label.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-xs font-medium text-slate-300">{label}</div>
        <div className="text-sm text-slate-400">{text}</div>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <Button variant="ghost" className={`w-full justify-start ${active ? "bg-slate-800 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}>
      <Icon className="h-4 w-4 mr-2" /> {label}
    </Button>
  )
}

function PrefRow({ icon: Icon, label, defaultOn }: { icon: LucideIcon; label: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="text-cyan-500 mr-2 h-4 w-4" />
        <Label className="text-sm text-slate-400">{label}</Label>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  )
}
