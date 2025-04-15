"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  BarChart3,
  Bell,
  CircleOff,
  Download,
  Globe,
  Hexagon,
  LineChart,
  Lock,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Zap,
  BellRing,
  Wallet,
  Plus,
  Trash2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
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

// Replace the Dashboard component with this updated version that includes Robinhood integration and alerts
export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [systemStatus, setSystemStatus] = useState(85)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [securityLevel, setSecurityLevel] = useState(75)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isConnectedToRobinhood, setIsConnectedToRobinhood] = useState(false)
  const [robinhoodData, setRobinhoodData] = useState<RobinhoodData | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    type: "price",
    condition: "above",
    value: "",
    symbol: "",
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setMemoryUsage(Math.floor(Math.random() * 20) + 60)
      setNetworkStatus(Math.floor(Math.random() * 15) + 80)
      setSystemStatus(Math.floor(Math.random() * 10) + 80)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Connect to Robinhood (mock implementation)
  const connectToRobinhood = () => {
    setIsLoading(true)

    // Simulate API call to Robinhood
    setTimeout(() => {
      // Mock Robinhood data
      const mockRobinhoodData: RobinhoodData = {
        portfolio: {
          value: 124568.42,
          change: 2.3,
          cash: 15642.18,
        },
        positions: [
          { symbol: "AAPL", name: "Apple Inc.", shares: 150, price: 178.25, value: 26737.5, change: 1.2 },
          { symbol: "TSLA", name: "Tesla Inc.", shares: 50, price: 242.68, value: 12134.0, change: -0.8 },
          { symbol: "NVDA", name: "NVIDIA Corp.", shares: 75, price: 124.56, value: 9342.0, change: 3.5 },
          { symbol: "MSFT", name: "Microsoft Corp.", shares: 60, price: 415.32, value: 24919.2, change: 0.5 },
          { symbol: "AMZN", name: "Amazon.com Inc.", shares: 40, price: 178.92, value: 7156.8, change: 1.8 },
          { symbol: "GOOGL", name: "Alphabet Inc.", shares: 30, price: 142.38, value: 4271.4, change: 0.3 },
        ],
        recentTrades: [
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            type: "BUY",
            price: 178.25,
            shares: 10,
            time: "14:32",
            status: "filled",
          },
          {
            symbol: "TSLA",
            name: "Tesla Inc.",
            type: "SELL",
            price: 242.68,
            shares: 5,
            time: "14:28",
            status: "filled",
          },
          {
            symbol: "NVDA",
            name: "NVIDIA Corp.",
            type: "BUY",
            price: 124.56,
            shares: 20,
            time: "13:45",
            status: "filled",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corp.",
            type: "BUY",
            price: 415.32,
            shares: 8,
            time: "13:12",
            status: "filled",
          },
          {
            symbol: "AMZN",
            name: "Amazon.com Inc.",
            type: "SELL",
            price: 178.92,
            shares: 15,
            time: "11:30",
            status: "filled",
          },
          {
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            type: "BUY",
            price: 142.38,
            shares: 12,
            time: "10:15",
            status: "filled",
          },
        ],
        watchlist: [
          { symbol: "META", name: "Meta Platforms Inc.", price: 325.68, change: 2.1 },
          { symbol: "NFLX", name: "Netflix Inc.", price: 612.35, change: -0.7 },
          { symbol: "DIS", name: "Walt Disney Co.", price: 112.48, change: 0.5 },
          { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 62.35, change: -1.2 },
        ],
      }

      setRobinhoodData(mockRobinhoodData)
      setIsConnectedToRobinhood(true)
      setIsLoading(false)
    }, 2000)
  }

  // Create a new alert
  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      symbol: newAlert.symbol,
      type: newAlert.type as "price" | "percentage",
      condition: newAlert.condition as "above" | "below",
      value: Number.parseFloat(newAlert.value as string),
      createdAt: new Date(),
      triggered: false,
    }

    setAlerts([...alerts, alert])
    setNewAlert({
      type: "price",
      condition: "above",
      value: "",
      symbol: "",
    })
  }

  // Delete an alert
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">SYSTEM INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              QUANTUM TRADE
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      {alerts.filter((a) => a.triggered).length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                          {alerts.filter((a) => a.triggered).length}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alerts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={BarChart3} label="Markets" active />
                  <NavItem icon={LineChart} label="Portfolio" />
                  <NavItem icon={Activity} label="Trading" />
                  <NavItem icon={Globe} label="Global Markets" />
                  <NavItem icon={Shield} label="Risk Analysis" />
                  <NavItem icon={Zap} label="Quick Trade" />
                  <NavItem icon={MessageSquare} label="News & Signals" />
                  <NavItem icon={BellRing} label="Alerts" />
                  <NavItem icon={Settings} label="Settings" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM STATUS</div>
                  <div className="space-y-3">
                    <StatusItem label="Market Status" value={systemStatus} color="cyan" />
                    <StatusItem label="Portfolio Health" value={securityLevel} color="green" />
                    <StatusItem label="Trading Activity" value={networkStatus} color="blue" />
                  </div>
                </div>

                {/* Robinhood Connection Status */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-slate-500 font-mono">ROBINHOOD</div>
                    {isConnectedToRobinhood ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Connected</Badge>
                    ) : (
                      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">Disconnected</Badge>
                    )}
                  </div>
                  {!isConnectedToRobinhood && (
                    <Button
                      onClick={connectToRobinhood}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Account
                    </Button>
                  )}
                  {isConnectedToRobinhood && (
                    <div className="text-xs text-slate-400 mt-1">Last synced: {formatTime(new Date())}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* System overview */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      {isConnectedToRobinhood ? "Robinhood Portfolio" : "Market Overview"}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                        LIVE
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isConnectedToRobinhood && robinhoodData ? (
                      <>
                        <MetricCard
                          title="Portfolio Value"
                          value={robinhoodData.portfolio.change}
                          icon={LineChart}
                          trend={robinhoodData.portfolio.change > 0 ? "up" : "down"}
                          color="cyan"
                          detail={`$${robinhoodData.portfolio.value.toLocaleString()} | ${robinhoodData.portfolio.change > 0 ? "+" : ""}${robinhoodData.portfolio.change}%`}
                        />
                        <MetricCard
                          title="Cash Balance"
                          value={Math.round((robinhoodData.portfolio.cash / robinhoodData.portfolio.value) * 100)}
                          icon={Wallet}
                          trend="stable"
                          color="purple"
                          detail={`$${robinhoodData.portfolio.cash.toLocaleString()}`}
                        />
                        <MetricCard
                          title="Trading Activity"
                          value={networkStatus}
                          icon={BarChart3}
                          trend="down"
                          color="blue"
                          detail={`${robinhoodData.recentTrades.length} trades today`}
                        />
                      </>
                    ) : (
                      <>
                        <MetricCard
                          title="Market Volatility"
                          value={cpuUsage}
                          icon={Activity}
                          trend="up"
                          color="cyan"
                          detail="VIX 24.8 | +2.3%"
                        />
                        <MetricCard
                          title="Portfolio Value"
                          value={memoryUsage}
                          icon={LineChart}
                          trend="stable"
                          color="purple"
                          detail="$124,568.42 | +0.8%"
                        />
                        <MetricCard
                          title="Trading Volume"
                          value={networkStatus}
                          icon={BarChart3}
                          trend="down"
                          color="blue"
                          detail="$1.2M | 42 trades"
                        />
                      </>
                    )}
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="performance" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="performance"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Price Charts
                          </TabsTrigger>
                          <TabsTrigger
                            value="processes"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            {isConnectedToRobinhood ? "Recent Trades" : "Market Activity"}
                          </TabsTrigger>
                          <TabsTrigger
                            value="storage"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Portfolio
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                            S&P 500
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            NASDAQ
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Portfolio
                          </div>
                        </div>
                      </div>

                      <TabsContent value="performance" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <PerformanceChart />
                          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                            <div className="text-xs text-slate-400">Market Trend</div>
                            <div className="text-lg font-mono text-cyan-400">+{cpuUsage / 10}%</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="processes" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <div className="col-span-1">Time</div>
                            <div className="col-span-4">Asset</div>
                            <div className="col-span-2">Type</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-1">Status</div>
                          </div>

                          <div className="divide-y divide-slate-700/30">
                            {isConnectedToRobinhood && robinhoodData ? (
                              robinhoodData.recentTrades.map((trade, index) => (
                                <ProcessRow
                                  key={index}
                                  pid={trade.time}
                                  name={`${trade.symbol} - ${trade.name}`}
                                  user={trade.type}
                                  cpu={trade.price}
                                  memory={trade.shares}
                                  status={trade.status}
                                />
                              ))
                            ) : (
                              <>
                                <ProcessRow
                                  pid="14:32"
                                  name="AAPL - Apple Inc."
                                  user="BUY"
                                  cpu={178.25}
                                  memory={10}
                                  status="filled"
                                />
                                <ProcessRow
                                  pid="14:28"
                                  name="TSLA - Tesla Inc."
                                  user="SELL"
                                  cpu={242.68}
                                  memory={5}
                                  status="filled"
                                />
                                <ProcessRow
                                  pid="13:45"
                                  name="NVDA - NVIDIA Corp."
                                  user="BUY"
                                  cpu={124.56}
                                  memory={20}
                                  status="filled"
                                />
                                <ProcessRow
                                  pid="13:12"
                                  name="MSFT - Microsoft Corp."
                                  user="BUY"
                                  cpu={415.32}
                                  memory={8}
                                  status="filled"
                                />
                                <ProcessRow
                                  pid="11:30"
                                  name="AMZN - Amazon.com Inc."
                                  user="SELL"
                                  cpu={178.92}
                                  memory={15}
                                  status="filled"
                                />
                                <ProcessRow
                                  pid="10:15"
                                  name="GOOGL - Alphabet Inc."
                                  user="BUY"
                                  cpu={142.38}
                                  memory={12}
                                  status="filled"
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="storage" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          {isConnectedToRobinhood && robinhoodData ? (
                            <div className="grid grid-cols-1 gap-4">
                              {robinhoodData.positions.map((position, index) => (
                                <div key={index} className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <div className="text-sm text-slate-300 font-medium">{position.symbol}</div>
                                      <div className="text-xs text-slate-500 ml-2">{position.name}</div>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        position.change > 0
                                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                                          : "bg-red-500/10 text-red-400 border-red-500/30"
                                      } text-xs`}
                                    >
                                      {position.change > 0 ? "+" : ""}
                                      {position.change}%
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-slate-500">
                                      {position.shares} shares @ ${position.price.toFixed(2)}
                                    </div>
                                    <div className="text-sm font-medium text-slate-200">
                                      ${position.value.toLocaleString()}
                                    </div>
                                  </div>
                                  <Progress
                                    value={(position.value / robinhoodData.portfolio.value) * 100}
                                    className="h-1.5 bg-slate-700"
                                  >
                                    <div
                                      className={`h-full rounded-full ${
                                        position.change > 0 ? "bg-green-500" : "bg-red-500"
                                      }`}
                                      style={{ width: `${(position.value / robinhoodData.portfolio.value) * 100}%` }}
                                    />
                                  </Progress>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <StorageItem name="US Equities" total={100} used={42} type="Stocks" />
                              <StorageItem name="Crypto Assets" total={100} used={28} type="Crypto" />
                              <StorageItem name="Fixed Income" total={100} used={15} type="Bonds" />
                              <StorageItem name="Cash Reserve" total={100} used={15} type="Cash" />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts & Risk Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <Shield className="mr-2 h-5 w-5 text-green-500" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Volatility Protection</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Stop Loss Orders</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Diversification</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Market Analysis</div>
                        <div className="text-sm text-cyan-400">
                          Updated <span className="text-slate-500">12 min ago</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Portfolio Safety</div>
                          <div className="text-sm text-cyan-400">{securityLevel}%</div>
                        </div>
                        <Progress value={securityLevel} className="h-2 bg-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                            style={{ width: `${securityLevel}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <BellRing className="mr-2 h-5 w-5 text-amber-500" />
                      Price Alerts
                    </CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="h-8 bg-slate-800 hover:bg-slate-700">
                          <Plus className="h-4 w-4 mr-1" /> New Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-slate-100">Create New Alert</DialogTitle>
                          <DialogDescription className="text-slate-400">
                            Set up a price or percentage change alert for any asset.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="symbol" className="text-right text-slate-400">
                              Symbol
                            </Label>
                            <Input
                              id="symbol"
                              placeholder="AAPL"
                              className="col-span-3 bg-slate-800 border-slate-700 text-slate-100"
                              value={newAlert.symbol}
                              onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right text-slate-400">
                              Type
                            </Label>
                            <Select
                              value={newAlert.type}
                              onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}
                            >
                              <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                <SelectItem value="price">Price</SelectItem>
                                <SelectItem value="percentage">Percentage Change</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="condition" className="text-right text-slate-400">
                              Condition
                            </Label>
                            <Select
                              value={newAlert.condition}
                              onValueChange={(value) => setNewAlert({ ...newAlert, condition: value })}
                            >
                              <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                <SelectItem value="above">Above</SelectItem>
                                <SelectItem value="below">Below</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right text-slate-400">
                              Value
                            </Label>
                            <Input
                              id="value"
                              placeholder={newAlert.type === "price" ? "180.00" : "5.0"}
                              className="col-span-3 bg-slate-800 border-slate-700 text-slate-100"
                              value={newAlert.value}
                              onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={createAlert} className="bg-cyan-600 hover:bg-cyan-700">
                            Create Alert
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {alerts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                        <BellRing className="h-12 w-12 mb-2 opacity-20" />
                        <p className="text-sm">No alerts configured</p>
                        <p className="text-xs mt-1">Create an alert to get notified of price changes</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={`flex items-center justify-between p-2 rounded-md border ${
                              alert.triggered
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-slate-800/50 border-slate-700/50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`p-1 rounded-full ${
                                  alert.triggered ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {alert.triggered ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : (
                                  <BellRing className="h-4 w-4" />
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-slate-200">{alert.symbol}</div>
                                <div className="text-xs text-slate-400">
                                  {alert.type === "price" ? "Price " : "Change "}
                                  {alert.condition === "above" ? "above " : "below "}
                                  {alert.type === "price" ? "$" : ""}
                                  {alert.value}
                                  {alert.type === "percentage" ? "%" : ""}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-100"
                              onClick={() => deleteAlert(alert.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Communications */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Market News & Signals
                  </CardTitle>
                  <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
                    4 New Messages
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CommunicationItem
                      sender="Market Analyst"
                      time="15:42:12"
                      message="Tech sector showing strength after positive earnings from major players."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Trading Signal"
                      time="14:30:45"
                      message="MACD crossover detected on AAPL, suggesting bullish momentum."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="News Alert"
                      time="12:15:33"
                      message="Federal Reserve signals potential rate cut in upcoming meeting."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Portfolio Alert"
                      time="09:05:18"
                      message="Your portfolio has outperformed the S&P 500 by 2.3% this month."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-center w-full space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-cyan-600 hover:bg-cyan-700">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* System time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">MARKET TIME</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Trading Day</div>
                        <div className="text-sm font-mono text-slate-200">6h 42m 18s</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                        <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Watchlist */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base flex items-center justify-between">
                    <div className="flex items-center">
                      <LineChart className="mr-2 h-5 w-5 text-cyan-500" />
                      Watchlist
                    </div>
                    {isConnectedToRobinhood && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400">
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isConnectedToRobinhood && robinhoodData ? (
                    <div className="space-y-3">
                      {robinhoodData.watchlist.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md bg-slate-800/50 border border-slate-700/50"
                        >
                          <div>
                            <div className="text-sm font-medium text-slate-200">{item.symbol}</div>
                            <div className="text-xs text-slate-500">{item.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-200">${item.price.toFixed(2)}</div>
                            <div className={`text-xs ${item.change > 0 ? "text-green-400" : "text-red-400"}`}>
                              {item.change > 0 ? "+" : ""}
                              {item.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                      <LineChart className="h-12 w-12 mb-2 opacity-20" />
                      <p className="text-sm">No watchlist available</p>
                      <p className="text-xs mt-1">Connect your Robinhood account to see your watchlist</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={LineChart} label="Buy Assets" />
                    <ActionButton icon={BarChart3} label="Sell Assets" />
                    <ActionButton icon={Download} label="Export Data" />
                    <ActionButton icon={RefreshCw} label="Refresh" />
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio allocation */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isConnectedToRobinhood && robinhoodData ? (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-slate-400">Equities</div>
                            <div className="text-xs text-cyan-400">
                              {Math.round(
                                ((robinhoodData.portfolio.value - robinhoodData.portfolio.cash) /
                                  robinhoodData.portfolio.value) *
                                  100,
                              )}
                              % allocated
                            </div>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{
                                width: `${Math.round(((robinhoodData.portfolio.value - robinhoodData.portfolio.cash) / robinhoodData.portfolio.value) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-slate-400">Cash</div>
                            <div className="text-xs text-green-400">
                              {Math.round((robinhoodData.portfolio.cash / robinhoodData.portfolio.value) * 100)}%
                              allocated
                            </div>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              style={{
                                width: `${Math.round((robinhoodData.portfolio.cash / robinhoodData.portfolio.value) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-slate-400">Equities</div>
                            <div className="text-xs text-cyan-400">42% allocated</div>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: "42%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-slate-400">Cryptocurrencies</div>
                            <div className="text-xs text-purple-400">28% allocated</div>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: "28%" }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm text-slate-400">Fixed Income</div>
                            <div className="text-xs text-blue-400">15% allocated</div>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: "15%" }}
                            ></div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-400">Risk Tolerance</div>
                        <div className="flex items-center">
                          <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                          <span className="text-cyan-400">3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading settings */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Trading Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Radio className="text-cyan-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Automated Trading</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="text-cyan-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">2FA Authentication</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Zap className="text-cyan-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Instant Execution</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleOff className="text-cyan-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Stop Loss Orders</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
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

// Add these types at the end of the file
interface RobinhoodData {
  portfolio: {
    value: number
    change: number
    cash: number
  }
  positions: {
    symbol: string
    name: string
    shares: number
    price: number
    value: number
    change: number
  }[]
  recentTrades: {
    symbol: string
    name: string
    type: string
    price: number
    shares: number
    time: string
    status: string
  }[]
  watchlist: {
    symbol: string
    name: string
    price: number
    change: number
  }[]
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

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

interface StatusItemProps {
  label: string
  value: number
  color: "cyan" | "green" | "blue"
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-400">{label}</div>
        <div className={`font-mono text-${color}-400`}>{value}%</div>
      </div>
      <Progress value={value} className="h-2 bg-slate-700">
        <div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </Progress>
    </div>
  )
}

interface NavItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active }) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-slate-800 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: "cyan" | "purple" | "blue"
  detail: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, color, detail }) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-400 text-sm flex items-center justify-between">
          {title}
          <Icon className={`h-4 w-4 text-${color}-400`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-mono text-slate-100">{value}</div>
        <CardFooter className="text-xs text-slate-400 justify-between">
          <div className="flex items-center space-x-1">
            {trend === "up" && <ArrowRight className="h-3 w-3 text-green-500 rotate-45" />}
            {trend === "down" && <ArrowRight className="h-3 w-3 text-red-500 -rotate-45" />}
            <span className="uppercase">{trend}</span>
          </div>
          <div>{detail}</div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

interface ProcessRowProps {
  pid: string
  name: string
  user: string
  cpu: number
  memory: number
  status: string
}

const ProcessRow: React.FC<ProcessRowProps> = ({ pid, name, user, cpu, memory, status }) => {
  return (
    <div className="grid grid-cols-12 p-3 text-sm">
      <div className="col-span-1 text-slate-400">{pid}</div>
      <div className="col-span-4 font-medium text-slate-200">{name}</div>
      <div className="col-span-2 text-cyan-400">{user}</div>
      <div className="col-span-2 text-purple-400">{cpu}</div>
      <div className="col-span-2 text-blue-400">{memory}</div>
      <div className="col-span-1 text-green-400">{status}</div>
    </div>
  )
}

interface StorageItemProps {
  name: string
  total: number
  used: number
  type: string
}

const StorageItem: React.FC<StorageItemProps> = ({ name, total, used, type }) => {
  return (
    <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-300 font-medium">{name}</div>
        <div className="text-xs text-slate-500">{type}</div>
      </div>
      <div className="text-xs text-slate-500 mb-1">
        {used} / {total} GB
      </div>
      <Progress value={used} max={total} className="h-1.5 bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          style={{ width: `${(used / total) * 100}%` }}
        />
      </Progress>
    </div>
  )
}

interface CommunicationItemProps {
  sender: string
  time: string
  message: string
  avatar: string
  unread?: boolean
}

const CommunicationItem: React.FC<CommunicationItemProps> = ({ sender, time, message, avatar, unread }) => {
  return (
    <div className="flex items-start space-x-3">
      <Avatar>
        <AvatarImage src={avatar || "/placeholder.svg"} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-sm text-slate-400">{message}</div>
      </div>
      {unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5"></div>}
    </div>
  )
}

interface ActionButtonProps {
  icon: LucideIcon
  label: string
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label }) => {
  return (
    <Button className="w-full h-12 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400">
      <div className="flex flex-col items-center justify-center">
        <Icon className="h-5 w-5 mb-1" />
        <div className="text-xs">{label}</div>
      </div>
    </Button>
  )
}

const PerformanceChart = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
      <BarChart3 className="h-12 w-12 opacity-20" />
      <p className="text-sm">No data available</p>
    </div>
  )
}
