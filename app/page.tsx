import { createServerSupabaseClient } from "@/lib/supabase"
import { HomeContent } from "@/components/home-content"

export default async function Home() {
  let hasSession = false
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    hasSession = !!user
  } catch {}

  return <HomeContent hasSession={hasSession} />
}
