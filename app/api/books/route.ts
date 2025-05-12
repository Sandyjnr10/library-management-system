import { NextResponse } from "next/server"
import { getBooks } from "@/lib/books"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const search = searchParams.get("search") || undefined
    const category = searchParams.get("category") || undefined
    const available = searchParams.get("available") === "true"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    // Get books with filters
    const books = await getBooks({
      search,
      category,
      available,
      limit,
      offset,
    })

    return NextResponse.json({ books })
  } catch (error: any) {
    console.error("Get books error:", error)

    return NextResponse.json({ error: error.message || "Failed to fetch books" }, { status: 500 })
  }
}
