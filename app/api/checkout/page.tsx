import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Payment Successful | AML Library",
  description: "Your subscription has been successfully activated",
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get the plan and return URL from query params
  const plan = (searchParams.plan as string) || "premium-monthly"
  const returnUrl = (searchParams.returnUrl as string) || "/catalog"

  // Format the plan name for display
  const formatPlanName = (planId: string) => {
    const parts = planId.split("-")
    return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-green-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 bg-green-50 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription>Your subscription has been activated</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-1">Subscription Details</h3>
              <p className="text-gray-600">
                Plan: <span className="font-semibold">{formatPlanName(plan)}</span>
              </p>
              <p className="text-gray-600">
                Status: <span className="text-green-600 font-semibold">Active</span>
              </p>
              <p className="text-gray-600">
                Start Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </p>
            </div>
            <p className="text-gray-600">
              Thank you for your subscription! You can now enjoy all the benefits of your{" "}
              <span className="font-semibold">{formatPlanName(plan)}</span> plan.
            </p>
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              A confirmation email has been sent to your registered email address.
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href={returnUrl} className="flex items-center justify-center">
                Continue to Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/subscription">View Subscription Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
