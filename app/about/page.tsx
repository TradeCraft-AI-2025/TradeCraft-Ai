"use client"

import { motion } from "framer-motion"
import { ArrowRight, Brain, BarChartIcon as ChartBar, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-12 relative z-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          About <span className="text-[#5EEAD4]">TradeCraft</span> AI
        </h1>
        <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-slate-300 italic">
          "Markets move fast. You should move faster."
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-black/40 border-white/10 h-full">
            <CardContent className="p-6 space-y-6">
              <p className="text-lg">
                In a world flooded with noise, hype, and algorithmic chaos, TradeCraft AI was built for clarity.
              </p>

              <p>
                We believe in empowering a new wave of traders — not with loud alerts or overpriced courses — but with
                tools that think with you, not just for you.
              </p>

              <p>
                TradeCraft AI is a platform for those who don't just want to trade — they want to understand. For the
                ones who study patterns, chase edge, and know that intuition means nothing without information.
              </p>

              <div className="py-4">
                <p className="mb-4">
                  This isn't about signals and speculation — it's about sharpening your edge through data, logic, and
                  design that doesn't get in your way.
                </p>

                <p className="font-medium">We built this platform for the thinkers.</p>
                <ul className="list-none space-y-2 pl-6 mt-2">
                  <li className="text-slate-300">For the night-owls running tests on SPY.</li>
                  <li className="text-slate-300">For the early risers reviewing candle setups.</li>
                  <li className="text-slate-300">For the ones who would rather build tools than borrow them.</li>
                </ul>
              </div>

              <p className="text-lg font-medium">
                TradeCraft AI is more than a trading app.
                <br />
                It's a mindset — powered by data, driven by discipline.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-black/40 border-white/10 h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-[#5EEAD4]" />
                Our Dashboard Features
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#5EEAD4]/10 p-2 rounded-lg mr-4">
                    <ChartBar className="h-6 w-6 text-[#5EEAD4]" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Strategy Builders</h3>
                    <p className="text-sm text-slate-300">That simplify the complex</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#5EEAD4]/10 p-2 rounded-lg mr-4">
                    <Brain className="h-6 w-6 text-[#5EEAD4]" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Backtesters</h3>
                    <p className="text-sm text-slate-300">That reveal what actually works</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#5EEAD4]/10 p-2 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-[#5EEAD4]" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Charting Tools</h3>
                    <p className="text-sm text-slate-300">That speak your language</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <Link href="/dashboard">
                  <Button className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <div className="bg-gradient-to-r from-[#5EEAD4]/20 via-[#FACC15]/20 to-[#5EEAD4]/20 p-8 rounded-lg border border-[#5EEAD4]/30 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to sharpen your edge?</h2>
          <p className="text-slate-300 mb-6">
            Join the traders who are using data and discipline to transform their approach to the markets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
                Get Started
              </Button>
            </Link>
            <Link href="/pro">
              <Button
                size="lg"
                variant="outline"
                className="border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10"
              >
                Explore Pro Features
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
