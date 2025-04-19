import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { StatusStrip } from "@/components/status-strip"
import { LiveWatchlist } from "@/components/live-watchlist"
import { CustomTradingView } from "@/components/custom-trading-view"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { MarketNews } from "@/components/market-news"

export const metadata: Metadata = {
  title: "Dashboard | TradeCraft AI",
  description: "Advanced trading dashboard with real-time market data",
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StatusStrip />
      <SiteHeader />
      <main className="container mx-auto flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main chart area - spans 9 columns on large screens */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Primary chart */}
            <div className="h-[500px] w-full">
              <CustomTradingView symbol="AAPL" height={500} showToolbar={true} showVolume={true} />
            </div>

            {/* Market news and recent transactions in a 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MarketNews symbol="AAPL" isLoading={false} />
              <RecentTransactions />
            </div>
          </div>

          {/* Right sidebar - spans 3 columns on large screens */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Portfolio summary */}
            <PortfolioSummary />

            {/* Live watchlist - with no event handlers */}
            <LiveWatchlist initialSymbols={["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"]} />
          </div>
        </div>
      </main>
    </div>
  )
}
