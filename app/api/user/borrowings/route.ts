import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as "borrowed" | "returned" | "overdue" | undefined

    // Build the query based on status
    let sql = `
      SELECT b.*, bc.book_id, bk.title, bk.author, bk.cover_url
      FROM borrowings b
      JOIN book_copies bc ON b.book_copy_id = bc.id
      JOIN books bk ON bc.book_id = bk.id
      WHERE b.user_id = ?
    `
    const params: any[] = [user.id]

    if (status) {
      sql += " AND b.status = ?"
      params.push(status)
    }

    sql += " ORDER BY b.borrow_date DESC"

    // Get user's borrowings
    const borrowings = await query(sql, params)
    console.log("Borrowings query result:", borrowings)

    return NextResponse.json({ borrowings })
  } catch (error: any) {
    console.error("Get borrowings error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch borrowings" }, { status: 500 })
  }
}
