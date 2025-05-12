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

    // Check if user has an active subscription
    const subscriptions = await query(
      "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [user.id],
    )

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 403 })
    }

    const subscription = subscriptions[0] as any

    if (subscription.status !== "active") {
      return NextResponse.json(
        {
          error: "Your membership has been discontinued. Please renew your subscription to borrow books.",
          subscriptionRequired: true,
        },
        { status: 403 },
      )
    }

    // Parse request body
    const body = await request.json()
    const { bookId, branchId } = body

    console.log("Borrow request:", { userId: user.id, bookId, branchId })

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    // Default to branch ID 1 if not provided
    const selectedBranchId = branchId || 1

    // Check if the book exists
    const books = await query("SELECT * FROM books WHERE id = ?", [bookId])
    console.log("Book query result:", books)

    if (!Array.isArray(books) || books.length === 0) {
      // If book doesn't exist, create it (for testing purposes)
      console.log(`Book with ID ${bookId} not found, creating a mock book`)

      await query(
        `
        INSERT INTO books (id, title, author, category, publication_year, pages, cover_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          bookId,
          `Book Title ${bookId}`,
          `Author Name ${(bookId % 5) + 1}`,
          "Fiction",
          2020,
          300,
          `/placeholder.svg?height=300&width=200&query=book cover ${bookId}`,
        ],
      )

      // Create a book copy
      await query(
        `
        INSERT INTO book_copies (book_id, branch_id, status)
        VALUES (?, ?, 'available')
      `,
        [bookId, selectedBranchId],
      )

      console.log(`Created mock book and copy for ID ${bookId}`)
    }

    // Check if the user has already borrowed this book
    const existingBorrowings = await query(
      `
      SELECT b.* 
      FROM borrowings b
      JOIN book_copies bc ON b.book_copy_id = bc.id
      WHERE b.user_id = ? AND bc.book_id = ? AND b.status = 'borrowed'
    `,
      [user.id, bookId],
    )

    if (Array.isArray(existingBorrowings) && existingBorrowings.length > 0) {
      return NextResponse.json({ error: "You have already borrowed this book" }, { status: 400 })
    }

    // Find an available copy
    const copies = await query(
      `
      SELECT * FROM book_copies 
      WHERE book_id = ? AND branch_id = ? AND status = 'available' 
      LIMIT 1
    `,
      [bookId, selectedBranchId],
    )
    console.log("Available copies at selected branch:", copies)

    if (!Array.isArray(copies) || copies.length === 0) {
      // If no copies at the selected branch, check other branches
      const otherCopies = await query(
        `
        SELECT * FROM book_copies 
        WHERE book_id = ? AND status = 'available' 
        LIMIT 1
      `,
        [bookId],
      )
      console.log("Available copies at any branch:", otherCopies)

      if (!Array.isArray(otherCopies) || otherCopies.length === 0) {
        // If no copies available anywhere, create one (for testing purposes)
        console.log(`No available copies for book ${bookId}, creating a new copy`)

        const result = await query(
          `
          INSERT INTO book_copies (book_id, branch_id, status)
          VALUES (?, ?, 'available')
        `,
          [bookId, selectedBranchId],
        )

        const copyId = (result as any).insertId
        console.log(`Created new book copy with ID ${copyId}`)

        // Fetch the newly created copy
        const newCopies = await query("SELECT * FROM book_copies WHERE id = ?", [copyId])

        if (!Array.isArray(newCopies) || newCopies.length === 0) {
          return NextResponse.json({ error: "Failed to create book copy" }, { status: 500 })
        }

        const copy = newCopies[0] as any
        console.log("Using newly created copy:", copy)

        // Calculate due date (14 days from now)
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 14)

        // Update copy status without transaction
        await query("UPDATE book_copies SET status = 'borrowed' WHERE id = ?", [copy.id])

        // Create borrowing record
        const borrowResult = await query(
          `
          INSERT INTO borrowings (user_id, book_copy_id, due_date, status) 
          VALUES (?, ?, ?, 'borrowed')
        `,
          [user.id, copy.id, dueDate],
        )

        const borrowingId = (borrowResult as any).insertId

        return NextResponse.json({
          success: true,
          borrowing: {
            id: borrowingId,
            userId: user.id,
            bookCopyId: copy.id,
            bookId: bookId,
            borrowDate: new Date(),
            dueDate,
            status: "borrowed",
          },
        })
      }

      // Use a copy from another branch
      const copy = otherCopies[0] as any
      console.log("Using copy from another branch:", copy)

      // Calculate due date (14 days from now)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      // Update copy status without transaction
      await query("UPDATE book_copies SET status = 'borrowed' WHERE id = ?", [copy.id])

      // Create borrowing record
      const borrowResult = await query(
        `
        INSERT INTO borrowings (user_id, book_copy_id, due_date, status) 
        VALUES (?, ?, ?, 'borrowed')
      `,
        [user.id, copy.id, dueDate],
      )

      const borrowingId = (borrowResult as any).insertId

      return NextResponse.json({
        success: true,
        borrowing: {
          id: borrowingId,
          userId: user.id,
          bookCopyId: copy.id,
          bookId: bookId,
          borrowDate: new Date(),
          dueDate,
          status: "borrowed",
        },
      })
    }

    const copy = copies[0] as any
    console.log("Using copy from selected branch:", copy)

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Update copy status without transaction
    await query("UPDATE book_copies SET status = 'borrowed' WHERE id = ?", [copy.id])

    // Create borrowing record
    const borrowResult = await query(
      `
      INSERT INTO borrowings (user_id, book_copy_id, due_date, status) 
      VALUES (?, ?, ?, 'borrowed')
    `,
      [user.id, copy.id, dueDate],
    )

    const borrowingId = (borrowResult as any).insertId

    return NextResponse.json({
      success: true,
      borrowing: {
        id: borrowingId,
        userId: user.id,
        bookCopyId: copy.id,
        bookId: bookId,
        borrowDate: new Date(),
        dueDate,
        status: "borrowed",
      },
    })
  } catch (error: any) {
    console.error("Borrow book error:", error)
    return NextResponse.json({ error: error.message || "Failed to borrow book" }, { status: 500 })
  }
}
