"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, PieChart, Shield, BarChart2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export function HomeContent({ hasSession }: { hasSession: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background to-background/80">
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
            Portfolio Intelligence — Beta
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
            Understand <span className="text-[#5EEAD4]">what you own</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 max-w-2xl text-muted-foreground text-base sm:text-lg md:text-xl"
          >
            TradeCraft gives self-directed investors clear insight into their holdings, concentration, and portfolio risk — in plain English.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4"
          >
            {hasSession ? (
              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-medium px-8"
                >
                  Go to portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-medium px-8"
                >
                  Try the beta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-[#5EEAD4]/30 hover:border-[#5EEAD4]/50 hover:bg-[#5EEAD4]/10 font-medium px-8"
              >
                See pricing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio clarity, not noise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple tools to help you see your portfolio clearly and make more informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <PieChart className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Holdings Breakdown</CardTitle>
                  <CardDescription className="text-base">See exactly what you own and how concentrated your positions are.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your portfolio composition, spot overweight positions, and understand where your capital is allocated.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <Shield className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Risk Insight</CardTitle>
                  <CardDescription className="text-base">Understand your portfolio risk in plain English.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get clear, jargon-free explanations of how your holdings affect your overall risk exposure.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Card className="h-full bg-background/60 backdrop-blur border-muted hover:border-[#5EEAD4]/30 transition-all">
                <CardHeader>
                  <BarChart2 className="h-12 w-12 text-[#5EEAD4] mb-2" />
                  <CardTitle className="text-2xl">Market Context</CardTitle>
                  <CardDescription className="text-base">See how market conditions relate to what you hold.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Daily briefs and position-level insights that connect market moves to your specific portfolio.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background to-background/90 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold mb-6">
              Start understanding your portfolio
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-lg text-muted-foreground mb-10">
              Add your holdings and get clear, actionable insight. Free to start — no credit card required.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <Link href={hasSession ? "/portfolio" : "/auth"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#FACC15] hover:bg-[#FACC15]/90 text-black font-medium px-8">
                  {hasSession ? "Go to portfolio" : "Try the beta"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
