"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, LineChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { EmailCaptureModal } from "@/components/email-capture-modal"
import { useState, useEffect } from "react"

export default function Home() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if the modal has been shown before
    const hasModalBeenShown = localStorage.getItem("emailModalShown")

    if (!hasModalBeenShown) {
      // Show modal after 5 seconds
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    // Remember that the modal has been shown
    localStorage.setItem("emailModalShown", "true")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Full-width background with centered content */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background to-background/80">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-30"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5EEAD4]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FACC15]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-lg bg-[#5EEAD4]/10 px-3 py-1 text-sm text-[#5EEAD4] mb-6"
          >
            Trading Intelligence Platform
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl"
          >
            TradeCraft AI: <span className="text-[#5EEAD4]">Sharpen Your Edge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-2xl text-muted-foreground text-base sm:text-lg md:text-xl"
          >
            Advanced market analysis, backtesting, and strategy building powered by artificial intelligence. Take your
            trading to the next level with TradeCraft AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-medium px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10 font-medium px-8"
              >
                See Demo
              </Button>
            </Link>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl"
          >
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold text-[#5EEAD4]">10,000+</p>
              <p className="text-sm text-muted-foreground">Active Traders</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-bold text-[#5EEAD4]">98%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="flex flex-col items-center md:col-span-1 col-span-2 mx-auto">
              <p className="text-3xl md:text-4xl font-bold text-[#5EEAD4]">24/7</p>
              <p className="text-sm text-muted-foreground">Market Analysis</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 md:py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Trading Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools gives you the edge in today's competitive markets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <BarChart2 className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Backtest</CardTitle>
                  <CardDescription className="text-base">
                    Test your trading strategies against historical market data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our backtesting engine allows you to validate strategies before risking real capital, with detailed
                    performance metrics and risk analysis.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Strategy Builder</CardTitle>
                  <CardDescription className="text-base">
                    Create custom trading strategies with our AI-powered builder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Combine technical indicators and optimize parameters for your unique trading style, with AI
                    suggestions to improve performance.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <LineChart className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Live Watchlist</CardTitle>
                  <CardDescription className="text-base">
                    Monitor your favorite assets with real-time data and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay on top of market movements with customizable watchlists, price alerts, and AI-powered trade
                    signals for optimal entry and exit points.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background to-background/90 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to transform your trading?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-10"
            >
              Join thousands of traders using TradeCraft AI to gain an edge in the markets. Start for free, no credit
              card required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-4"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-medium px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pro" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10 font-medium px-8"
                >
                  Explore Pro Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Email Capture Modal */}
      <EmailCaptureModal isOpen={showModal} onClose={handleCloseModal} />
    </div>
  )
}
