import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyTokenSync } from "@/lib/auth"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/catalog"]

// Paths that should redirect to dashboard if already authenticated
const authPaths = ["/auth/login", "/auth/signup", "/"]

// Paths that have been removed and should redirect to home
const removedPaths = ["/branches", "/about"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect removed paths to home
  if (removedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value

  // Check if user is authenticated
  const user = token ? verifyTokenSync(token) : null
  const isAuthenticated = !!user

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if path should redirect when authenticated
  const isAuthPath = authPaths.some((path) => pathname === path)

  // Redirect to login if accessing protected path without authentication
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to catalog if accessing auth paths while authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/catalog", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/catalog/:path*",
    "/catalog",
    "/auth/login",
    "/auth/signup",
    "/branches/:path*",
    "/about/:path*",
    "/branches",
    "/about",
  ],
}
