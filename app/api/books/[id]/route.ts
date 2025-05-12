import { NextResponse } from "next/server"
import { getBookById } from "@/lib/books"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 })
    }

    const book = await getBookById(id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ book })
  } catch (error: any) {
    console.error("Get book error:", error)

    return NextResponse.json({ error: error.message || "Failed to fetch book" }, { status: 500 })
  }
}
