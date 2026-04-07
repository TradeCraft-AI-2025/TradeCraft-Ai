import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { checkAIAccess } from "@/lib/ai-gate"

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const access = await checkAIAccess(user.id, "explain-position")

  if (!access.allowed) {
    return NextResponse.json(
      { error: "Monthly limit reached", upgradeUrl: "/pricing" },
      { status: 402 }
    )
  }

  const body = await request.json()

  // TODO: replace with actual AI call
  return NextResponse.json({
    explanation: `Analysis for ${body.symbol ?? "position"}: This is a placeholder response. Connect your AI provider to generate real explanations.`,
    remaining: access.remaining,
    isPro: access.isPro,
  })
}
