"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, LineChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="space-y-6 pb-8 pt-12 md:pb-12 md:pt-24 lg:py-32">
        <div className="container flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-lg bg-[#5EEAD4]/10 px-3 py-1 text-sm text-[#5EEAD4] mb-4"
          >
            Introducing TradeCraft AI
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <Logo variant="large" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Your AI-Powered Trading Terminal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[42rem] text-muted-foreground sm:text-xl"
          >
            Advanced market analysis, backtesting, and strategy building powered by artificial intelligence. Take your
            trading to the next level with TradeCraft AI.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                Open Trading Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pro">
              <Button
                size="lg"
                variant="outline"
                className="border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10"
              >
                Explore Pro Tools
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <LineChart className="h-10 w-10 text-[#5EEAD4] mb-2" />
                <CardTitle>Real-Time Charts</CardTitle>
                <CardDescription>
                  Access professional-grade charts with advanced indicators and drawing tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Powered by TradingView integration, our charts provide real-time data across multiple timeframes.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <BarChart2 className="h-10 w-10 text-[#5EEAD4] mb-2" />
                <CardTitle>Strategy Backtesting</CardTitle>
                <CardDescription>Test your trading strategies against historical market data.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our backtesting engine allows you to validate strategies before risking real capital.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-background/60 backdrop-blur border-muted">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-[#5EEAD4] mb-2" />
                <CardTitle>AI Strategy Builder</CardTitle>
                <CardDescription>Create custom trading strategies with our AI-powered builder.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Combine technical indicators and optimize parameters for your unique trading style.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 md:py-24 lg:py-32 border-t border-border/40">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Ready to transform your trading?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-4 max-w-[42rem] text-muted-foreground sm:text-xl"
          >
            Join thousands of traders using TradeCraft AI to gain an edge in the markets.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-8"
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
