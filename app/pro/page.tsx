"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChartIcon as ChartBar, Lock, Sparkles, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProSubscriptionModal } from "@/components/pro-subscription-modal"

export default function ProToolsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleUpgradeClick = () => {
    // Option 1: Open the modal first
    setIsModalOpen(true)

    // Option 2: Go directly to checkout page
    // router.push('/checkout')
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <Badge className="mb-4 bg-[#5EEAD4]/20 text-[#5EEAD4] hover:bg-[#5EEAD4]/30">
          <Lock className="mr-1 h-3 w-3" /> Pro Features
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced Trading Tools</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Unlock powerful tools designed to enhance your trading strategy and performance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-background/60 backdrop-blur border-muted h-full">
            <CardHeader>
              <ChartBar className="h-10 w-10 text-[#5EEAD4] mb-2" />
              <CardTitle>Backtester Tool</CardTitle>
              <CardDescription>Test your trading strategies against historical market data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Upload your own OHLCV data or use our market data to backtest various trading strategies. Analyze
                performance metrics and optimize your approach.
              </p>
              <div className="bg-[#5EEAD4]/5 border border-[#5EEAD4]/20 rounded-md p-4 mb-4">
                <h4 className="font-medium flex items-center text-[#5EEAD4] mb-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Pro Feature
                </h4>
                <p className="text-xs text-muted-foreground">
                  Access comprehensive backtesting with detailed performance metrics and unlimited historical data.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/pro/backtest" className="w-full">
                <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                  Open Backtester
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-background/60 backdrop-blur border-muted h-full">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-[#5EEAD4] mb-2" />
              <CardTitle>Strategy Builder</CardTitle>
              <CardDescription>Create custom trading strategies with our AI-powered builder</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Combine technical indicators and optimize parameters for your unique trading style. Our AI will help you
                refine your strategy for better performance.
              </p>
              <div className="bg-[#5EEAD4]/5 border border-[#5EEAD4]/20 rounded-md p-4 mb-4">
                <h4 className="font-medium flex items-center text-[#5EEAD4] mb-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Pro Feature
                </h4>
                <p className="text-xs text-muted-foreground">
                  Access advanced indicators, AI optimization, and downloadable strategy presets.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/pro/builder" className="w-full">
                <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                  Open Strategy Builder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 flex flex-col items-center text-center"
      >
        <div className="bg-gradient-to-r from-[#5EEAD4]/20 via-[#FACC15]/20 to-[#5EEAD4]/20 p-8 rounded-lg border border-[#5EEAD4]/30 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Unlock Pro Features</h2>
          <p className="text-muted-foreground mb-6">
            Get unlimited access to all our professional trading tools and features, including your own personalized
            Finance AI that adapts to your portfolio, backtesting strategies, and experience level. Take your trading to
            the next level with TradeCraft AI Pro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black" onClick={handleUpgradeClick}>
              Unlock Your AI Assistant
              <Lock className="ml-2 h-4 w-4" />
            </Button>
            <Link href="/checkout">
              <Button
                size="lg"
                variant="outline"
                className="border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10"
              >
                View Pricing Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <ProSubscriptionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
