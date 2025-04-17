"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      GOOGL: [
        {
          id: "googl-1",
          title: "Google Unveils New AI Search Features at Annual Conference",
          source: "TechCrunch",
          url: "#",
          timestamp: "4 hours ago",
          sentiment: "positive",
          summary:
            "Google showcased revolutionary AI-powered search capabilities that will transform how users find information online.",
        },
        {
          id: "googl-2",
          title: "Alphabet's Ad Revenue Exceeds Expectations Despite Market Slowdown",
          source: "Wall Street Journal",
          url: "#",
          timestamp: "1 day ago",
          sentiment: "positive",
          summary:
            "Google's parent company reported stronger than expected advertising revenue, defying industry-wide slowdown trends.",
        },
        {
          id: "googl-3",
          title: "EU Regulators Launch New Investigation into Google's Ad Practices",
          source: "Reuters",
          url: "#",
          timestamp: "2 days ago",
          sentiment: "negative",
          summary:
            "European Commission opens new antitrust probe into Google's advertising technology, potentially leading to significant fines.",
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
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">Market News for {symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-auto">
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
      </CardContent>
    </Card>
  )
}
