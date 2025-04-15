"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { loadStripe } from "@stripe/stripe-js"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface ProSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PlanType = "subscription" | "lifetime"

export function ProSubscriptionModal({ open, onOpenChange }: ProSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("subscription")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // Pre-fill email if user is logged in
  useState(() => {
    if (user?.email) {
      setEmail(user.email)
    }
  })

  const handleCheckout = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call our API route to create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: selectedPlan,
          email,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error("Stripe redirect error:", error)
          toast({
            title: "Checkout error",
            description: error.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Checkout error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-[#5EEAD4]/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center">
            <span className="text-[#5EEAD4] mr-2">TradeCraft</span> AI Pro
          </DialogTitle>
          <DialogDescription>
            Choose your payment plan to unlock your personalized AI trading assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/80 border-soft/20 text-white"
              disabled={!!user?.email}
            />
            <p className="text-xs text-muted-foreground">
              We'll send your receipt and subscription details to this email
            </p>
          </div>

          <RadioGroup
            value={selectedPlan}
            onValueChange={(value) => setSelectedPlan(value as PlanType)}
            className="grid grid-cols-1 gap-4"
          >
            <div
              className={`flex items-center justify-between space-x-2 rounded-lg border p-4 ${selectedPlan === "subscription" ? "border-[#5EEAD4]" : "border-white/10"}`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subscription" id="subscription" className="border-[#5EEAD4]" />
                <Label htmlFor="subscription" className="font-medium text-white">
                  Monthly Subscription
                </Label>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-xs text-muted-foreground">Cancel anytime</p>
              </div>
            </div>

            <div
              className={`relative flex items-center justify-between space-x-2 rounded-lg border p-4 ${selectedPlan === "lifetime" ? "border-[#5EEAD4]" : "border-white/10"}`}
            >
              <Badge className="absolute -top-2 right-4 bg-[#FACC15] text-black">Best Value</Badge>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lifetime" id="lifetime" className="border-[#5EEAD4]" />
                <Label htmlFor="lifetime" className="font-medium text-white">
                  Lifetime Access
                </Label>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">$29.99</p>
                <p className="text-xs text-muted-foreground">One-time payment</p>
              </div>
            </div>
          </RadioGroup>

          <div className="space-y-3">
            <h4 className="font-medium text-white">What's included:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-[#5EEAD4] mr-2" />
                <span>Personalized AI trading assistant</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-[#5EEAD4] mr-2" />
                <span>Advanced backtesting with unlimited historical data</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-[#5EEAD4] mr-2" />
                <span>AI-powered strategy optimization</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-[#5EEAD4] mr-2" />
                <span>Portfolio-specific insights and recommendations</span>
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-[#5EEAD4] mr-2" />
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCheckout}
            disabled={isLoading || !email}
            className="w-full bg-[#FACC15] hover:bg-[#FACC15]/90 text-black"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Secure Checkout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
