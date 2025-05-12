"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, BookOpen, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

type BorrowedBook = {
  id: number
  title: string
  author: string
  borrowDate: string
  dueDate: string
  coverUrl: string
  isOverdue: boolean
  borrowingId: number
}

export default function BorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [returningBooks, setReturningBooks] = useState<number[]>([])

  // Fetch borrowed books
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await fetch("/api/user/borrowings?status=borrowed")

        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books")
        }

        const data = await response.json()
        console.log("Borrowed books data:", data)

        // Transform API data to our component format
        const books: BorrowedBook[] = data.borrowings.map((item: any) => {
          const borrowDate = new Date(item.borrow_date)
          const dueDate = new Date(item.due_date)
          const now = new Date()

          return {
            id: item.book_id,
            title: item.title || `Book ${item.book_id}`,
            author: item.author || "Unknown Author",
            borrowDate: borrowDate.toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            coverUrl: item.cover_url || `/placeholder.svg?height=300&width=200&query=book cover ${item.book_id}`,
            isOverdue: now > dueDate,
            borrowingId: item.id,
          }
        })

        setBorrowedBooks(books)
      } catch (error) {
        console.error("Error fetching borrowed books:", error)
        toast({
          title: "Error",
          description: "Failed to load your borrowed books",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowedBooks()
  }, [])

  const handleReturnBook = async (book: BorrowedBook) => {
    setReturningBooks((prev) => [...prev, book.id])

    try {
      const response = await fetch("/api/books/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrowingId: book.borrowingId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to return book")
      }

      setBorrowedBooks((prev) => prev.filter((b) => b.id !== book.id))

      toast({
        title: "Book returned",
        description: `"${book.title}" has been successfully returned`,
      })
    } catch (error: any) {
      console.error("Return book error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setReturningBooks((prev) => prev.filter((id) => id !== book.id))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">My Borrowed Books</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading your borrowed books...</span>
        </div>
      ) : borrowedBooks.length > 0 ? (
        <div className="space-y-6">
          {borrowedBooks.map((book) => (
            <Card key={book.id} className={book.isOverdue ? "border-red-200" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 flex-shrink-0">
                    <div className="aspect-[2/3] rounded-md overflow-hidden border">
                      <img
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
                        <p className="text-gray-600 mb-4">by {book.author}</p>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Borrowed on: {book.borrowDate}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className={`h-4 w-4 mr-2 ${book.isOverdue ? "text-red-500" : "text-gray-500"}`} />
                            <span className={book.isOverdue ? "text-red-600 font-medium" : ""}>
                              Due on: {book.dueDate}
                              {book.isOverdue && " (Overdue)"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleReturnBook(book)}
                          disabled={returningBooks.includes(book.id)}
                          className="whitespace-nowrap"
                        >
                          {returningBooks.includes(book.id) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Returning...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Return Book
                            </>
                          )}
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/catalog/${book.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>

                    {book.isOverdue && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-medium">This book is overdue</p>
                          <p className="text-red-600 text-sm">
                            Please return it as soon as possible to avoid additional fees.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books currently borrowed</h3>
          <p className="text-gray-500 mb-6">You don't have any books checked out at the moment</p>
          <Button asChild>
            <Link href="/catalog">Browse Catalog</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
