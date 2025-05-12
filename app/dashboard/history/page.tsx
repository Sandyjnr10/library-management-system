import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, ArrowUpDown, Calendar } from "lucide-react"

// Mock borrow history data
const BORROW_HISTORY = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrowDate: "May 10, 2023",
    returnDate: null,
    dueDate: "May 24, 2023",
    status: "borrowed",
    coverUrl: "/placeholder.svg?key=bxval",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    borrowDate: "May 1, 2023",
    returnDate: "May 8, 2023",
    dueDate: "May 15, 2023",
    status: "returned",
    coverUrl: "/placeholder.svg?key=ath6t",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    borrowDate: "May 5, 2023",
    returnDate: null,
    dueDate: "May 19, 2023",
    status: "borrowed",
    coverUrl: "/book-cover-1984.png",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    borrowDate: "April 20, 2023",
    returnDate: "April 30, 2023",
    dueDate: "May 4, 2023",
    status: "returned",
    coverUrl: "/placeholder.svg?key=sdze7",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    borrowDate: "April 15, 2023",
    returnDate: "April 25, 2023",
    dueDate: "April 29, 2023",
    status: "returned",
    coverUrl: "/placeholder.svg?key=wfu3h",
  },
]

export default function BorrowHistoryPage() {
  const borrowedBooks = BORROW_HISTORY.filter((book) => book.status === "borrowed")
  const returnedBooks = BORROW_HISTORY.filter((book) => book.status === "returned")

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Borrowing History</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="borrowed">Currently Borrowed</TabsTrigger>
          <TabsTrigger value="returned">Returned</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <HistoryTable books={BORROW_HISTORY} />
        </TabsContent>

        <TabsContent value="borrowed" className="mt-6">
          {borrowedBooks.length > 0 ? (
            <HistoryTable books={borrowedBooks} />
          ) : (
            <EmptyState message="You don't have any books currently borrowed" />
          )}
        </TabsContent>

        <TabsContent value="returned" className="mt-6">
          {returnedBooks.length > 0 ? (
            <HistoryTable books={returnedBooks} />
          ) : (
            <EmptyState message="You haven't returned any books yet" />
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Borrowing Statistics</CardTitle>
          <CardDescription>Summary of your library activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Books Borrowed"
              value={BORROW_HISTORY.length}
              icon={<BookOpen className="h-5 w-5 text-blue-600" />}
            />
            <StatCard
              title="Currently Borrowed"
              value={borrowedBooks.length}
              icon={<ArrowUpDown className="h-5 w-5 text-blue-600" />}
            />
            <StatCard
              title="Books Returned"
              value={returnedBooks.length}
              icon={<Calendar className="h-5 w-5 text-blue-600" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HistoryTable({ books }: { books: typeof BORROW_HISTORY }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Book</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Borrow Date</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Due Date</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Return Date</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Status</th>
            <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden border">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-gray-500">{book.author}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{book.borrowDate}</td>
              <td className="py-3 px-4 text-sm">{book.dueDate}</td>
              <td className="py-3 px-4 text-sm">
                {book.returnDate || <span className="text-gray-400">Not returned</span>}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.status === "borrowed" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {book.status === "borrowed" ? "Borrowed" : "Returned"}
                </span>
              </td>
              <td className="py-3 px-4">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/catalog/${book.id}`}>View Book</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No history found</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-4">
      <div className="p-3 rounded-full bg-white shadow-sm">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}
