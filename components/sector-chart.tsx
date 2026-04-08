"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { SectorExposure } from "@/lib/portfolio-analysis"

const COLORS = [
  "#06b6d4", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444",
  "#ec4899", "#3b82f6", "#14b8a6", "#f97316", "#6366f1",
  "#84cc16", "#a855f7",
]

interface Props {
  sectors: SectorExposure[]
}

export function SectorChart({ sectors }: Props) {
  if (sectors.length === 0) return null

  const data = sectors.map((s) => ({
    name: s.sector,
    value: Math.round(s.weight * 10) / 10,
  }))

  return (
    <div className="flex items-center gap-4">
      <div className="w-28 h-28 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={48}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]
                return (
                  <div className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs">
                    <span className="text-slate-200">{d.name}</span>
                    <span className="text-slate-400 ml-1">{d.value}%</span>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-1">
        {sectors.slice(0, 6).map((s, i) => (
          <div key={s.sector} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-slate-400 truncate flex-1">{s.sector}</span>
            <span className="text-slate-300">{s.weight.toFixed(1)}%</span>
          </div>
        ))}
        {sectors.length > 6 && (
          <div className="text-xs text-slate-500 pl-4">+{sectors.length - 6} more</div>
        )}
      </div>
    </div>
  )
}
