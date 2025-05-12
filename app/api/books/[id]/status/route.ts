import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const bookId = Number.parseInt(params.id)

    if (isNaN(bookId)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })
    }

    // Check if the user has borrowed this book
    const borrowings = await query(
      `
      SELECT b.* 
      FROM borrowings b
      JOIN book_copies bc ON b.book_copy_id = bc.id
      WHERE b.user_id = ? AND bc.book_id = ? AND b.status = 'borrowed'
    `,
      [user.id, bookId],
    )

    const status = Array.isArray(borrowings) && borrowings.length > 0 ? "borrowed" : "available"

    return NextResponse.json({ status })
  } catch (error: any) {
    console.error("Book status check error:", error)
    return NextResponse.json({ error: error.message || "Failed to check book status" }, { status: 500 })
  }
}
