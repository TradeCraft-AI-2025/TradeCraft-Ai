"use client"

import { Shield, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RiskFlag } from "@/lib/portfolio-analysis"

const iconByLevel = {
  high: AlertTriangle,
  moderate: AlertCircle,
  low: CheckCircle,
}

const colorByLevel = {
  high: "text-red-400 bg-red-500/10 border-red-500/30",
  moderate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  low: "text-green-400 bg-green-500/10 border-green-500/30",
}

interface Props {
  riskFlags: RiskFlag[]
}

export function RiskPanel({ riskFlags }: Props) {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100 flex items-center text-base">
          <Shield className="mr-2 h-5 w-5 text-cyan-500" />
          Risk Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        {riskFlags.length === 0 ? (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
            <p className="text-sm text-green-300">No risk flags detected. Your portfolio looks well-balanced.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {riskFlags.map((flag) => {
              const Icon = iconByLevel[flag.severity]
              return (
                <div key={flag.id} className={`flex items-start gap-3 p-3 rounded-md border ${colorByLevel[flag.severity]}`}>
                  <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{flag.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{flag.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-700/50">
          Risk flags are computed from your holdings data. No AI involved.
        </div>
      </CardContent>
    </Card>
  )
}
