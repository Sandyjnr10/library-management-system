"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, CreditCard, BarChart4, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type BorrowedBook = {
  id: number
  title: string
  author: string
  borrowDate: string
  dueDate: string
  bookId: number
}

type UserSubscription = {
  type: string
  status: string
  nextBillingDate: string
  booksAllowed: number
  booksBorrowed: number
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const [subscription, setSubscription] = useState<UserSubscription>({
    type: "Loading...",
    status: "Loading...",
    nextBillingDate: "Loading...",
    booksAllowed: 0,
    booksBorrowed: 0,
  })
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch user info
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.user && userData.user.name) {
            setUserName(userData.user.name)
          }
        }

        // Fetch borrowed books
        const borrowingsResponse = await fetch("/api/user/borrowings?status=borrowed")
        if (!borrowingsResponse.ok) {
          throw new Error("Failed to fetch borrowings")
        }

        const borrowingsData = await borrowingsResponse.json()

        // Transform API data to our component format
        const books: BorrowedBook[] = borrowingsData.borrowings.map((item: any) => {
          const borrowDate = new Date(item.borrow_date)
          const dueDate = new Date(item.due_date)

          return {
            id: item.id,
            title: item.title || `Book ${item.book_id}`,
            author: item.author || "Unknown Author",
            borrowDate: borrowDate.toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            bookId: item.book_id,
          }
        })

        setBorrowedBooks(books)

        // Fetch subscription data with cache-busting
        const subscriptionResponse = await fetch(`/api/user/subscription?t=${new Date().getTime()}`)
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json()

          if (subscriptionData.subscription) {
            const subscriptionPlan = subscriptionData.subscription.plan
            const subscriptionStatus = subscriptionData.subscription.status

            // Parse the plan type to display it properly
            let planType = "Unknown"
            if (subscriptionPlan.includes("basic-monthly")) planType = "Basic Monthly"
            else if (subscriptionPlan.includes("premium-monthly")) planType = "Premium Monthly"
            else if (subscriptionPlan.includes("basic-yearly")) planType = "Basic Yearly"
            else if (subscriptionPlan.includes("premium-yearly")) planType = "Premium Yearly"

            setSubscription({
              type: planType,
              status: subscriptionStatus,
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              booksAllowed: subscriptionPlan.includes("premium") ? 3 : 1,
              booksBorrowed: books.length,
            })
          } else {
            // Default values if no subscription is found
            setSubscription({
              type: "None",
              status: "inactive",
              nextBillingDate: "N/A",
              booksAllowed: 0,
              booksBorrowed: books.length,
            })
          }
        } else {
          throw new Error("Failed to fetch subscription data")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Check if subscription is pending and needs to be set up
  const isPendingSubscription = subscription.status === "pending"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading your dashboard...</span>
        </div>
      ) : (
        <>
          {/* Subscription Setup Alert */}
          {isPendingSubscription && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Complete your registration</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please select a subscription plan to start borrowing books from our library.</p>
                  </div>
                  <div className="mt-4">
                    <Button asChild size="sm">
                      <Link href="/dashboard/subscription">Choose a Plan</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Subscription Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Subscription
                </CardTitle>
                <CardDescription>Your current plan details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Plan:</span>
                    <span className="font-medium">{subscription.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span
                      className={`font-medium ${
                        subscription.status === "active"
                          ? "text-green-600"
                          : subscription.status === "pending"
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                    >
                      {subscription.status === "active"
                        ? "Active"
                        : subscription.status === "pending"
                          ? "Pending Setup"
                          : "Cancelled"}
                    </span>
                  </div>
                  {subscription.status === "active" && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Next billing:</span>
                      <span className="font-medium">{subscription.nextBillingDate}</span>
                    </div>
                  )}
                  {subscription.status === "pending" && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
                      Please select a subscription plan to continue.
                    </div>
                  )}
                  {subscription.status === "cancelled" && (
                    <div className="mt-2 p-2 bg-amber-50 rounded-md text-sm text-amber-800">
                      Your subscription has been cancelled. You can no longer borrow books.
                    </div>
                  )}
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/subscription">
                        {subscription.status === "pending" ? "Choose a Plan" : "Manage Subscription"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrowing Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Borrowing Status
                </CardTitle>
                <CardDescription>Your current borrowing limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Books borrowed:</span>
                    <span className="font-medium">
                      {subscription.booksBorrowed} of {subscription.booksAllowed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width:
                          subscription.booksAllowed > 0
                            ? `${(subscription.booksBorrowed / subscription.booksAllowed) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                  {subscription.status !== "active" && (
                    <div className="mt-2 p-2 bg-amber-50 rounded-md text-sm text-amber-800">
                      {subscription.status === "pending"
                        ? "You need to select a subscription plan to borrow books."
                        : "You need an active subscription to borrow books."}
                    </div>
                  )}
                  <div className="mt-4">
                    <Button asChild size="sm" className="w-full" disabled={subscription.status !== "active"}>
                      <Link href="/catalog">Browse Catalog</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/borrowed">My Books</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/history">History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent library interactions</CardDescription>
            </CardHeader>
            <CardContent>
              {borrowedBooks.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-gray-500">Borrowed on {book.borrowDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due Date</p>
                        <p className="text-sm text-gray-500">{book.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">You haven't borrowed any books yet.</p>
                  <Button asChild variant="link" size="sm" className="mt-2">
                    <Link href="/catalog">Browse the catalog</Link>
                  </Button>
                </div>
              )}
              <div className="mt-4 text-center">
                <Button asChild variant="link" size="sm">
                  <Link href="/dashboard/history">View All Activity</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Books */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Recommended For You</CardTitle>
              <CardDescription>Based on your reading history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 16,
                    title: "Sapiens: A Brief History of Humankind",
                    author: "Yuval Noah Harari",
                    coverUrl:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sapiens.jpg-ItXFyAl9oyz2umtP9Webab9hvk2yI4.jpeg",
                  },
                  {
                    id: 17,
                    title: "The Silent Patient",
                    author: "Alex Michaelides",
                    coverUrl:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/patient.jpg-8rdci0vLXPYo3BC1plHvUNH2AQdN9m.jpeg",
                  },
                  {
                    id: 19,
                    title: "Where the Crawdads Sing",
                    author: "Delia Owens",
                    coverUrl:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crawdads.jpg-HY13jW0YwxCS8fnTa1SoxM5YVwVQs4.jpeg",
                  },
                  {
                    id: 20,
                    title: "Atomic Habits",
                    author: "James Clear",
                    coverUrl:
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atomic.jpg-h6sGpx1p3GBkYqghcq8Qbh883o6N1i.jpeg",
                  },
                ].map((book) => (
                  <Link href={`/catalog/${book.id}`} key={book.id} className="group">
                    <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-md">
                      <div className="aspect-[2/3] bg-gray-100 relative">
                        <img
                          src={book.coverUrl || "/placeholder.svg"}
                          alt={book.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-500">{book.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
