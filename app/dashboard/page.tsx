"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LiveTickerPrice } from "@/components/live-ticker-price"
import { LiveWatchlist } from "@/components/live-watchlist"
import { PremiumBackground } from "@/components/premium-background"
import { StatusStrip } from "@/components/status-strip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketNews } from "@/components/market-news"
import { LoadingScreen } from "@/components/loading-screen"
import { Logo } from "@/components/logo"
import { CustomTradingView } from "@/components/custom-trading-view"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { BrokerConnectionCard } from "@/components/broker-connection-card"
import { ArrowRight, BarChart3, Wallet, LineChart, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [currentTicker, setCurrentTicker] = useState("SPY")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")
  const [isConnectedToBroker, setIsConnectedToBroker] = useState(false)
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("1D")
  const [showPortfolio, setShowPortfolio] = useState(false)

  // Load connection state on mount
  useEffect(() => {
    const savedBroker = localStorage.getItem("connected-broker")
    if (savedBroker) {
      setConnectedBroker(savedBroker)
      setIsConnectedToBroker(true)
      setShowPortfolio(true)
    }
  }, [])

  // Initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle broker connection
  const handleBrokerConnection = (broker: string, isConnected: boolean) => {
    setIsConnectedToBroker(isConnected)

    if (isConnected) {
      setConnectedBroker(broker)
      localStorage.setItem("connected-broker", broker)
      setShowPortfolio(true)
    } else {
      setConnectedBroker(null)
      localStorage.removeItem("connected-broker")
    }
  }

  // Memorize chart options for performance
  const chartStudies = useMemo(() => {
    return activeTab === "analysis"
      ? ["RSI@tv-basicstudies", "MACD@tv-basicstudies", "StochasticRSI@tv-basicstudies"]
      : []
  }, [activeTab])

  if (isInitialLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <PremiumBackground />
      <StatusStrip />
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b border-[#D4AF37]/20 pb-4"
        >
          <div className="flex items-center mb-4 md:mb-0">
            <Logo variant="default" className="mr-4" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Market Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px] bg-black/40 border-slate-700/60">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-slate-700">
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
                <SelectItem value="5Y">5 Years</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="bg-[#5EEAD4]/10 text-[#5EEAD4] border-[#5EEAD4]/30">
              <div className="h-1.5 w-1.5 rounded-full bg-[#5EEAD4] mr-1.5 animate-pulse"></div>
              {connectedBroker ? `${connectedBroker} Connected` : "Live Data"}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area - Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Chart Card */}
            <Card className="bg-black/40 border-[#D4AF37]/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl">
              <CardHeader className="border-b border-[#D4AF37]/20 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CardTitle className="text-white flex items-center">
                      <span className="ticker-symbol mr-2 text-xl">{currentTicker}</span>
                      <LiveTickerPrice symbol={currentTicker} className="price-display text-xl" />
                    </CardTitle>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-black/60 border border-[#D4AF37]/10">
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

                      <TabsContent value="chart" className="mt-0 h-[600px]">
                        <CustomTradingView
                          symbol={currentTicker}
                          interval={timeframe}
                          height={600}
                          chartType="candlestick"
                          showToolbar={true}
                          showVolume={true}
                        />
                      </TabsContent>

                      <TabsContent value="analysis" className="mt-0 h-[600px]">
                        <CustomTradingView
                          symbol={currentTicker}
                          interval={timeframe}
                          height={600}
                          chartType="candlestick"
                          showToolbar={true}
                          showVolume={true}
                          studies={chartStudies}
                        />
                      </TabsContent>

                      <TabsContent value="news" className="mt-0 h-[600px] overflow-y-auto">
                        <div className="p-6">
                          <MarketNews symbol={currentTicker} isLoading={false} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0"></CardContent>
            </Card>
          </motion.div>

          {/* Sidebar - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Broker Connection Card */}
            {!isConnectedToBroker && (
              <BrokerConnectionCard
                broker="Robinhood"
                description="Connect your Robinhood account to view and analyze your portfolio"
                icon="/robinhood-logo.png"
                isConnected={false}
                onConnectionChange={(isConnected) => handleBrokerConnection("Robinhood", isConnected)}
              />
            )}

            {/* Watchlist Card */}
            <LiveWatchlist
              initialSymbols={["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "SPY"]}
              onSelectSymbol={setCurrentTicker}
              selectedSymbol={currentTicker}
            />

            {/* Portfolio Summary */}
            {isConnectedToBroker ? (
              <PortfolioSummary isEmpty={false} onConnect={() => {}} />
            ) : (
              <PortfolioSummary isEmpty={true} onConnect={() => handleBrokerConnection("Robinhood", true)} />
            )}
          </motion.div>
        </div>

        {/* Market Movers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-[#5EEAD4]" />
              Market Movers
            </h2>
            <Select defaultValue="gainers">
              <SelectTrigger className="w-[120px] bg-black/40 border-slate-700/60">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-slate-700">
                <SelectItem value="gainers">Top Gainers</SelectItem>
                <SelectItem value="losers">Top Losers</SelectItem>
                <SelectItem value="active">Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["AAPL", "MSFT", "TSLA", "NVDA"].map((symbol) => (
              <Card
                key={symbol}
                className="bg-black/40 border-[#D4AF37]/20 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300 shadow-lg"
                onClick={() => setCurrentTicker(symbol)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{symbol}</CardTitle>
                    <LiveTickerPrice symbol={symbol} className="text-sm" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CustomTradingView
                    symbol={symbol}
                    height={180}
                    interval="1D"
                    chartType="area"
                    showToolbar={false}
                    showVolume={false}
                    showDateRanges={false}
                    isMinichart={true}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-[#5EEAD4]/20 hover:bg-[#5EEAD4]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Portfolio Dashboard
            </Button>
            <Button className="bg-[#5EEAD4]/20 hover:bg-[#5EEAD4]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button className="bg-[#5EEAD4]/20 hover:bg-[#5EEAD4]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Broker
            </Button>
            <Button className="bg-[#5EEAD4]/20 hover:bg-[#5EEAD4]/30 text-[#5EEAD4] border border-[#5EEAD4]/30">
              <ArrowRight className="mr-2 h-4 w-4" />
              Explore Pro Features
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
