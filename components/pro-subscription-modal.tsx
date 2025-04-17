"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Check, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

interface ProSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PlanType = "subscription" | "lifetime"

export function ProSubscriptionModal({ open, onOpenChange }: ProSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("subscription")
  const router = useRouter()
  const { user } = useAuth()

  const handleContinue = () => {
    // Close the modal
    onOpenChange(false)

    // Redirect to checkout page with selected plan
    router.push(`/checkout?plan=${selectedPlan}${user?.email ? `&email=${encodeURIComponent(user.email)}` : ""}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-[#5EEAD4]/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center">
            <span className="text-[#5EEAD4] mr-2">TradeCraft</span> AI Pro
          </DialogTitle>
          <DialogDescription>Choose your plan to unlock your personalized AI trading assistant</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleContinue} className="w-full bg-[#FACC15] hover:bg-[#FACC15]/90 text-black">
            Continue to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
