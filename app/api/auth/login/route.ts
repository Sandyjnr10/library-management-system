import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, rememberMe } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login the user
    const { token, refreshToken, user } = await loginUser(email, password)

    // Set cookies
    const cookieStore = cookies()

    // Access token (short-lived)
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      sameSite: "strict",
    })

    // Refresh token (longer-lived)
    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
    })

    // Return full response including tokens
    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      user,
      redirectTo: "/catalog",
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 })
  }
}