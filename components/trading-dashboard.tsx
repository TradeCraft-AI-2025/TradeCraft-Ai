"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, LineChart, CandlestickChart, Star, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function TradingDashboard() {
  // State for watchlist
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [newTicker, setNewTicker] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("watchlist")
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    } else {
      // Default watchlist if none exists
      const defaultWatchlist = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
      setWatchlist(defaultWatchlist)
      localStorage.setItem("watchlist", JSON.stringify(defaultWatchlist))
    }

    // Set loaded state after a small delay to trigger animations
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  // Add ticker to watchlist
  const addToWatchlist = () => {
    if (!newTicker) return

    const formattedTicker = newTicker.toUpperCase().trim()

    if (watchlist.includes(formattedTicker)) {
      toast({
        title: "Already in watchlist",
        description: `${formattedTicker} is already in your watchlist.`,
        variant: "destructive",
      })
      return
    }

    setWatchlist([...watchlist, formattedTicker])
    setNewTicker("")
    toast({
      title: "Added to watchlist",
      description: `${formattedTicker} has been added to your watchlist.`,
    })
  }

  // Remove ticker from watchlist
  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((item) => item !== ticker))
    toast({
      title: "Removed from watchlist",
      description: `${ticker} has been removed from your watchlist.`,
    })
  }

  // Handle ticker selection
  const selectTicker = (ticker: string) => {
    setSelectedSymbol(ticker)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Main Chart Area - Takes up 3/4 of the space on large screens */}
      <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>
        <motion.div variants={cardVariants}>
          <Card className="bg-black/30 border border-accent/30 shadow-md backdrop-blur-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear", repeatDelay: 5 }}
                    >
                      <CandlestickChart className="mr-2 h-5 w-5 text-accent" />
                    </motion.div>
                    <span>
                      TRADECRAFT <span className="text-accent">AI</span> • {selectedSymbol}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-soft">Real-time market data and analysis</CardDescription>
                </div>
                <Badge variant="outline" className="bg-background/70 text-accent border-accent/50 text-xs">
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-accent mr-1"
                    variants={pulseVariants}
                    animate="pulse"
                  />
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="candlestick" className="w-full">
                <div className="px-6 border-b border-soft/20">
                  <TabsList className="bg-background/80 h-10">
                    <TabsTrigger
                      value="candlestick"
                      className="data-[state=active]:bg-background data-[state=active]:text-accent"
                    >
                      <CandlestickChart className="h-4 w-4 mr-2" />
                      Candlestick
                    </TabsTrigger>
                    <TabsTrigger
                      value="line"
                      className="data-[state=active]:bg-background data-[state=active]:text-accent"
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Line Chart
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="candlestick" className="mt-0">
                  <div className="relative w-full" style={{ height: "500px" }}>
                    <iframe
                      src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b3a17&symbol=${selectedSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1`}
                      style={{
                        width: "100%",
                        height: "100%",
                        margin: "0 !important",
                        padding: "0 !important",
                      }}
                      title="Candlestick Chart"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </TabsContent>

                <TabsContent value="line" className="mt-0">
                  <div className="relative w-full" style={{ height: "500px" }}>
                    <iframe
                      src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b3a18&symbol=${selectedSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=3&timezone=exchange&withdateranges=1&showpopupbutton=1`}
                      style={{
                        width: "100%",
                        height: "100%",
                        margin: "0 !important",
                        padding: "0 !important",
                      }}
                      title="Line Chart"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Technical Analysis Widget */}
        <motion.div variants={cardVariants}>
          <Card className="bg-black/30 border border-accent/30 shadow-md backdrop-blur-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center">
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <LineChart className="mr-2 h-5 w-5 text-accent" />
                </motion.div>
                Technical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full" style={{ height: "400px" }}>
                <iframe
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_b3a19&symbol=${selectedSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=exchange&studies=%5B%5D&withdateranges=1&showpopupbutton=1`}
                  style={{
                    width: "100%",
                    height: "100%",
                    margin: "0 !important",
                    padding: "0 !important",
                  }}
                  title="Technical Analysis"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Watchlist Sidebar - Takes up 1/4 of the space on large screens */}
      <motion.div className="lg:col-span-1" variants={itemVariants}>
        <Card className="bg-black/30 border border-accent/30 shadow-md backdrop-blur-lg rounded-xl h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <motion.div
                animate={{
                  rotate: [-5, 5, -5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <Star className="mr-2 h-5 w-5 text-cta" />
              </motion.div>
              Watchlist
            </CardTitle>
            <CardDescription className="text-soft">Track your favorite stocks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 text-soft">
            <motion.div
              className="flex space-x-2 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                placeholder="Add ticker (e.g. AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="bg-background/80 border-soft/20 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToWatchlist()
                  }
                }}
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={addToWatchlist} className="bg-accent hover:bg-accent/80 text-background">
                  <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            <Separator className="my-4 bg-soft/20" />

            <ScrollArea className="h-[700px] pr-4">
              <AnimatePresence>
                {watchlist.length === 0 ? (
                  <motion.div
                    className="text-center py-8 text-soft"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Star className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Your watchlist is empty</p>
                    <p className="text-xs mt-1">Add tickers to track them here</p>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-2" variants={containerVariants}>
                    {watchlist.map((ticker, index) => (
                      <motion.div
                        key={ticker}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          selectedSymbol === ticker
                            ? "bg-background/90 border-accent/50"
                            : "bg-background/70 border-soft/20 hover:bg-background/80"
                        } cursor-pointer transition-colors`}
                        onClick={() => selectTicker(ticker)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? "bg-green-500" : "bg-red-500"} mr-3`}
                          ></div>
                          <span className="font-medium text-white">{ticker}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm ${Math.random() > 0.5 ? "text-green-400" : "text-red-400"}`}>
                            {Math.random() > 0.5 ? "+" : "-"}
                            {(Math.random() * 5).toFixed(2)}%
                          </span>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full hover:bg-red-500/20 hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFromWatchlist(ticker)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
