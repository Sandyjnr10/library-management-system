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
    const { borrowingId } = await request.json()

    if (!borrowingId) {
      return NextResponse.json({ error: "Borrowing ID is required" }, { status: 400 })
    }

    // Get borrowing details and verify it belongs to the user
    const borrowings = await query(
      `
      SELECT b.*, bc.book_id 
      FROM borrowings b
      JOIN book_copies bc ON b.book_copy_id = bc.id
      WHERE b.id = ? AND b.user_id = ? AND b.status = 'borrowed'
    `,
      [borrowingId, user.id],
    )

    if (!Array.isArray(borrowings) || borrowings.length === 0) {
      return NextResponse.json({ error: "Borrowing record not found or already returned" }, { status: 404 })
    }

    const borrowing = borrowings[0] as any

    // Update borrowing record without transaction
    await query(
      `
      UPDATE borrowings 
      SET return_date = NOW(), status = 'returned' 
      WHERE id = ?
    `,
      [borrowingId],
    )

    // Update book copy status
    await query(
      `
      UPDATE book_copies 
      SET status = 'available' 
      WHERE id = ?
    `,
      [borrowing.book_copy_id],
    )

    return NextResponse.json({
      success: true,
      message: "Book returned successfully",
      bookId: borrowing.book_id,
    })
  } catch (error: any) {
    console.error("Return book error:", error)
    return NextResponse.json({ error: error.message || "Failed to return book" }, { status: 500 })
  }
}
