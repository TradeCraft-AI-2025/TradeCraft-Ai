import TradingDashboard from "@/components/trading-dashboard"

export const metadata = {
  title: "Trading Dashboard | TradeCraft AI",
  description: "Advanced trading dashboard with TradingView widgets",
}

export default function TradingPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl tracking-wide uppercase font-semibold text-[#5EEAD4]">Market Analysis</h1>
        <p className="text-soft mt-2">Advanced market analysis and portfolio tracking</p>
      </div>

      <TradingDashboard />
    </div>
  )
}
