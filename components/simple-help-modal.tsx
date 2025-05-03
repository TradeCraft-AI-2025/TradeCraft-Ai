"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleHelpModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-black/50 backdrop-blur-sm border-white/10 text-white hover:bg-black/70"
        onClick={openModal}
      >
        Help
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-black/90 border border-white/10 rounded-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeModal}
              aria-label="Close help"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-[#5EEAD4] mb-4">Welcome to TradeCraft AI</h3>

            <div className="space-y-4 text-gray-300">
              <p>This dashboard gives you access to real-time market data, your portfolio, and trading tools.</p>
              <p>
                <strong className="text-[#5EEAD4]">Key features:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Track your favorite stocks in the watchlist</li>
                <li>View detailed charts with technical indicators</li>
                <li>Monitor your portfolio performance</li>
                <li>Stay updated with the latest market news</li>
              </ul>
            </div>

            <Button
              className="w-full mt-6 bg-gradient-to-r from-[#5EEAD4] to-[#FACC15] text-black"
              onClick={closeModal}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
