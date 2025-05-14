import { NextResponse } from "next/server"
import { getUserSubscription, updateSubscription } from "@/lib/subscription"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

function extractTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");
  const cookieToken = cookieHeader.match(/auth_token=([^;]+)/);
  return headerToken || (cookieToken ? decodeURIComponent(cookieToken[1]) : null);
}

export async function GET(request: Request) {
  try {
    // Verify authentication
    const token = extractTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Get user's subscription
    const subscription = await getUserSubscription(user.id)

    return NextResponse.json({ subscription })
  } catch (error: any) {
    console.error("Get subscription error:", error)

    return NextResponse.json({ error: error.message || "Failed to fetch subscription" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Verify authentication
    const token = extractTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { plan } = body

    if (!plan) {
      return NextResponse.json({ error: "Subscription plan is required" }, { status: 400 })
    }

    // Update subscription
    const subscription = await updateSubscription(user.id, plan, "active")

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      subscription,
    })
  } catch (error: any) {
    console.error("Update subscription error:", error)

    return NextResponse.json({ error: error.message || "Failed to update subscription" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify authentication
    const token = extractTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Get the current subscription to maintain the same plan
    const currentSubscription = await getUserSubscription(user.id)
    if (!currentSubscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Update the subscription status to cancelled in the database
    await query("UPDATE subscriptions SET status = 'cancelled', updated_at = NOW() WHERE id = ?", [
      currentSubscription.id,
    ])

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
    })
  } catch (error: any) {
    console.error("Cancel subscription error:", error)

    return NextResponse.json({ error: error.message || "Failed to cancel subscription" }, { status: 500 })
  }
}
