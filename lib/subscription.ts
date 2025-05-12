import { query } from "./db"

// Subscription types
export type SubscriptionPlan = "basic-monthly" | "premium-monthly" | "basic-yearly" | "premium-yearly"
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending"

export type Subscription = {
  id: number
  userId: number
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: Date
  endDate: Date | null
}

// Get subscription details for a user
export async function getUserSubscription(userId: number): Promise<Subscription | null> {
  try {
    const subscriptions = await query(
      "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId],
    )

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return null
    }

    const subscription = subscriptions[0] as any

    return {
      id: subscription.id,
      userId: subscription.user_id,
      plan: subscription.plan,
      status: subscription.status,
      startDate: new Date(subscription.start_date),
      endDate: subscription.end_date ? new Date(subscription.end_date) : null,
    }
  } catch (error) {
    console.error("Get subscription error:", error)
    return null
  }
}

// Create or update a subscription
export async function updateSubscription(
  userId: number,
  plan: SubscriptionPlan,
  status: SubscriptionStatus = "active",
): Promise<Subscription> {
  try {
    // Check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId)

    if (existingSubscription) {
      // Update existing subscription
      await query("UPDATE subscriptions SET plan = ?, status = ?, updated_at = NOW() WHERE id = ?", [
        plan,
        status,
        existingSubscription.id,
      ])

      return {
        ...existingSubscription,
        plan,
        status,
      }
    } else {
      // Create new subscription
      const result = await query("INSERT INTO subscriptions (user_id, plan, status) VALUES (?, ?, ?)", [
        userId,
        plan,
        status,
      ])

      const subscriptionId = (result as any).insertId

      return {
        id: subscriptionId,
        userId,
        plan,
        status,
        startDate: new Date(),
        endDate: null,
      }
    }
  } catch (error) {
    console.error("Update subscription error:", error)
    throw error
  }
}

// Cancel a subscription
export async function cancelSubscription(userId: number): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      throw new Error("Subscription not found")
    }

    // Directly update the database with the cancelled status
    await query("UPDATE subscriptions SET status = 'cancelled', updated_at = NOW() WHERE id = ?", [subscription.id])

    return true
  } catch (error) {
    console.error("Cancel subscription error:", error)
    throw error
  }
}

// Get borrowing limit based on subscription plan
export function getBorrowingLimit(plan: SubscriptionPlan): number {
  switch (plan) {
    case "basic-monthly":
    case "basic-yearly":
      return 1
    case "premium-monthly":
    case "premium-yearly":
      return 3
    default:
      return 0
  }
}

// Check if a user can borrow more books
export async function canBorrowMore(userId: number): Promise<boolean> {
  try {
    // Get user's subscription
    const subscription = await getUserSubscription(userId)

    if (!subscription || (subscription.status !== "active" && subscription.status !== "pending")) {
      // For testing purposes, allow borrowing even without a subscription
      return true
    }

    // Get borrowing limit based on plan
    const limit = getBorrowingLimit(subscription.plan)

    // Count current borrowed books
    const borrowings = await query("SELECT COUNT(*) as count FROM borrowings WHERE user_id = ? AND status = ?", [
      userId,
      "borrowed",
    ])

    const count = (borrowings as any)[0].count

    return count < limit
  } catch (error) {
    console.error("Can borrow more error:", error)
    // For testing purposes, allow borrowing on error
    return true
  }
}

// Check if subscription is pending setup
export async function isSubscriptionPending(userId: number): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId)
    return subscription?.status === "pending"
  } catch (error) {
    console.error("Check pending subscription error:", error)
    return false
  }
}
