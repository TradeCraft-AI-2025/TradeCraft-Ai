"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  url: string
  sentiment: "positive" | "negative" | "neutral"
  summary?: string
}

export function NewsCard() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "SPY"]

    // Prepare news sources and sentiment categorization
    const sources = ["CNBC", "Bloomberg", "Reuters", "Financial Times", "MarketWatch", "Wall Street Journal"]
    const timeFrames = ["30m", "1h", "2h", "4h", "10h", "1d"]

    // News templates for different types of articles
    const newsTemplates = {
      positive: [
        "{symbol} shares surge as company beats earnings expectations",
        "{symbol} announces new product launch, stock rallies",
        "Analyst upgrades {symbol} rating to 'Buy', raises price target",
        "{symbol} reports record quarterly revenue, shares climb",
        "{symbol} expands into new markets, investors optimistic",
        "{symbol} announces strategic partnership with tech giant",
      ],
      negative: [
        "{symbol} shares slide after missing revenue targets",
        "Analyst downgrades {symbol} citing competitive pressures",
        "{symbol} faces regulatory scrutiny, stock under pressure",
        "{symbol} warns of lower margins in coming quarter",
        "Supply chain issues could impact {symbol} production goals",
        "{symbol} recalls products due to safety concerns",
      ],
      neutral: [
        "{symbol} announces leadership changes effective next quarter",
        "{symbol} maintains guidance despite market uncertainty",
        "Investors await {symbol}'s upcoming product announcement",
        "{symbol} to present at industry conference next week",
        "{symbol} reports earnings in line with expectations",
        "{symbol} restructures operations to focus on core business",
      ],
    }

    // Generate news based on the symbols
    const generatedNews: NewsItem[] = []

    symbols.forEach((symbol) => {
      // Decide on sentiment randomly, but skew positive
      const sentimentRoll = Math.random()
      let sentiment: "positive" | "negative" | "neutral"

      if (sentimentRoll > 0.65) {
        sentiment = "negative"
      } else if (sentimentRoll > 0.35) {
        sentiment = "positive"
      } else {
        sentiment = "neutral"
      }

      // Select a random template
      const templates = newsTemplates[sentiment]
      const template = templates[Math.floor(Math.random() * templates.length)]

      // Generate the news item
      generatedNews.push({
        id: `news-${symbol}-${Date.now()}`,
        title: template.replace("{symbol}", symbol),
        source: sources[Math.floor(Math.random() * sources.length)],
        time: timeFrames[Math.floor(Math.random() * timeFrames.length)] + " ago",
        url: "#",
        sentiment: sentiment,
        summary: generateSummary(symbol, sentiment),
      })
    })

    // Sort by "recency"
    generatedNews.sort((a, b) => {
      const timeA = parseTimeAgo(a.time)
      const timeB = parseTimeAgo(b.time)
      return timeA - timeB
    })

    setNews(generatedNews)
    setLoading(false)
  }, [])

  // Helper function to generate a news summary
  function generateSummary(symbol: string, sentiment: string): string {
    const summaries = {
      positive: [
        `${symbol} reported earnings that exceeded analyst expectations by 15%, driving the stock higher in today's trading session.`,
        `The new product launch by ${symbol} is expected to open up significant revenue streams according to analysts.`,
        `Investors reacted positively to ${symbol}'s announcement of expansion into international markets.`,
      ],
      negative: [
        `${symbol} missed revenue targets by 8%, causing concern among investors about future growth prospects.`,
        `Analysts cited increasing competition as a key reason for the downgrade of ${symbol}.`,
        `The regulatory investigation into ${symbol}'s business practices could lead to significant fines.`,
      ],
      neutral: [
        `${symbol}'s new CEO will take over operations starting next quarter as part of a planned transition.`,
        `Despite market turbulence, ${symbol} maintained its previous guidance for the fiscal year.`,
        `${symbol} announced it will present its new strategy at next week's industry conference.`,
      ],
    }

    const options = summaries[sentiment as keyof typeof summaries]
    return options[Math.floor(Math.random() * options.length)]
  }

  // Helper function to parse time ago strings
  function parseTimeAgo(timeAgo: string): number {
    const [value, unit] = timeAgo.split(" ")
    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""))

    if (unit.includes("m")) return numericValue
    if (unit.includes("h")) return numericValue * 60
    if (unit.includes("d")) return numericValue * 24 * 60

    return 0
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market News</CardTitle>
        <CardDescription>Latest financial news and updates</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2 pb-4 border-b border-slate-700/30 last:border-0">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
          ) : news.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-500">No market news available at the moment</p>
            </div>
          ) : (
            news.map((item) => (
              <div key={item.id} className="border-b border-slate-700/30 pb-4 last:border-0 last:pb-0">
                <a href={item.url} className="group block">
                  <h3 className="font-medium group-hover:text-cyan-400 transition-colors">{item.title}</h3>

                  {item.summary && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.summary}</p>}

                  <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center text-slate-500">
                      <span>{item.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={
                          item.sentiment === "positive"
                            ? "text-green-500 border-green-500/20"
                            : item.sentiment === "negative"
                              ? "text-red-500 border-red-500/20"
                              : "text-cyan-500 border-cyan-500/20"
                        }
                      >
                        {item.sentiment}
                      </Badge>
                      <ExternalLink className="h-3 w-3 ml-2 text-slate-500" />
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
