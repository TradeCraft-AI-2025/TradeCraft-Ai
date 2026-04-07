"use client"

import { useState } from "react"
import { Hexagon, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    })
    if (error) {
      setError(error.message)
      setStatus("error")
    } else {
      setStatus("sent")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="flex flex-col items-center gap-2">
          <Hexagon className="h-10 w-10 text-[#5EEAD4]" />
          <span className="text-xl font-bold tracking-tight text-white">TradeCraft</span>
        </div>

        {status === "sent" ? (
          <div className="rounded-lg border border-white/10 bg-black/40 p-6 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-[#5EEAD4]" />
            <p className="text-sm text-white">Check your email — we sent you a sign-in link</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-white/10 bg-black/40 p-6">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/50 border-white/10"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#5EEAD4] hover:bg-[#5EEAD4]/80 text-black"
            >
              {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send magic link"}
            </Button>
            {status === "error" && <p className="text-sm text-red-400">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
