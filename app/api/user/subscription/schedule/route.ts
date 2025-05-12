import { NextResponse } from "next/server"
import { getUserSubscription } from "@/lib/subscription"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
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
    const { plan, effectiveDate } = body

    if (!plan) {
      return NextResponse.json({ error: "Subscription plan is required" }, { status: 400 })
    }

    if (!effectiveDate) {
      return NextResponse.json({ error: "Effective date is required" }, { status: 400 })
    }

    // Get current subscription
    const subscription = await getUserSubscription(user.id)

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // In a real application, you would store the scheduled change in a separate table
    // For this example, we'll update a field in the subscriptions table
    await query("UPDATE subscriptions SET scheduled_plan = ?, scheduled_date = ? WHERE id = ?", [
      plan,
      effectiveDate === "end-of-term" ? "end-of-term" : effectiveDate,
      subscription.id,
    ])

    return NextResponse.json({
      success: true,
      message: "Subscription change scheduled successfully",
      scheduledChange: {
        plan,
        effectiveDate,
      },
    })
  } catch (error: any) {
    console.error("Schedule subscription change error:", error)

    return NextResponse.json({ error: error.message || "Failed to schedule subscription change" }, { status: 500 })
  }
}
