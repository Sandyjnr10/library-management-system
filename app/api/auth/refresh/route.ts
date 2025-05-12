import { NextResponse } from "next/server"
import { refreshAccessToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Get refresh token from cookie
    const cookieStore = cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 401 })
    }

    // Refresh the access token
    const { token, user } = await refreshAccessToken(refreshToken)

    // Set the new access token cookie
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60, // 15 minutes
      sameSite: "strict",
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error: any) {
    console.error("Token refresh error:", error)

    // Clear cookies on refresh error
    const cookieStore = cookies()
    cookieStore.delete("auth_token")
    cookieStore.delete("refresh_token")

    return NextResponse.json({ error: error.message || "Failed to refresh token" }, { status: 401 })
  }
}
