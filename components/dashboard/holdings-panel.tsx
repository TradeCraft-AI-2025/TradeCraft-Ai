"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HoldingWeight, SectorExposure } from "@/lib/portfolio-analysis"

function formatCurrency(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v)
}

const severityColors = {
  low: "bg-slate-700/50 text-slate-400 border-slate-600/50",
  moderate: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  high: "bg-red-500/20 text-red-400 border-red-500/50",
}

const barColors = {
  low: "from-cyan-500 to-blue-500",
  moderate: "from-amber-500 to-amber-400",
  high: "from-red-500 to-red-400",
}

interface Props {
  weights: HoldingWeight[]
  sectors: SectorExposure[]
}

export function HoldingsPanel({ weights, sectors }: Props) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 text-base">Concentration X-Ray</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Holding weights */}
        <div className="space-y-3 mb-6">
          {weights.map((w) => (
            <div key={w.symbol}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">{w.symbol}</span>
                  <span className="text-slate-500 text-xs">{formatCurrency(w.value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">{w.weight.toFixed(1)}%</span>
                  {w.severity !== "low" && (
                    <Badge className={`text-[10px] px-1.5 py-0 ${severityColors[w.severity]}`}>
                      {w.severity === "high" ? "High" : "Notable"}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${barColors[w.severity]} rounded-full transition-all`}
                  style={{ width: `${Math.min(w.weight, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sector exposure */}
        <div className="pt-4 border-t border-slate-700/50">
          <h4 className="text-sm text-slate-400 mb-3">Sector Exposure</h4>
          <div className="space-y-2">
            {sectors.map((s) => (
              <div key={s.sector} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">{s.sector}</span>
                  <span className="text-slate-600 text-xs">({s.symbols.join(", ")})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{s.weight.toFixed(1)}%</span>
                  {s.severity !== "low" && (
                    <Badge className={`text-[10px] px-1.5 py-0 ${severityColors[s.severity]}`}>
                      {s.severity === "high" ? "High" : "Notable"}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
