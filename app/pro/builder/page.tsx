"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ProGuard } from "@/components/pro-guard"

export default function StrategyBuilderPage() {
  const [selectedIndicators, setSelectedIndicators] = useState({
    sma: true,
    ema: false,
    rsi: true,
    macd: false,
  })
  const [parameters, setParameters] = useState({
    smaPeriod: [20],
    emaPeriod: [14],
    rsiThreshold: [30],
    macdFast: [12],
    macdSlow: [26],
    macdSignal: [9],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const generateStrategy = () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 2000)
  }

  const handleIndicatorChange = (indicator: string, checked: boolean) => {
    setSelectedIndicators({
      ...selectedIndicators,
      [indicator]: checked,
    })
  }

  return (
    <ProGuard>
      <div className="container py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight mb-6"
        >
          AI Strategy Builder
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
                <CardTitle>Strategy Configuration</CardTitle>
                <CardDescription>Select indicators and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Indicators</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sma"
                        checked={selectedIndicators.sma}
                        onCheckedChange={(checked) => handleIndicatorChange("sma", checked as boolean)}
                      />
                      <Label htmlFor="sma">SMA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ema"
                        checked={selectedIndicators.ema}
                        onCheckedChange={(checked) => handleIndicatorChange("ema", checked as boolean)}
                      />
                      <Label htmlFor="ema">EMA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rsi"
                        checked={selectedIndicators.rsi}
                        onCheckedChange={(checked) => handleIndicatorChange("rsi", checked as boolean)}
                      />
                      <Label htmlFor="rsi">RSI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="macd"
                        checked={selectedIndicators.macd}
                        onCheckedChange={(checked) => handleIndicatorChange("macd", checked as boolean)}
                      />
                      <Label htmlFor="macd">MACD</Label>
                    </div>
                  </div>
                </div>

                {selectedIndicators.sma && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sma-period">SMA Period</Label>
                      <span className="text-sm">{parameters.smaPeriod[0]}</span>
                    </div>
                    <Slider
                      id="sma-period"
                      min={5}
                      max={200}
                      step={1}
                      value={parameters.smaPeriod}
                      onValueChange={(value) => setParameters({ ...parameters, smaPeriod: value })}
                    />
                  </div>
                )}

                {selectedIndicators.ema && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ema-period">EMA Period</Label>
                      <span className="text-sm">{parameters.emaPeriod[0]}</span>
                    </div>
                    <Slider
                      id="ema-period"
                      min={5}
                      max={200}
                      step={1}
                      value={parameters.emaPeriod}
                      onValueChange={(value) => setParameters({ ...parameters, emaPeriod: value })}
                    />
                  </div>
                )}

                {selectedIndicators.rsi && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rsi-threshold">RSI Threshold</Label>
                      <span className="text-sm">{parameters.rsiThreshold[0]}</span>
                    </div>
                    <Slider
                      id="rsi-threshold"
                      min={10}
                      max={90}
                      step={1}
                      value={parameters.rsiThreshold}
                      onValueChange={(value) => setParameters({ ...parameters, rsiThreshold: value })}
                    />
                  </div>
                )}

                {selectedIndicators.macd && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="macd-fast">MACD Fast Period</Label>
                        <span className="text-sm">{parameters.macdFast[0]}</span>
                      </div>
                      <Slider
                        id="macd-fast"
                        min={5}
                        max={30}
                        step={1}
                        value={parameters.macdFast}
                        onValueChange={(value) => setParameters({ ...parameters, macdFast: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="macd-slow">MACD Slow Period</Label>
                        <span className="text-sm">{parameters.macdSlow[0]}</span>
                      </div>
                      <Slider
                        id="macd-slow"
                        min={15}
                        max={50}
                        step={1}
                        value={parameters.macdSlow}
                        onValueChange={(value) => setParameters({ ...parameters, macdSlow: value })}
                      />
                    </div>
                  </>
                )}

                <Button
                  onClick={generateStrategy}
                  disabled={isGenerating}
                  className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black"
                >
                  {isGenerating ? "Generating..." : "Generate Strategy"}
                  {!isGenerating && <Sparkles className="ml-2 h-4 w-4" />}
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
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Generated Strategy</CardTitle>
                    <CardDescription>Your custom trading strategy</CardDescription>
                  </div>
                  {isGenerated && (
                    <Badge className="bg-[#5EEAD4]/20 text-[#5EEAD4] hover:bg-[#5EEAD4]/30">
                      <Sparkles className="mr-1 h-3 w-3" /> AI Generated
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-t-[#5EEAD4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-3 border-4 border-t-transparent border-r-[#5EEAD4] border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Generating Strategy</h3>
                    <p className="text-muted-foreground max-w-md">
                      Our AI is analyzing your parameters and creating an optimized trading strategy...
                    </p>
                  </div>
                )}

                {!isGenerating && !isGenerated && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Sparkles className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Strategy Generated Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select your indicators and parameters, then click "Generate Strategy" to create a custom trading
                      strategy.
                    </p>
                  </div>
                )}

                {isGenerated && (
                  <div className="space-y-6">
                    <div className="bg-background/40 rounded-lg p-6 border border-border">
                      <h3 className="text-lg font-medium mb-4">Strategy Summary</h3>
                      <p className="text-muted-foreground mb-4">
                        This strategy combines SMA crossover with RSI oversold conditions to identify potential buying
                        opportunities in trending markets.
                      </p>

                      <div className="bg-background/60 p-4 rounded-md border border-border mb-4">
                        <h4 className="font-medium mb-2">Entry Conditions:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>SMA(20) crosses above SMA(50)</li>
                          <li>RSI(14) is below 30 (oversold)</li>
                          <li>Price is above SMA(200) for trend confirmation</li>
                        </ul>
                      </div>

                      <div className="bg-background/60 p-4 rounded-md border border-border">
                        <h4 className="font-medium mb-2">Exit Conditions:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          <li>SMA(20) crosses below SMA(50)</li>
                          <li>RSI(14) is above 70 (overbought)</li>
                          <li>Take profit at 15% gain</li>
                          <li>Stop loss at 5% loss</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-background/40 rounded-lg p-4 border border-border">
                      <h3 className="text-lg font-medium mb-4">Strategy Code</h3>
                      <pre className="bg-black/50 p-4 rounded-md text-sm overflow-auto">
                        {`// TradeCraft AI Generated Strategy
// SMA Crossover with RSI Filter

function initialize(context) {
  context.smaShort = 20;
  context.smaLong = 50;
  context.smaTrend = 200;
  context.rsiPeriod = 14;
  context.rsiOversold = 30;
  context.rsiOverbought = 70;
  context.takeProfitPct = 15;
  context.stopLossPct = 5;
}

function onData(context, data) {
  // Calculate indicators
  const shortSMA = SMA(data.close, context.smaShort);
  const longSMA = SMA(data.close, context.smaLong);
  const trendSMA = SMA(data.close, context.smaTrend);
  const rsi = RSI(data.close, context.rsiPeriod);
  
  // Entry logic
  if (!context.position) {
    const shortSMACrossedAbove = crossedAbove(shortSMA, longSMA);
    const isOversold = rsi < context.rsiOversold;
    const isTrending = data.close > trendSMA;
    
    if (shortSMACrossedAbove && isOversold && isTrending) {
      buy(context, data);
    }
  }
  // Exit logic
  else {
    const shortSMACrossedBelow = crossedBelow(shortSMA, longSMA);
    const isOverbought = rsi > context.rsiOverbought;
    const hitTakeProfit = (data.close / context.entryPrice - 1) * 100 >= context.takeProfitPct;
    const hitStopLoss = (data.close / context.entryPrice - 1) * 100 <= -context.stopLossPct;
    
    if (shortSMACrossedBelow || isOverbought || hitTakeProfit || hitStopLoss) {
      sell(context, data);
    }
  }
}`}
                      </pre>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                        <Download className="mr-2 h-4 w-4" />
                        Download Strategy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProGuard>
  )
}
