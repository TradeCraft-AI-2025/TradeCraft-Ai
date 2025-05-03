"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the tour steps
const tourSteps = [
  {
    title: "Welcome to TradeCraft AI",
    content: "Let's take a quick tour of the key features available in your dashboard.",
    image: "/placeholder.svg?key=l9l05",
  },
  {
    title: "Add Tickers to Your Watchlist",
    content: "Click the 'Add Ticker' button to track new stocks in your personalized watchlist.",
    image: "/placeholder.svg?key=sk8bb",
  },
  {
    title: "Backtest Your Strategies",
    content: "Use our AI-powered backtesting tool to test your trading strategies against historical data.",
    image: "/placeholder.svg?key=59v00",
  },
  {
    title: "Upgrade to Pro",
    content: "Get access to advanced features like AI recommendations, unlimited backtesting, and more.",
    image: "/placeholder.svg?key=j2n0r",
  },
]

export function OnboardingTour() {
  const [showTour, setShowTour] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Check if tour has been completed before
  useEffect(() => {
    try {
      setIsMounted(true)
      const tourCompleted = localStorage.getItem("tradecraft-tour-completed")
      if (!tourCompleted) {
        // Delay tour start to ensure DOM elements are loaded
        const timer = setTimeout(() => {
          setShowTour(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    } catch (error) {
      console.error("Error initializing tour:", error)
    }
  }, [])

  // Complete the tour
  const completeTour = () => {
    try {
      setShowTour(false)
      localStorage.setItem("tradecraft-tour-completed", "true")
    } catch (error) {
      console.error("Error completing tour:", error)
    }
  }

  // Go to next step
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Restart the tour
  const startTour = () => {
    setCurrentStep(0)
    setShowTour(true)
  }

  // Don't render anything on server-side
  if (!isMounted) return null

  // If tour is not active, just render the start button
  if (!showTour) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-black/50 backdrop-blur-sm border-white/10 text-white hover:bg-black/70"
        onClick={startTour}
      >
        Take Tour
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-black/90 border border-white/10 rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={completeTour}
          aria-label="Close tour"
        >
          <X size={20} />
        </button>

        {/* Step content */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-[#5EEAD4] mb-2">{tourSteps[currentStep].title}</h3>

          {/* Feature image */}
          <div className="my-4 rounded-md overflow-hidden">
            <img
              src={tourSteps[currentStep].image || "/placeholder.svg"}
              alt={tourSteps[currentStep].title}
              className="w-full h-auto rounded-md"
            />
          </div>

          <p className="text-gray-300">{tourSteps[currentStep].content}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${index === currentStep ? "bg-[#5EEAD4]" : "bg-gray-600"}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`border-white/20 ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"}`}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextStep}
            className="bg-[#5EEAD4]/20 border-[#5EEAD4]/50 text-[#5EEAD4] hover:bg-[#5EEAD4]/30"
          >
            {currentStep < tourSteps.length - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
