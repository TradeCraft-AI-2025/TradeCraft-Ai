"use client"

import { LineChart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioAnalysis } from "@/lib/portfolio-analysis"

function formatCurrency(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)
}

function SummaryCard({ label, value, sub, positive }: { label: string; value: string; sub: string; positive?: boolean }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="text-xs text-slate-400 mb-1">{label}</div>
        <div className="text-2xl font-mono text-slate-100">{value}</div>
        <div className={`text-xs mt-1 ${positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-slate-400"}`}>{sub}</div>
      </CardContent>
    </Card>
  )
}

interface Props {
  analysis: PortfolioAnalysis
}

export function PortfolioOverview({ analysis }: Props) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
      <CardHeader className="border-b border-slate-700/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center">
            <LineChart className="mr-2 h-5 w-5 text-cyan-500" />
            Portfolio Overview
          </CardTitle>
          <Link href="/portfolio">
            <Button variant="ghost" size="sm" className="text-slate-400 text-xs">
              View holdings <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Summary brief */}
        <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            label="Total Value"
            value={formatCurrency(analysis.totalValue)}
            sub={`${analysis.plPercent >= 0 ? "+" : ""}${analysis.plPercent.toFixed(2)}% overall`}
            positive={analysis.plPercent >= 0}
          />
          <SummaryCard
            label="Total Cost"
            value={formatCurrency(analysis.totalCost)}
            sub={`${analysis.holdingCount} positions`}
          />
          <SummaryCard
            label="P/L"
            value={formatCurrency(analysis.totalPL)}
            sub={`${analysis.plPercent >= 0 ? "+" : ""}${analysis.plPercent.toFixed(2)}%`}
            positive={analysis.totalPL >= 0}
          />
        </div>
      </CardContent>
    </Card>
  )
}
