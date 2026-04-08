"use client"

import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function NewsItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8 mt-0.5">
        <AvatarFallback className="bg-slate-700 text-cyan-500 text-xs">{label.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-xs font-medium text-slate-300">{label}</div>
        <div className="text-sm text-slate-400">{text}</div>
      </div>
    </div>
  )
}

export function MarketContextPanel() {
  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-100 flex items-center text-base">
          <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
          Market Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <NewsItem label="Market" text="Tech sector showing strength after positive earnings from major players." />
          <NewsItem label="Insight" text="Rising momentum in large-cap tech may affect portfolio concentration." />
          <NewsItem label="Macro" text="Federal Reserve signals potential rate cut in upcoming meeting." />
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-700/50 pt-4">
        <div className="text-xs text-slate-500">Market context is illustrative during the beta.</div>
      </CardFooter>
    </Card>
  )
}
