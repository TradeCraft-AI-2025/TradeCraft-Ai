"use client"

import { AlertTriangle, AlertCircle, CheckCircle, ArrowRight, PieChart } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PortfolioAnalysis, Severity } from "@/lib/portfolio-analysis"
import { SectorChart } from "@/components/sector-chart"

const severityColors: Record<Severity, string> = {
  low: "bg-slate-700/50 text-slate-400 border-slate-600/50",
  moderate: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  high: "bg-red-500/20 text-red-400 border-red-500/50",
}

const flagIcons: Record<Severity, typeof AlertTriangle> = {
  high: AlertTriangle,
  moderate: AlertCircle,
  low: CheckCircle,
}

interface Props {
  analysis: PortfolioAnalysis
}

export function PortfolioInsights({ analysis }: Props) {
  const topFlags = analysis.riskFlags.slice(0, 3)

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-slate-100 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-cyan-500" />
            Portfolio Insights
          </CardTitle>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 text-xs h-7">
              Full overview <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary brief */}
        <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>

        {/* Sector chart */}
        {analysis.sectors.length > 0 && (
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-3">Sector Exposure</h4>
            <SectorChart sectors={analysis.sectors} />
          </div>
        )}

        {/* Top concentration */}
        {analysis.weights.length > 0 && (
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Concentration</h4>
            <div className="space-y-2">
              {analysis.weights.slice(0, 5).map((w) => (
                <div key={w.symbol} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{w.symbol}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          w.severity === "high" ? "bg-red-500" :
                          w.severity === "moderate" ? "bg-amber-500" : "bg-cyan-500"
                        }`}
                        style={{ width: `${Math.min(w.weight, 100)}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs w-12 text-right">{w.weight.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk flags */}
        {topFlags.length > 0 && (
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wide mb-2">Risk Flags</h4>
            <div className="space-y-2">
              {topFlags.map((flag) => {
                const Icon = flagIcons[flag.severity]
                return (
                  <div key={flag.id} className="flex items-center gap-2 text-sm">
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${
                      flag.severity === "high" ? "text-red-400" :
                      flag.severity === "moderate" ? "text-amber-400" : "text-green-400"
                    }`} />
                    <span className="text-slate-300">{flag.title}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ml-auto ${severityColors[flag.severity]}`}>
                      {flag.severity}
                    </Badge>
                  </div>
                )
              })}
              {analysis.riskFlags.length > 3 && (
                <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-400">
                  +{analysis.riskFlags.length - 3} more on dashboard →
                </Link>
              )}
            </div>
          </div>
        )}

        {topFlags.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-3.5 w-3.5" />
            No risk flags. Portfolio looks well-balanced.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
