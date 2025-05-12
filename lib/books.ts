import { query } from "./db"

// Book types
export type Book = {
  id: number
  title: string
  author: string
  isbn?: string
  publisher?: string
  publicationYear?: number
  description?: string
  category?: string
  pages?: number
  coverUrl?: string
}

export type BookCopy = {
  id: number
  bookId: number
  branchId: number
  status: "available" | "borrowed" | "reserved" | "maintenance"
}

export type Borrowing = {
  id: number
  userId: number
  bookCopyId: number
  borrowDate: Date
  dueDate: Date
  returnDate: Date | null
  status: "borrowed" | "returned" | "overdue"
}

// Get all books with optional filtering
export async function getBooks(
  options: {
    search?: string
    category?: string
    available?: boolean
    limit?: number
    offset?: number
  } = {},
): Promise<Book[]> {
  try {
    let sql = "SELECT * FROM books WHERE 1=1"
    const params: any[] = []

    if (options.search) {
      sql += " AND (title LIKE ? OR author LIKE ?)"
      params.push(`%${options.search}%`, `%${options.search}%`)
    }

    if (options.category) {
      sql += " AND category = ?"
      params.push(options.category)
    }

    if (options.available) {
      sql += " AND id IN (SELECT book_id FROM book_copies WHERE status = ?)"
      params.push("available")
    }

    sql += " ORDER BY title ASC"

    if (options.limit) {
      sql += " LIMIT ?"
      params.push(options.limit)

      if (options.offset) {
        sql += " OFFSET ?"
        params.push(options.offset)
      }
    }

    const books = await query(sql, params)
    return books as Book[]
  } catch (error) {
    console.error("Get books error:", error)
    throw error
  }
}

// Get a book by ID
export async function getBookById(id: number): Promise<Book | null> {
  try {
    const books = await query("SELECT * FROM books WHERE id = ?", [id])

    if (!Array.isArray(books) || books.length === 0) {
      return null
    }

    return books[0] as Book
  } catch (error) {
    console.error("Get book error:", error)
    return null
  }
}

// Check if a book is available at a branch
export async function isBookAvailable(bookId: number, branchId: number): Promise<boolean> {
  try {
    const copies = await query("SELECT * FROM book_copies WHERE book_id = ? AND branch_id = ? AND status = ?", [
      bookId,
      branchId,
      "available",
    ])

    return Array.isArray(copies) && copies.length > 0
  } catch (error) {
    console.error("Check availability error:", error)
    return false
  }
}

// Borrow a book
export async function borrowBook(userId: number, bookId: number, branchId: number): Promise<Borrowing | null> {
  try {
    // Find an available copy
    const copies = await query("SELECT * FROM book_copies WHERE book_id = ? AND branch_id = ? AND status = ? LIMIT 1", [
      bookId,
      branchId,
      "available",
    ])

    if (!Array.isArray(copies) || copies.length === 0) {
      throw new Error("No available copies")
    }

    const copy = copies[0] as BookCopy

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Start a transaction
    await query("START TRANSACTION")

    // Update copy status
    await query("UPDATE book_copies SET status = ? WHERE id = ?", ["borrowed", copy.id])

    // Create borrowing record
    const result = await query("INSERT INTO borrowings (user_id, book_copy_id, due_date) VALUES (?, ?, ?)", [
      userId,
      copy.id,
      dueDate,
    ])

    // Commit transaction
    await query("COMMIT")

    const borrowingId = (result as any).insertId

    return {
      id: borrowingId,
      userId,
      bookCopyId: copy.id,
      borrowDate: new Date(),
      dueDate,
      returnDate: null,
      status: "borrowed",
    }
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Borrow book error:", error)
    return null
  }
}

// Return a book
export async function returnBook(borrowingId: number): Promise<boolean> {
  try {
    // Get borrowing details
    const borrowings = await query("SELECT * FROM borrowings WHERE id = ?", [borrowingId])

    if (!Array.isArray(borrowings) || borrowings.length === 0) {
      throw new Error("Borrowing record not found")
    }

    const borrowing = borrowings[0] as Borrowing

    // Start a transaction
    await query("START TRANSACTION")

    // Update borrowing record
    await query("UPDATE borrowings SET return_date = NOW(), status = ? WHERE id = ?", ["returned", borrowingId])

    // Update book copy status
    await query("UPDATE book_copies SET status = ? WHERE id = ?", ["available", borrowing.bookCopyId])

    // Commit transaction
    await query("COMMIT")

    return true
  } catch (error) {
    // Rollback transaction on error
    await query("ROLLBACK")
    console.error("Return book error:", error)
    return false
  }
}

// Get user's borrowing history
export async function getUserBorrowings(userId: number, status?: "borrowed" | "returned" | "overdue"): Promise<any[]> {
  try {
    let sql = `
      SELECT b.*, bc.book_id, bk.title, bk.author, bk.cover_url
      FROM borrowings b
      JOIN book_copies bc ON b.book_copy_id = bc.id
      JOIN books bk ON bc.book_id = bk.id
      WHERE b.user_id = ?
    `
    const params: any[] = [userId]

    if (status) {
      sql += " AND b.status = ?"
      params.push(status)
    }

    sql += " ORDER BY b.borrow_date DESC"

    const borrowings = await query(sql, params)
    return borrowings as any[]
  } catch (error) {
    console.error("Get user borrowings error:", error)
    throw error
  }
}
