"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, ArrowDown, Plus, X, Check, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getBatchQuotes, formatPrice, type StockQuote } from "@/lib/market-data"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface LiveWatchlistProps {
  initialSymbols?: string[]
  onSelectSymbol?: (symbol: string) => void
  selectedSymbol?: string
  className?: string
}

export function LiveWatchlist({
  initialSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "SPY", "QQQ", "NVDA"],
  onSelectSymbol,
  selectedSymbol,
  className = "",
}: LiveWatchlistProps) {
  const [watchlist, setWatchlist] = useState<string[]>(initialSymbols)
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [newTicker, setNewTicker] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [isAddingTicker, setIsAddingTicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("tradecraft-watchlist")
    if (savedWatchlist) {
      try {
        const parsed = JSON.parse(savedWatchlist)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWatchlist(parsed)
        }
      } catch (e) {
        console.error("Error parsing watchlist from localStorage:", e)
      }
    }
  }, [])

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tradecraft-watchlist", JSON.stringify(watchlist))
  }, [watchlist])

  // Focus input when adding ticker
  useEffect(() => {
    if (isAddingTicker && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAddingTicker])

  // Fetch quotes for watchlist
  useEffect(() => {
    let isMounted = true

    const fetchQuotes = async () => {
      if (watchlist.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        setRefreshing(true)
        const data = await getBatchQuotes(watchlist)

        if (!isMounted) return

        // Merge with previous quotes to keep any that didn't update
        setQuotes((prevQuotes) => {
          const newQuotes = { ...prevQuotes }

          // Update with new data
          Object.keys(data).forEach((symbol) => {
            newQuotes[symbol] = data[symbol]
          })

          return newQuotes
        })
      } catch (err) {
        console.error("Error fetching batch quotes:", err)
        // Don't clear existing quotes on error
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setRefreshing(false)
        }
      }
    }

    fetchQuotes()

    // Refresh every minute
    const intervalId = setInterval(fetchQuotes, 60000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [watchlist])

  const handleAddTicker = () => {
    if (!newTicker) {
      setIsAddingTicker(false)
      return
    }

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
    setIsAddingTicker(false)

    toast({
      title: "Added to watchlist",
      description: `${formattedTicker} has been added to your watchlist.`,
    })
  }

  const handleRemoveTicker = (ticker: string) => {
    setWatchlist(watchlist.filter((t) => t !== ticker))

    // Also remove from quotes
    const newQuotes = { ...quotes }
    delete newQuotes[ticker]
    setQuotes(newQuotes)

    toast({
      title: "Removed from watchlist",
      description: `${ticker} has been removed from your watchlist.`,
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await getBatchQuotes(watchlist)

      // Merge with existing quotes
      setQuotes((prevQuotes) => ({
        ...prevQuotes,
        ...data,
      }))

      toast({
        title: "Watchlist refreshed",
        description: "Latest market data has been loaded.",
      })
    } catch (err) {
      console.error("Error refreshing quotes:", err)

      toast({
        title: "Refresh failed",
        description: "Unable to fetch latest market data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Handle ticker selection with optional callback
  const handleSelectTicker = (symbol: string) => {
    if (onSelectSymbol) {
      onSelectSymbol(symbol)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <Card className="h-full">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        {isAddingTicker ? (
          <form
            className="flex items-center w-full space-x-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleAddTicker()
            }}
          >
            <Input
              ref={inputRef}
              placeholder="Add ticker (e.g. AAPL)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              className="h-8"
            />
            <Button type="submit" size="sm" className="h-8 px-2">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => setIsAddingTicker(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <>
            <h3 className="font-medium">Watchlist</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshIcon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 flex items-center"
                onClick={() => setIsAddingTicker(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Ticker
              </Button>
            </div>
          </>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
          {isLoading && watchlist.length > 0 && !Object.keys(quotes).length ? (
            // Loading skeletons
            Array(watchlist.length)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-md border border-slate-700/50 bg-slate-800/50"
                >
                  <div className="h-5 w-20 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
                  <div className="h-5 w-16 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded"></div>
                </div>
              ))
          ) : watchlist.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <p className="text-sm">Your watchlist is empty</p>
              <p className="text-xs mt-1">Add tickers to track them here</p>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-2">
              <AnimatePresence>
                {watchlist.map((symbol) => {
                  const quote = quotes[symbol]

                  return (
                    <motion.div
                      key={symbol}
                      variants={itemVariants}
                      exit="exit"
                      layout
                      className={`flex items-center justify-between p-3 rounded-md border ${
                        selectedSymbol === symbol
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600/50"
                      } cursor-pointer transition-all duration-200`}
                      onClick={() => handleSelectTicker(symbol)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center">
                        <span className="ticker-symbol font-medium">{symbol}</span>
                      </div>

                      {quote ? (
                        <div
                          className={`text-xs flex items-center ${
                            quote.changePercent >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          <span className="mr-2">${formatPrice(quote.price)}</span>
                          {quote.changePercent >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(quote.changePercent).toFixed(2)}%
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-1 rounded-full hover:bg-red-500/20 hover:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveTicker(symbol)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-4 w-16 bg-gradient-to-r from-slate-700/20 to-slate-600/20 animate-shimmer rounded mr-2"></div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-red-500/20 hover:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveTicker(symbol)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Simple refresh icon component
function RefreshIcon({ className = "" }: { className?: string }) {
  return (
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
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  )
}
