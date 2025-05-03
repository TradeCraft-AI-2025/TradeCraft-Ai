"use client"

import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PricingPageClient() {
  const handleSelectPlan = (plan: string) => {
    if (plan === "free") {
      window.location.href = "/signup"
    } else if (plan === "subscription") {
      window.location.href = "/checkout?plan=subscription"
    } else if (plan === "lifetime") {
      window.location.href = "/checkout?plan=lifetime"
    }
  }

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Pricing Plans for Every <span className="text-[#5EEAD4]">Trader</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan to elevate your trading strategy with our AI-powered tools and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="h-full overflow-hidden border-border/50 bg-black/40 backdrop-blur-sm relative">
          <CardHeader className="pb-3 pt-6 px-4 sm:px-6">
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Get started with basic trading tools</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 px-4 sm:px-6">
            <Separator className="mb-6 bg-border/40" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Real-time market data for major indices</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Basic watchlist with up to 5 stocks</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Limited historical data (up to 30 days)</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button className="w-full mt-2" variant="outline" onClick={() => handleSelectPlan("free")}>
              Select Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Monthly Plan - Highlighted */}
        <Card className="h-full overflow-hidden border-[#5EEAD4] bg-black/60 backdrop-blur-sm relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#5EEAD4] to-[#FACC15]" />
          <Badge className="absolute top-4 right-4 bg-[#FACC15] text-black font-medium">Most Popular</Badge>
          <CardHeader className="pb-3 pt-6 px-4 sm:px-6">
            <CardTitle className="text-2xl">Pro Monthly</CardTitle>
            <CardDescription>Advanced tools for serious traders</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 px-4 sm:px-6">
            <Separator className="mb-6 bg-[#5EEAD4]/30" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>AI-powered trading recommendations and insights</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Unlimited backtesting with comprehensive historical data</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Advanced portfolio analytics and risk assessment</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button
              className="w-full mt-2 bg-gradient-to-r from-[#5EEAD4] to-[#5EEAD4]/80 text-black hover:from-[#5EEAD4]/90 hover:to-[#5EEAD4]/70"
              onClick={() => handleSelectPlan("subscription")}
            >
              Select Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Lifetime Plan */}
        <Card className="h-full overflow-hidden border-border/50 bg-black/40 backdrop-blur-sm relative">
          <CardHeader className="pb-3 pt-6 px-4 sm:px-6">
            <CardTitle className="text-2xl">Pro Lifetime</CardTitle>
            <CardDescription>One-time payment, lifetime access</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$29.99</span>
              <span className="text-muted-foreground ml-2">one-time</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 px-4 sm:px-6">
            <Separator className="mb-6 bg-border/40" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>All Pro Monthly features with lifetime access</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Priority access to new features and updates</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Exclusive strategy templates and custom alerts</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button className="w-full mt-2" variant="outline" onClick={() => handleSelectPlan("lifetime")}>
              Select Plan
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I upgrade or downgrade my plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your
              next billing cycle.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Is there a free trial for Pro plans?</h3>
            <p className="text-muted-foreground">
              We offer a 7-day free trial for our Pro Monthly plan. No credit card required to start your trial.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and select cryptocurrency payments.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What's the difference between the plans?</h3>
            <p className="text-muted-foreground">
              Pro plans offer advanced AI features, unlimited backtesting, and comprehensive analytics that aren't
              available in the Free plan.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <div className="inline-block p-px bg-gradient-to-r from-[#5EEAD4] via-[#FACC15] to-[#5EEAD4] rounded-lg">
          <div className="bg-black rounded-lg px-8 py-10">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our team is here to help you choose the right plan for your trading needs.
            </p>
            <Button asChild className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
