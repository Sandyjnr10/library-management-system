"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react"

// Plan details
const PLANS = {
  "basic-monthly": {
    title: "Basic Monthly",
    price: 9.99,
    period: "month",
    description: "Borrow 1 book at a time",
  },
  "premium-monthly": {
    title: "Premium Monthly",
    price: 15.99,
    period: "month",
    description: "Borrow 3 books at a time",
  },
  "basic-yearly": {
    title: "Basic Yearly",
    price: 105,
    period: "year",
    description: "Borrow 1 book at a time",
  },
  "premium-yearly": {
    title: "Premium Yearly",
    price: 130,
    period: "year",
    description: "Borrow 3 books at a time",
  },
}

type PlanType = keyof typeof PLANS

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = (searchParams.get("plan") as PlanType) || "premium-monthly"
  const returnUrl = searchParams.get("returnUrl") || "/catalog"

  const [countdown, setCountdown] = useState(5)
  const plan = PLANS[planId]

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push(returnUrl)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router, returnUrl])

  // Format the current date and next billing date
  const currentDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const nextBillingDate = new Date()
  if (planId.includes("monthly")) {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
  } else {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
  }

  const formattedNextBillingDate = nextBillingDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Generate a random order number
  const orderNumber = `AML-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 text-lg">Your subscription has been activated successfully.</p>
      </div>

      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Order #{orderNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-medium">{plan.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">
                  £{plan.price.toFixed(2)} per {plan.period}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{currentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Billing Date</p>
                <p className="font-medium">{formattedNextBillingDate}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <BookOpen className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>You can now borrow books according to your subscription plan.</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <span>Visit the catalog to start browsing and borrowing books.</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href={returnUrl}>Continue to {returnUrl === "/catalog" ? "Catalog" : "Book"}</Link>
          </Button>
          <p className="text-sm text-gray-500 text-center">Redirecting in {countdown} seconds...</p>
        </CardFooter>
      </Card>

      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm text-gray-500">
          A confirmation email has been sent to your email address.
          <br />
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  )
}
