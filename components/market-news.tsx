"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  summary: string
}

interface MarketNewsProps {
  symbol: string
  isLoading: boolean
}

export function MarketNews({ symbol, isLoading }: MarketNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return

    setLoading(true)

    // Simulate API call to fetch news
    setTimeout(() => {
      setNews(generateNewsForSymbol(symbol))
      setLoading(false)
    }, 1000)
  }, [symbol, isLoading])

  // Generate mock news data based on the symbol
  const generateNewsForSymbol = (symbol: string): NewsItem[] => {
    const baseNews: Record<string, NewsItem[]> = {
      AAPL: [
        {
          id: "aapl-1",
          title: "Apple's New AI Features Set to Revolutionize iPhone Experience",
          source: "TechCrunch",
          url: "#",
          timestamp: "2 hours ago",
          sentiment: "positive",
          summary:
            "Apple is set to introduce groundbreaking AI features in its next iOS update, potentially changing how users interact with their devices.",
        },
        {
          id: "aapl-2",
          title: "Apple Reports Record Q2 Earnings, Boosts Dividend by 10%",
          source: "CNBC",
          url: "#",
          timestamp: "5 hours ago",
          sentiment: "positive",
          summary:
            "Apple Inc. reported quarterly revenue of $94.8 billion, exceeding analyst expectations and announced a 10% increase in its quarterly dividend.",
        },
        {
          id: "aapl-3",
          title: "Supply Chain Constraints May Impact Apple's Production Goals",
          source: "Bloomberg",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "negative",
          summary:
            "Ongoing supply chain issues in Asia could impact Apple's production targets for the upcoming quarter, analysts warn.",
        },
      ],
      MSFT: [
        {
          id: "msft-1",
          title: "Microsoft's Cloud Business Continues to Drive Growth",
          source: "Reuters",
          url: "#",
          timestamp: "3 hours ago",
          sentiment: "positive",
          summary:
            "Microsoft's Azure cloud services saw a 27% growth in the last quarter, continuing to be the company's main growth driver.",
        },
        {
          id: "msft-2",
          title: "Microsoft Expands AI Partnership with OpenAI",
          source: "The Verge",
          url: "#",
          timestamp: "6 hours ago",
          sentiment: "positive",
          summary:
            "Microsoft announced an expanded partnership with OpenAI, integrating more advanced AI capabilities across its product lineup.",
        },
        {
          id: "msft-3",
          title: "Antitrust Concerns Rise as Microsoft's Acquisition Strategy Continues",
          source: "Financial Times",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "negative",
          summary:
            "Regulators express concerns over Microsoft's recent acquisition spree, potentially leading to increased scrutiny.",
        },
      ],
      TSLA: [
        {
          id: "tsla-1",
          title: "Tesla Unveils Next-Generation Self-Driving Technology",
          source: "Electrek",
          url: "#",
          timestamp: "1 hour ago",
          sentiment: "positive",
          summary:
            "Tesla's latest FSD update shows significant improvements in urban driving scenarios, bringing level 4 autonomy closer to reality.",
        },
        {
          id: "tsla-2",
          title: "Tesla's Berlin Gigafactory Reaches Production Milestone",
          source: "Reuters",
          url: "#",
          timestamp: "4 hours ago",
          sentiment: "positive",
          summary:
            "Tesla's Berlin Gigafactory has reached its target of producing 5,000 vehicles per week, a significant milestone for European operations.",
        },
        {
          id: "tsla-3",
          title: "Tesla Recalls 80,000 Vehicles Over Software Issue",
          source: "CNBC",
          url: "#",
          timestamp: "2 days ago",
          sentiment: "negative",
          summary:
            "Tesla has issued a recall for approximately 80,000 vehicles due to a software issue affecting the vehicle's display system.",
        },
      ],
      NVDA: [
        {
          id: "nvda-1",
          title: "NVIDIA Announces Next-Gen GPU Architecture",
          source: "AnandTech",
          url: "#",
          timestamp: "2 hours ago",
          sentiment: "positive",
          summary:
            "NVIDIA unveiled its next-generation GPU architecture, promising significant performance improvements for AI and gaming applications.",
        },
        {
          id: "nvda-2",
          title: "NVIDIA Stock Hits All-Time High on AI Demand",
          source: "MarketWatch",
          url: "#",
          timestamp: "5 hours ago",
          sentiment: "positive",
          summary:
            "NVIDIA shares reached a new all-time high as demand for AI chips continues to surge across various industries.",
        },
        {
          id: "nvda-3",
          title: "Chip Shortage May Impact NVIDIA's Production Capacity",
          source: "Bloomberg",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "neutral",
          summary:
            "Industry analysts suggest ongoing chip shortages could impact NVIDIA's ability to meet the growing demand for its products.",
        },
      ],
      SPY: [
        {
          id: "spy-1",
          title: "S&P 500 Reaches New Record High as Tech Stocks Rally",
          source: "Wall Street Journal",
          url: "#",
          timestamp: "1 hour ago",
          sentiment: "positive",
          summary:
            "The S&P 500 index reached a new all-time high today, driven primarily by strong performance in the technology sector.",
        },
        {
          id: "spy-2",
          title: "Fed's Rate Decision Boosts Market Sentiment",
          source: "CNBC",
          url: "#",
          timestamp: "3 hours ago",
          sentiment: "positive",
          summary:
            "The Federal Reserve's latest interest rate decision has positively impacted market sentiment, with the S&P 500 gaining 1.2%.",
        },
        {
          id: "spy-3",
          title: "Market Volatility Expected as Earnings Season Approaches",
          source: "Bloomberg",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "neutral",
          summary:
            "Analysts predict increased market volatility in the coming weeks as major companies prepare to release their quarterly earnings reports.",
        },
      ],
    }

    // Generate generic news for symbols without specific news
    if (!baseNews[symbol]) {
      return [
        {
          id: `${symbol.toLowerCase()}-1`,
          title: `${symbol} Announces Quarterly Earnings Above Expectations`,
          source: "Financial Times",
          url: "#",
          timestamp: "2 hours ago",
          sentiment: "positive",
          summary: `${symbol} reported quarterly earnings that exceeded analyst expectations, driven by strong performance in its core business segments.`,
        },
        {
          id: `${symbol.toLowerCase()}-2`,
          title: `Analyst Upgrades ${symbol} to "Buy" with Increased Price Target`,
          source: "CNBC",
          url: "#",
          timestamp: "5 hours ago",
          sentiment: "positive",
          summary: `A leading Wall Street analyst has upgraded ${symbol} to a "Buy" rating, citing improved growth prospects and competitive positioning.`,
        },
        {
          id: `${symbol.toLowerCase()}-3`,
          title: `${symbol} Faces Challenges in Current Market Environment`,
          source: "Bloomberg",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "negative",
          summary: `${symbol} may face headwinds in the coming quarters due to macroeconomic factors and industry-specific challenges, according to recent analysis.`,
        },
      ]
    }

    return baseNews[symbol]
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Positive</Badge>
      case "negative":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Negative</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Neutral</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-black/40 border-white/10">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-full bg-white/10" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 bg-white/10" />
                  <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-16 w-full bg-white/10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="bg-black/40 border-white/10 hover:bg-black/50 transition-colors">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-white">{item.title}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{item.source}</span>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.timestamp}
                  </div>
                </div>
                {getSentimentBadge(item.sentiment)}
              </div>
              <p className="text-sm text-gray-300">{item.summary}</p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-[#5EEAD4] hover:text-[#5EEAD4]/80">
                  Read More <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
