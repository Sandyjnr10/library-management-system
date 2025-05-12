"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, BookOpen, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AuthUser = {
  id: number
  name: string
  email: string
  role: string
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const pathname = usePathname()

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
          setIsLoggedIn(false)
          setUser(null)
          return
        }

        const data = await response.json()

        if (data.authenticated && data.user) {
          setIsLoggedIn(true)
          setUser(data.user)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkAuth()
  }, [pathname])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo (non-clickable) */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">AML</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isLoggedIn && (
              <NavLink href="/" active={isActive("/")}>
                Home
              </NavLink>
            )}
            {isLoggedIn && (
              <>
                <NavLink href="/catalog" active={isActive("/catalog")}>
                  Catalog
                </NavLink>
                <NavLink href="/dashboard" active={isActive("/dashboard")}>
                  Dashboard
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/subscription">Subscription</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {!isLoggedIn && (
              <NavLink href="/" active={isActive("/")}>
                Home
              </NavLink>
            )}
            {isLoggedIn && (
              <>
                <NavLink href="/catalog" active={isActive("/catalog")}>
                  Catalog
                </NavLink>
                <NavLink href="/dashboard" active={isActive("/dashboard")}>
                  Dashboard
                </NavLink>
                <NavLink href="/dashboard/subscription" active={isActive("/dashboard/subscription")}>
                  Subscription
                </NavLink>
                <div className="pt-4 border-t border-gray-200">
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-blue-600 ${active ? "text-blue-600" : "text-gray-700"}`}
    >
      {children}
    </Link>
  )
}
