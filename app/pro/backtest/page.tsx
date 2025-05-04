"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, FileUp, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ProGuard } from "@/components/pro-guard"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function BacktestPage() {
  const [selectedStrategy, setSelectedStrategy] = useState("sma-cross")
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const runBacktest = () => {
    setIsRunning(true)
    setProgress(0)
    setIsComplete(false)
    setError(null)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setIsComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleReset = () => {
    setError(null)
    setIsRunning(false)
    setIsComplete(false)
    setProgress(0)
  }

  return (
    <ProGuard>
      <div className="container py-8 relative">
        {isRunning && (
          <LoadingSpinner isLoading={isRunning} fullScreen={true} text={`Running backtest... ${progress}%`} />
        )}

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight mb-6"
        >
          Strategy Backtester
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <CardTitle>Backtest Configuration</CardTitle>
                <CardDescription>Configure your backtest parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload OHLCV Data (CSV)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="file-upload" type="file" accept=".csv" className="bg-background/80" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a CSV file with OHLCV data (Open, High, Low, Close, Volume)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Select Strategy</Label>
                  <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                    <SelectTrigger className="bg-background/80">
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sma-cross">SMA Crossover</SelectItem>
                      <SelectItem value="rsi">RSI Strategy</SelectItem>
                      <SelectItem value="macd">MACD Strategy</SelectItem>
                      <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial-capital">Initial Capital</Label>
                  <Input id="initial-capital" type="number" defaultValue="10000" className="bg-background/80" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position-size">Position Size (%)</Label>
                  <Input
                    id="position-size"
                    type="number"
                    defaultValue="10"
                    min="1"
                    max="100"
                    className="bg-background/80"
                  />
                </div>

                <Button
                  onClick={runBacktest}
                  disabled={isRunning}
                  className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black"
                >
                  {isRunning ? "Running..." : "Run Backtest"}
                  {!isRunning && <BarChart2 className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ErrorBoundary onReset={handleReset}>
              <Card className="bg-background/60 backdrop-blur border-muted">
                <CardHeader>
                  <CardTitle>Backtest Results</CardTitle>
                  <CardDescription>Performance metrics and visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  {isRunning && (
                    <div className="space-y-4 py-8">
                      <p className="text-center text-muted-foreground">Running backtest...</p>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {!isRunning && !isComplete && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileUp className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Backtest Results Yet</h3>
                      <p className="text-muted-foreground max-w-md">
                        Upload your data and run a backtest to see performance metrics and charts here.
                      </p>
                    </div>
                  )}

                  {isComplete && (
                    <div className="space-y-6">
                      <div className="bg-background/40 rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium mb-4">Performance Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-background/60 p-4 rounded-md border border-border">
                            <p className="text-sm text-muted-foreground">Total Return</p>
                            <p className="text-2xl font-bold text-[#5EEAD4]">+24.8%</p>
                          </div>
                          <div className="bg-background/60 p-4 rounded-md border border-border">
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-2xl font-bold text-[#5EEAD4]">62.5%</p>
                          </div>
                          <div className="bg-background/60 p-4 rounded-md border border-border">
                            <p className="text-sm text-muted-foreground">Max Drawdown</p>
                            <p className="text-2xl font-bold text-red-500">-8.3%</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/40 rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium mb-4">Equity Curve</h3>
                        <div className="h-64 bg-background/60 rounded-md border border-border flex items-center justify-center">
                          <TrendingUp className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ErrorBoundary>
          </motion.div>
        </div>
      </div>
    </ProGuard>
  )
}
