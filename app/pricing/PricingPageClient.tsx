"use client"

import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function PricingPageClient() {
  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, transparent <span className="text-[#5EEAD4]">pricing</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start free. Upgrade when you need deeper portfolio insight.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free */}
        <Card className="h-full overflow-hidden border-border/50 bg-black/40 backdrop-blur-sm relative">
          <CardHeader className="pb-3 pt-6 px-4 sm:px-6">
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Get started with portfolio tracking</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Separator className="mb-6 bg-border/40" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Unlimited holdings tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Portfolio P/L and market data</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>5 AI insights per month</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button className="w-full mt-2" variant="outline" asChild>
              <Link href="/auth">Get started</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pro */}
        <Card className="h-full overflow-hidden border-[#5EEAD4] bg-black/60 backdrop-blur-sm relative">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[#5EEAD4] to-[#FACC15]" />
          <Badge className="absolute top-4 right-4 bg-[#FACC15] text-black font-medium">Pro</Badge>
          <CardHeader className="pb-3 pt-6 px-4 sm:px-6">
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>Unlimited portfolio intelligence</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Separator className="mb-6 bg-[#5EEAD4]/30" />
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Unlimited AI insights and daily briefs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Position-level risk explanations</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-[#5EEAD4] mr-2 mt-0.5 shrink-0" />
                <span>Priority access to new features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Button
              className="w-full mt-2 bg-gradient-to-r from-[#5EEAD4] to-[#5EEAD4]/80 text-black hover:from-[#5EEAD4]/90 hover:to-[#5EEAD4]/70"
              asChild
            >
              <Link href="/auth">Upgrade to Pro</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Can I cancel anytime?</h3>
            <p className="text-muted-foreground">Yes. Cancel your Pro subscription at any time — no questions asked.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What counts as an AI insight?</h3>
            <p className="text-muted-foreground">Each position explanation or daily brief uses one insight. Free users get 5 per month.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">What payment methods are accepted?</h3>
            <p className="text-muted-foreground">All major credit and debit cards via Stripe.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Is my portfolio data private?</h3>
            <p className="text-muted-foreground">Yes. Your holdings are stored securely and never shared with third parties.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
