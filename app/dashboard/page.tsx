"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, RefreshCw, ArrowUp, ArrowDown, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "@/components/animated-background"
import { StatusStrip } from "@/components/status-strip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MarketNews } from "@/components/market-news"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingScreen } from "@/components/loading-screen"
import { Logo } from "@/components/logo"

interface PortfolioItem {
  symbol: string
  shares: number
  avgBuyPrice: number
  currentPrice: number
  dayChange: number
  dayChangePercent: number
  name: string
}

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
}

export default function DashboardPage() {
  const [ticker, setTicker] = useState("")
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [currentTicker, setCurrentTicker] = useState("SPY")
  const { toast } = useToast()
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({})
  const [activeTab, setActiveTab] = useState("chart")

  // Initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("tradecraft-watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    } else {
      // Default watchlist if none exists
      const defaultWatchlist = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "SPY"]
      setWatchlist(defaultWatchlist)
      localStorage.setItem("tradecraft-watchlist", JSON.stringify(defaultWatchlist))
    }

    // Simulate initial data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tradecraft-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  // Load portfolio data from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolio")
    if (savedPortfolio) {
      setPortfolioItems(JSON.parse(savedPortfolio))
    } else {
      // Default portfolio data
      const defaultPortfolio = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          shares: 10,
          avgBuyPrice: 165.23,
          currentPrice: 178.72,
          dayChange: 2.15,
          dayChangePercent: 1.22,
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          shares: 5,
          avgBuyPrice: 242.68,
          currentPrice: 177.8,
          dayChange: -3.42,
          dayChangePercent: -1.89,
        },
        {
          symbol: "SPY",
          name: "SPDR S&P 500 ETF",
          shares: 8,
          avgBuyPrice: 415.32,
          currentPrice: 452.56,
          dayChange: 4.23,
          dayChangePercent: 0.94,
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corp.",
          shares: 12,
          avgBuyPrice: 328.45,
          currentPrice: 415.32,
          dayChange: 5.67,
          dayChangePercent: 1.38,
        },
        {
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          shares: 15,
          avgBuyPrice: 450.75,
          currentPrice: 950.02,
          dayChange: 22.35,
          dayChangePercent: 2.41,
        },
      ]
      setPortfolioItems(defaultPortfolio)
      localStorage.setItem("portfolio", JSON.stringify(defaultPortfolio))
    }
  }, [])

  // Generate realistic market data for watchlist items
  useEffect(() => {
    if (watchlist.length > 0 && !isLoading) {
      generateMarketData(watchlist)
    }
  }, [watchlist, isLoading])

  // Simulate market data updates every 10 seconds
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        updateMarketData()
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [isLoading, marketData])

  // Save portfolio data to localStorage whenever it changes
  useEffect(() => {
    if (portfolioItems.length > 0) {
      localStorage.setItem("portfolio", JSON.stringify(portfolioItems))
    }
  }, [portfolioItems])

  // Generate realistic market data
  const generateMarketData = (symbols: string[]) => {
    const data: Record<string, MarketData> = {}

    const companyNames: Record<string, string> = {
      AAPL: "Apple Inc.",
      MSFT: "Microsoft Corp.",
      GOOGL: "Alphabet Inc.",
      AMZN: "Amazon.com Inc.",
      TSLA: "Tesla Inc.",
      META: "Meta Platforms Inc.",
      NVDA: "NVIDIA Corp.",
      SPY: "SPDR S&P 500 ETF",
      QQQ: "Invesco QQQ Trust",
      DIA: "SPDR Dow Jones Industrial Average ETF",
      JPM: "JPMorgan Chase & Co.",
      V: "Visa Inc.",
      WMT: "Walmart Inc.",
      PG: "Procter & Gamble Co.",
      JNJ: "Johnson & Johnson",
      XOM: "Exxon Mobil Corp.",
      BAC: "Bank of America Corp.",
      KO: "Coca-Cola Co.",
      DIS: "Walt Disney Co.",
      NFLX: "Netflix Inc.",
    }

    const baseValues: Record<string, number> = {
      AAPL: 178.72,
      MSFT: 415.32,
      GOOGL: 142.65,
      AMZN: 178.15,
      TSLA: 177.8,
      META: 474.99,
      NVDA: 950.02,
      SPY: 452.56,
      QQQ: 430.12,
      DIA: 380.45,
      JPM: 183.97,
      V: 275.32,
      WMT: 65.78,
      PG: 162.45,
      JNJ: 147.89,
      XOM: 115.67,
      BAC: 37.45,
      KO: 62.34,
      DIS: 112.48,
      NFLX: 612.35,
    }

    const marketCaps: Record<string, string> = {
      AAPL: "2.85T",
      MSFT: "3.12T",
      GOOGL: "1.78T",
      AMZN: "1.92T",
      TSLA: "567.8B",
      META: "1.23T",
      NVDA: "2.34T",
      SPY: "N/A",
      QQQ: "N/A",
      DIA: "N/A",
      JPM: "532.7B",
      V: "578.9B",
      WMT: "423.6B",
      PG: "382.1B",
      JNJ: "356.8B",
      XOM: "478.2B",
      BAC: "287.3B",
      KO: "269.5B",
      DIS: "205.7B",
      NFLX: "267.8B",
    }

    symbols.forEach((symbol) => {
      const baseValue = baseValues[symbol] || 100 + Math.random() * 900
      const change = Math.random() * 6 - 3 // Random change between -3 and +3
      const changePercent = (change / baseValue) * 100
      const volume = Math.floor(Math.random() * 10000000) + 1000000

      data[symbol] = {
        symbol,
        price: baseValue + change,
        change,
        changePercent,
        volume,
        marketCap: marketCaps[symbol] || "N/A",
      }
    })

    setMarketData(data)

    // Update portfolio prices based on market data
    updatePortfolioPrices(data)
  }

  // Update market data with small changes
  const updateMarketData = () => {
    const updatedData = { ...marketData }

    Object.keys(updatedData).forEach((symbol) => {
      const currentData = updatedData[symbol]
      const smallChange = (Math.random() * 2 - 1) * (currentData.price * 0.002) // Small random change ±0.2%
      const newPrice = currentData.price + smallChange
      const newChange = currentData.change + smallChange
      const newChangePercent = (newChange / (newPrice - newChange)) * 100

      updatedData[symbol] = {
        ...currentData,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
      }
    })

    setMarketData(updatedData)

    // Update portfolio prices based on market data
    updatePortfolioPrices(updatedData)
  }

  // Update portfolio prices based on market data
  const updatePortfolioPrices = (data: Record<string, MarketData>) => {
    if (portfolioItems.length === 0) return

    const updatedPortfolio = portfolioItems.map((item) => {
      if (data[item.symbol]) {
        return {
          ...item,
          currentPrice: data[item.symbol].price,
          dayChange: data[item.symbol].change,
          dayChangePercent: data[item.symbol].changePercent,
        }
      }
      return item
    })

    setPortfolioItems(updatedPortfolio)
  }

  const addToWatchlist = () => {
    if (!ticker) return

    const formattedTicker = ticker.toUpperCase().trim()

    if (watchlist.includes(formattedTicker)) {
      toast({
        title: "Already in watchlist",
        description: `${formattedTicker} is already in your watchlist.`,
        variant: "destructive",
      })
      return
    }

    const newWatchlist = [...watchlist, formattedTicker]
    setWatchlist(newWatchlist)
    setTicker("")

    // Generate market data for the new ticker
    generateMarketData([formattedTicker])

    toast({
      title: "Added to watchlist",
      description: `${formattedTicker} has been added to your watchlist.`,
    })
  }

  const removeFromWatchlist = (tickerToRemove: string) => {
    setWatchlist(watchlist.filter((t) => t !== tickerToRemove))
    toast({
      title: "Removed from watchlist",
      description: `${tickerToRemove} has been removed from your watchlist.`,
    })
  }

  const selectTicker = (selected: string) => {
    setCurrentTicker(selected)
  }

  // Calculate total portfolio value
  const calculateTotalPortfolioValue = () => {
    return portfolioItems.reduce((total, item) => {
      return total + item.shares * item.currentPrice
    }, 0)
  }

  // Calculate total portfolio day change
  const calculateTotalDayChange = () => {
    return portfolioItems.reduce((total, item) => {
      return total + item.dayChange * item.shares
    }, 0)
  }

  // Calculate total portfolio day change percent (weighted average)
  const calculateTotalDayChangePercent = () => {
    const totalValue = calculateTotalPortfolioValue()
    const totalDayChange = calculateTotalDayChange()

    if (totalValue === 0) return 0

    return (totalDayChange / (totalValue - totalDayChange)) * 100
  }

  // Refresh market data
  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      generateMarketData(watchlist)
      setIsRefreshing(false)

      toast({
        title: "Data refreshed",
        description: "Market data has been updated.",
      })
    }, 1000)
  }

  if (isInitialLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <AnimatedBackground />
      <StatusStrip />
      <div className="container py-8 relative z-10 mt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        >
          <div className="flex items-center">
            <Logo variant="default" className="mr-4" />
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 md:mb-0">Trading Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-inner rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      {currentTicker}{" "}
                      {marketData[currentTicker]?.price && `$${marketData[currentTicker].price.toFixed(2)}`}
                      {marketData[currentTicker] && (
                        <Badge
                          className={`ml-2 ${
                            marketData[currentTicker].changePercent >= 0
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {marketData[currentTicker].changePercent >= 0 ? "+" : ""}
                          {marketData[currentTicker].changePercent.toFixed(2)}%
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {isLoading ? "Loading..." : `Advanced Chart and Analysis Tools`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-white/10">
                    <TabsList className="bg-black/40 h-10 px-6 pt-3">
                      <TabsTrigger
                        value="chart"
                        className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
                      >
                        Chart
                      </TabsTrigger>
                      <TabsTrigger
                        value="analysis"
                        className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
                      >
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger
                        value="news"
                        className="data-[state=active]:bg-[#5EEAD4]/20 data-[state=active]:text-[#5EEAD4]"
                      >
                        News
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="chart" className="m-0">
                    {isLoading ? (
                      <div className="h-[600px] w-full flex items-center justify-center bg-black/20">
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 mb-4">
                            <div className="absolute inset-0 border-4 border-t-[#5EEAD4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-3 border-4 border-t-transparent border-r-[#5EEAD4] border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                          </div>
                          <p className="text-[#5EEAD4]">Loading chart data...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full" style={{ height: "600px" }}>
                        <iframe
                          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${currentTicker}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1`}
                          style={{
                            width: "100%",
                            height: "100%",
                            margin: "0 !important",
                            padding: "0 !important",
                          }}
                          title="TradingView Chart"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="analysis" className="m-0">
                    {isLoading ? (
                      <div className="h-[600px] w-full flex items-center justify-center bg-black/20">
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 mb-4">
                            <div className="absolute inset-0 border-4 border-t-[#5EEAD4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-3 border-4 border-t-transparent border-r-[#5EEAD4] border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                          </div>
                          <p className="text-[#5EEAD4]">Loading analysis data...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full" style={{ height: "600px" }}>
                        <iframe
                          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_analysis&symbol=${currentTicker}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies=%5B%22RSI%40tv-basicstudies%22%2C%22MACD%40tv-basicstudies%22%2C%22StochasticRSI%40tv-basicstudies%22%5D`}
                          style={{
                            width: "100%",
                            height: "100%",
                            margin: "0 !important",
                            padding: "0 !important",
                          }}
                          title="TradingView Analysis"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="news" className="m-0">
                    <div className="p-4">
                      <MarketNews symbol={currentTicker} isLoading={isLoading} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Watchlist Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-inner rounded-xl h-full">
              <CardHeader>
                <CardTitle className="text-white">My Watchlist</CardTitle>
                <CardDescription className="text-gray-400">Track your favorite tickers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Add ticker (e.g. AAPL)"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="bg-black/50 border-white/10 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addToWatchlist()
                      }
                    }}
                  />
                  <Button onClick={addToWatchlist} className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {isLoading
                    ? // Loading skeletons
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-md border bg-black/40 border-white/10"
                          >
                            <div className="flex items-center">
                              <Skeleton className="h-4 w-16 bg-white/10" />
                            </div>
                            <Skeleton className="h-4 w-12 bg-white/10" />
                          </div>
                        ))
                    : watchlist.map((item) => (
                        <div
                          key={item}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            currentTicker === item
                              ? "bg-[#5EEAD4]/10 border-[#5EEAD4]/30"
                              : "bg-black/40 border-white/10 hover:bg-black/60"
                          } cursor-pointer transition-colors`}
                          onClick={() => selectTicker(item)}
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-white">{item}</span>
                            {marketData[item] && (
                              <span className="ml-2 text-xs text-gray-400">${marketData[item].price.toFixed(2)}</span>
                            )}
                          </div>
                          {marketData[item] && (
                            <div
                              className={`text-xs ${marketData[item].changePercent >= 0 ? "text-green-400" : "text-red-400"} flex items-center`}
                            >
                              {marketData[item].changePercent >= 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(marketData[item].changePercent).toFixed(2)}%
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 ml-1 rounded-full hover:bg-red-500/20 hover:text-red-400"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFromWatchlist(item)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mini Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {isLoading
            ? // Loading skeletons for mini charts
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card
                    key={i}
                    className="bg-white/5 backdrop-blur-md border border-white/10 shadow-inner rounded-xl overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-16 bg-white/10" />
                    </CardHeader>
                    <CardContent className="p-0">
                      <Skeleton className="h-[200px] w-full bg-white/5" />
                    </CardContent>
                  </Card>
                ))
            : watchlist.slice(0, 4).map((item) => (
                <Card
                  key={item}
                  className="bg-white/5 backdrop-blur-md border border-white/10 shadow-inner rounded-xl overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{item}</CardTitle>
                      {marketData[item] && (
                        <Badge
                          className={`${
                            marketData[item].changePercent >= 0
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {marketData[item].changePercent >= 0 ? "+" : ""}
                          {marketData[item].changePercent.toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative w-full" style={{ height: "200px" }}>
                      <iframe
                        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_mini_${item}&symbol=${item}&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=3&timezone=exchange&withdateranges=0&showpopupbutton=0&hidevolume=1`}
                        style={{
                          width: "100%",
                          height: "100%",
                          margin: "0 !important",
                          padding: "0 !important",
                        }}
                        title={`${item} Mini Chart`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </motion.div>

        {/* Portfolio Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-inner rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-white">
                  <motion.div
                    animate={{
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      repeatDelay: 5,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-5 w-5 text-[#5EEAD4]"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </motion.div>
                  Portfolio Tracker
                </CardTitle>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4 text-[#5EEAD4]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Portfolio data updates automatically with market changes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-gray-400">Track your investments and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-black/40 border-b border-white/10">
                      <TableHead className="text-[#5EEAD4]">Symbol</TableHead>
                      <TableHead className="text-[#5EEAD4]">Name</TableHead>
                      <TableHead className="text-right text-[#5EEAD4]">Shares</TableHead>
                      <TableHead className="text-right text-[#5EEAD4]">Avg Buy Price</TableHead>
                      <TableHead className="text-right text-[#5EEAD4]">Current Price</TableHead>
                      <TableHead className="text-right text-[#5EEAD4]">Day Change</TableHead>
                      <TableHead className="text-right text-[#5EEAD4]">Total P/L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading
                      ? // Loading skeletons for portfolio items
                        Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <TableRow key={i} className="hover:bg-black/40 border-b border-white/10">
                              <TableCell>
                                <Skeleton className="h-4 w-12 bg-white/10" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24 bg-white/10" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-8 ml-auto bg-white/10" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-16 ml-auto bg-white/10" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-16 ml-auto bg-white/10" />
                              </TableCell>
                              <TableCell className="text-right">
                                <Skeleton className="h-4 w-20 ml-auto bg-white/10" />
                              </TableCell>
                            </TableRow>
                          ))
                      : portfolioItems.map((item: PortfolioItem) => {
                          const totalPL = (item.currentPrice - item.avgBuyPrice) * item.shares
                          const totalPLPercent = ((item.currentPrice - item.avgBuyPrice) / item.avgBuyPrice) * 100
                          const isProfitable = totalPL > 0
                          const isDayPositive = item.dayChangePercent > 0

                          return (
                            <TableRow key={item.symbol} className="hover:bg-black/40 border-b border-white/10">
                              <TableCell className="font-medium text-white">{item.symbol}</TableCell>
                              <TableCell className="text-gray-300">{item.name}</TableCell>
                              <TableCell className="text-right text-gray-300">{item.shares}</TableCell>
                              <TableCell className="text-right text-gray-300">${item.avgBuyPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right text-gray-300">
                                ${item.currentPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div
                                  className={`flex items-center justify-end ${isDayPositive ? "text-green-400" : "text-red-400"}`}
                                >
                                  {isDayPositive ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  )}
                                  {item.dayChangePercent.toFixed(2)}%
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end">
                                  <Badge
                                    className={`${isProfitable ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
                                  >
                                    {isProfitable ? "+" : ""}${totalPL.toFixed(2)} ({totalPLPercent.toFixed(2)}%)
                                  </Badge>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                  </TableBody>
                  <TableFooter className="bg-white/5 border-t border-white/10">
                    <TableRow className="hover:bg-white/10">
                      <TableCell colSpan={4} className="text-[#5EEAD4]">
                        Total Portfolio Value
                      </TableCell>
                      <TableCell className="text-right text-[#5EEAD4] font-bold">
                        ${calculateTotalPortfolioValue().toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end ${calculateTotalDayChangePercent() >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {calculateTotalDayChangePercent() >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(calculateTotalDayChangePercent()).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          className={`${calculateTotalDayChange() >= 0 ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
                        >
                          {calculateTotalDayChange() >= 0 ? "+" : ""}${calculateTotalDayChange().toFixed(2)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
