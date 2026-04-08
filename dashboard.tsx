"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Wallet } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createBrowserSupabaseClient } from "@/lib/supabase-browser"
import { analyzePortfolio, type PortfolioAnalysis } from "@/lib/portfolio-analysis"
import type { PortfolioHolding } from "@/lib/types"

import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { HoldingsPanel } from "@/components/dashboard/holdings-panel"
import { RiskPanel } from "@/components/dashboard/risk-panel"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { MarketContextPanel } from "@/components/dashboard/market-context-panel"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setIsLoading(false); return }

        const { data, error } = await supabase
          .from("portfolios")
          .select("holdings")
          .eq("user_id", user.id)
          .single()

        if (!error && data) {
          const holdings = data.holdings as PortfolioHolding[]
          if (holdings && holdings.length > 0) {
            setAnalysis(analyzePortfolio(holdings))
          }
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading overview...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4 bg-slate-900/90 border border-slate-700/50 rounded-lg p-8">
          <Wallet className="h-12 w-12 text-slate-500 mx-auto" />
          <p className="text-lg text-slate-200">No holdings yet</p>
          <p className="text-sm text-slate-400">Add positions to your portfolio to see your overview here.</p>
          <Link href="/portfolio">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              Go to Portfolio <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Portfolio Overview</h1>
            <p className="text-sm text-slate-400">{analysis.holdingCount} holdings tracked</p>
          </div>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">Beta</Badge>
        </header>

        <div className="grid gap-6">
          {/* Row 1: Portfolio overview with summary brief */}
          <PortfolioOverview analysis={analysis} />

          {/* Row 2: Concentration + Risk side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HoldingsPanel weights={analysis.weights} sectors={analysis.sectors} />
            <RiskPanel riskFlags={analysis.riskFlags} />
          </div>

          {/* Row 3: Alerts + Market context */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel />
            <MarketContextPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
