"use client"

import { useState, useEffect } from "react"
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
import { EmptyPortfolioState, type ManualHolding } from "@/components/empty-portfolio-state"
import { PortfolioHoldings } from "@/components/portfolio-holdings"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  const [currentTicker, setCurrentTicker] = useState("SPY")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("chart")
  const [portfolioHoldings, setPortfolioHoldings] = useState<ManualHolding[]>([])
  const [connectedBroker, setConnectedBroker] = useState<string | null>(null)
  const [isAddingHolding, setIsAddingHolding] = useState(false)

  // Initial loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Load portfolio data from localStorage
    const savedPortfolio = localStorage.getItem("tradecraft-portfolio")
    if (savedPortfolio) {
      try {
        setPortfolioHoldings(JSON.parse(savedPortfolio))
      } catch (e) {
        console.error("Error parsing portfolio data:", e)
      }
    }

    // Load connected broker from localStorage
    const savedBroker = localStorage.getItem("tradecraft-connected-broker")
    if (savedBroker) {
      setConnectedBroker(savedBroker)
    }
  }, [])

  const handleConnectBroker = (broker: string) => {
    setIsInitialLoading(true)

    // Simulate connection process
    setTimeout(() => {
      setConnectedBroker(broker)
      localStorage.setItem("tradecraft-connected-broker", broker)

      // Generate some sample holdings for demo purposes
      const sampleHoldings: ManualHolding[] = [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          shares: 10,
          costBasis: 150.25,
          currentPrice: 178.72,
          value: 1787.2,
          change: 18.95,
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          shares: 5,
          costBasis: 290.5,
          currentPrice: 338.11,
          value: 1690.55,
          change: 16.39,
        },
        {
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          shares: 8,
          costBasis: 135.2,
          currentPrice: 142.65,
          value: 1141.2,
          change: 5.51,
        },
      ]

      setPortfolioHoldings(sampleHoldings)
      localStorage.setItem("tradecraft-portfolio", JSON.stringify(sampleHoldings))

      setIsInitialLoading(false)
    }, 2000)
  }

  const handleAddHolding = (holding: ManualHolding) => {
    // Add current price if available
    const updatedHolding = { ...holding }

    // Update holdings
    const updatedHoldings = [...portfolioHoldings, updatedHolding]
    setPortfolioHoldings(updatedHoldings)

    // Save to localStorage
    localStorage.setItem("tradecraft-portfolio", JSON.stringify(updatedHoldings))
  }

  const handleDeleteHolding = (symbol: string) => {
    const updatedHoldings = portfolioHoldings.filter((h) => h.symbol !== symbol)
    setPortfolioHoldings(updatedHoldings)
    localStorage.setItem("tradecraft-portfolio", JSON.stringify(updatedHoldings))
  }

  if (isInitialLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <PremiumBackground />
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
            <h1 className="text-3xl font-serif font-bold tracking-tight text-white mb-2 md:mb-0">Trading Dashboard</h1>
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
            <Card className="premium-card rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-[#D4AF37]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CardTitle className="text-white font-serif flex items-center">
                      <span className="ticker-symbol mr-2">{currentTicker}</span>
                      <LiveTickerPrice symbol={currentTicker} className="price-display text-xl" />
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b border-[#D4AF37]/20">
                    <TabsList className="bg-black/40 h-10 px-6 pt-3">
                      <TabsTrigger
                        value="chart"
                        className="data-[state=active]:bg-[#D4AF37]/20 data-[state=active]:text-[#D4AF37]"
                      >
                        Chart
                      </TabsTrigger>
                      <TabsTrigger
                        value="analysis"
                        className="data-[state=active]:bg-[#D4AF37]/20 data-[state=active]:text-[#D4AF37]"
                      >
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger
                        value="news"
                        className="data-[state=active]:bg-[#D4AF37]/20 data-[state=active]:text-[#D4AF37]"
                      >
                        News
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="chart" className="m-0">
                    <CustomTradingView
                      symbol={currentTicker}
                      height={600}
                      chartType="candlestick"
                      showToolbar={true}
                      showVolume={true}
                    />
                  </TabsContent>

                  <TabsContent value="analysis" className="m-0">
                    <CustomTradingView
                      symbol={currentTicker}
                      height={600}
                      chartType="candlestick"
                      showToolbar={true}
                      showVolume={true}
                      studies={["RSI@tv-basicstudies", "MACD@tv-basicstudies", "StochasticRSI@tv-basicstudies"]}
                    />
                  </TabsContent>

                  <TabsContent value="news" className="m-0">
                    <div className="p-4">
                      <MarketNews symbol={currentTicker} isLoading={false} />
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
            className="lg:col-span-1 space-y-6"
          >
            <LiveWatchlist
              initialSymbols={["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "SPY"]}
              onSelectSymbol={setCurrentTicker}
              selectedSymbol={currentTicker}
            />

            {portfolioHoldings.length === 0 ? (
              <EmptyPortfolioState onConnect={handleConnectBroker} onAddManualHolding={handleAddHolding} />
            ) : (
              <PortfolioHoldings
                holdings={portfolioHoldings}
                onAddHolding={() => setIsAddingHolding(true)}
                onDeleteHolding={handleDeleteHolding}
                onConnectBroker={() => handleConnectBroker("Robinhood")}
                connectedBroker={connectedBroker}
              />
            )}
          </motion.div>
        </div>

        {/* Mini Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {["AAPL", "MSFT", "TSLA", "NVDA"].map((symbol) => (
            <Card
              key={symbol}
              className="premium-card rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setCurrentTicker(symbol)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white font-serif">{symbol}</CardTitle>
                  <LiveTickerPrice symbol={symbol} className="text-sm" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CustomTradingView
                  symbol={symbol}
                  height={200}
                  chartType="area"
                  showToolbar={false}
                  showVolume={false}
                  showDateRanges={false}
                  isMinichart={true}
                />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Add Holding Dialog */}
      <Dialog open={isAddingHolding} onOpenChange={setIsAddingHolding}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Holding</DialogTitle>
            <DialogDescription>Enter the details of your investment holding.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-symbol" className="text-right">
                Symbol*
              </Label>
              <Input
                id="add-symbol"
                placeholder="AAPL"
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">
                Name
              </Label>
              <Input
                id="add-name"
                placeholder="Apple Inc."
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-shares" className="text-right">
                Shares*
              </Label>
              <Input
                id="add-shares"
                type="number"
                placeholder="10"
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-costBasis" className="text-right">
                Cost Basis*
              </Label>
              <Input
                id="add-costBasis"
                type="number"
                placeholder="150.00"
                className="col-span-3 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingHolding(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Implementation would go here
                setIsAddingHolding(false)
              }}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Add Holding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
