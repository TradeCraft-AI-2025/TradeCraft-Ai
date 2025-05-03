import { toast } from "@/components/ui/use-toast"

/**
 * Initiates the checkout process for a specific plan
 * @param planType The type of plan ('subscription' or 'lifetime')
 * @param email The user's email address
 * @returns A promise that resolves when checkout is complete
 */
export async function initiateCheckout(planType: string, email: string): Promise<void> {
  try {
    // Call our API to create a Stripe checkout session
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planType,
        email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.details || "Error creating checkout session")
    }

    const { url } = await response.json()

    if (!url) {
      throw new Error("No checkout URL returned from the server")
    }

    // Redirect to Stripe Checkout
    window.location.href = url
  } catch (error: any) {
    console.error("Checkout error:", error)
    toast({
      title: "Checkout Error",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    })
    throw error
  }
}
