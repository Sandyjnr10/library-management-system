"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, CheckCircle2, AlertCircle, Clock, CreditCard } from "lucide-react"

type SubscriptionData = {
  id: number
  plan: string
  status: "active" | "cancelled" | "expired" | "pending"
  startDate: string
  endDate: string | null
}

type PlanType = "basic-monthly" | "premium-monthly" | "basic-yearly" | "premium-yearly"

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("premium-monthly")

  // Fetch subscription data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/subscription")
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.subscription)
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error)
        toast({
          title: "Error",
          description: "Failed to load subscription data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle form submission - redirects to checkout page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Always redirect to checkout page with selected plan
    router.push(`/checkout/subscription?plan=${selectedPlan}`)
  }

  // Plan details
  const planDetails = {
    "basic-monthly": {
      title: "Basic Monthly",
      price: "£9.99/month",
      description: "Borrow 1 book at a time",
      features: ["Access to entire catalog", "1 book limit", "Monthly billing"],
    },
    "premium-monthly": {
      title: "Premium Monthly",
      price: "£15.99/month",
      description: "Borrow 3 books at a time",
      features: ["Access to entire catalog", "3 book limit", "Monthly billing", "Priority customer support"],
    },
    "basic-yearly": {
      title: "Basic Yearly",
      price: "£105/year",
      description: "Borrow 1 book at a time",
      features: ["Access to entire catalog", "1 book limit", "Annual billing", "Save £14.88 compared to monthly"],
    },
    "premium-yearly": {
      title: "Premium Yearly",
      price: "£130/year",
      description: "Borrow 3 books at a time",
      features: [
        "Access to entire catalog",
        "3 book limit",
        "Annual billing",
        "Priority customer support",
        "Save £61.88 compared to monthly",
      ],
    },
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>

      {/* Current Subscription Status */}
      {subscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your current subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold mr-3">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1).replace("-", " ")}
                  </h3>
                  {subscription.status === "active" && <Badge className="bg-green-500">Active</Badge>}
                  {subscription.status === "cancelled" && (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Cancelled
                    </Badge>
                  )}
                  {subscription.status === "expired" && (
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Expired
                    </Badge>
                  )}
                  {subscription.status === "pending" && (
                    <Badge variant="outline" className="text-blue-500 border-blue-500">
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  <span className="inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> Start Date:{" "}
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
                {subscription.endDate && (
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> End Date: {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {subscription.status === "active" && (
                <div className="text-sm">
                  <p className="text-gray-600 mb-2">Want to change your plan?</p>
                  <p className="flex items-center text-blue-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Select a new plan below
                  </p>
                </div>
              )}

              {subscription.status === "cancelled" && (
                <div className="text-sm">
                  <p className="text-gray-600 mb-2">Your subscription has been cancelled</p>
                  <p className="flex items-center text-blue-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Select a plan below to reactivate
                  </p>
                </div>
              )}

              {subscription.status === "pending" && (
                <div className="text-sm">
                  <p className="text-gray-600 mb-2">Your subscription is pending</p>
                  <p className="flex items-center text-blue-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Complete your subscription below
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Selection */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Select Your Plan</CardTitle>
            <CardDescription>Choose the subscription plan that best fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <RadioGroup
                value={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as PlanType)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {Object.entries(planDetails).map(([id, plan]) => (
                  <div key={id} className="relative">
                    <RadioGroupItem value={id} id={`plan-${id}`} className="peer sr-only" />
                    <Label
                      htmlFor={`plan-${id}`}
                      className="flex flex-col p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-lg mb-1">{plan.title}</span>
                      <span className="text-lg font-semibold text-blue-600 mb-1">{plan.price}</span>
                      <span className="text-sm text-gray-600 mb-3">{plan.description}</span>

                      <ul className="space-y-1 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Important Subscription Information</p>
                  <p className="text-amber-700">
                    Clicking "Continue to Checkout" below will take you to our payment page where you can enter your
                    payment details to activate your subscription.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" className="w-full sm:w-auto flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Checkout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/catalog">Return to Catalog</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
