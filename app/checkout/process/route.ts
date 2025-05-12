import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { plan, paymentMethod, email, isProrated } = body

    // Validate required fields
    if (!plan) {
      return NextResponse.json({ error: "Subscription plan is required" }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate card details if paying by card
    if (paymentMethod === "card") {
      const { cardDetails } = body

      if (!cardDetails) {
        return NextResponse.json({ error: "Card details are required" }, { status: 400 })
      }

      const { number, name, expiry, cvv } = cardDetails

      if (!number || !name || !expiry || !cvv) {
        return NextResponse.json({ error: "All card details are required" }, { status: 400 })
      }

      // Basic validation
      if (!/^\d{16}$/.test(number)) {
        return NextResponse.json({ error: "Invalid card number" }, { status: 400 })
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        return NextResponse.json({ error: "Invalid CVV" }, { status: 400 })
      }
    }

    // Check if user already has a subscription
    const existingSubscriptions = await query(
      "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [user.id],
    )

    if (Array.isArray(existingSubscriptions) && existingSubscriptions.length > 0) {
      const subscription = existingSubscriptions[0] as { id: number; status: string }

      if (isProrated) {
        // For prorated upgrades, we immediately update the plan
        await query("UPDATE subscriptions SET plan = ?, status = 'active', updated_at = NOW() WHERE id = ?", [
          plan,
          subscription.id,
        ])

        // Record the payment in a payment history table (in a real app)
        // await query("INSERT INTO payment_history (user_id, subscription_id, amount, description) VALUES (?, ?, ?, ?)", [
        //   user.id, subscription.id, amount, `Prorated upgrade to ${plan}`
        // ])
      } else if (subscription.status === "active") {
        // For regular changes to active subscriptions, update the plan
        await query("UPDATE subscriptions SET plan = ?, status = 'active', updated_at = NOW() WHERE id = ?", [
          plan,
          subscription.id,
        ])
      } else {
        // For reactivating cancelled subscriptions
        await query("UPDATE subscriptions SET plan = ?, status = 'active', updated_at = NOW() WHERE id = ?", [
          plan,
          subscription.id,
        ])
      }
    } else {
      // Create new subscription
      await query("INSERT INTO subscriptions (user_id, plan, status) VALUES (?, ?, 'active')", [user.id, plan])
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      subscription: {
        plan,
        status: "active",
        startDate: new Date(),
      },
    })
  } catch (error: any) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: error.message || "Failed to process payment" }, { status: 500 })
  }
}
