"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, CreditCard, Lock, Calendar, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Plan types
type BasePlanType = {
  title: string
  price: number
  period: string
  description: string
}

type ExtendedPlanType = BasePlanType & {
  originalPrice?: number
  isProrated?: boolean
}

type PlansObjectType = {
  [key: string]: ExtendedPlanType
}

// Then update the PLANS constant to use this type:
const PLANS: PlansObjectType = {
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

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = (searchParams.get("plan") as PlanType) || "premium-monthly"

  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(planId)
  const [returnUrl, setReturnUrl] = useState<string>("/catalog")

  // Get return URL from query params if available
  useEffect(() => {
    const returnUrlParam = searchParams.get("returnUrl")
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam)
    }
  }, [searchParams])

  // Generate years for expiry date select
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  // Add this code after the useEffect hooks to handle prorated amounts
  useEffect(() => {
    // Check if this is a prorated upgrade
    const isProratedUpgrade = searchParams.get("prorated") === "true"
    const proratedAmount = searchParams.get("amount")

    if (isProratedUpgrade && proratedAmount) {
      // Create a deep copy of the PLANS object
      const updatedPlans: PlansObjectType = JSON.parse(JSON.stringify(PLANS))

      // Update the selected plan with prorated information
      updatedPlans[selectedPlan] = {
        ...updatedPlans[selectedPlan],
        price: Number.parseFloat(proratedAmount),
        originalPrice: updatedPlans[selectedPlan].price,
        isProrated: true,
      }

      // Update the plans object
      setCustomPlans(updatedPlans)
    }
  }, [searchParams, selectedPlan])

  // Add this state for custom plan pricing
  const [customPlans, setCustomPlans] = useState<PlansObjectType | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number"
      }

      if (!formData.cardName.trim()) {
        newErrors.cardName = "Cardholder name is required"
      }

      if (!formData.expiryMonth) {
        newErrors.expiryMonth = "Expiry month is required"
      }

      if (!formData.expiryYear) {
        newErrors.expiryYear = "Expiry year is required"
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits"
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Process payment via API
      const response = await fetch("/api/checkout/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          paymentMethod,
          email: formData.email,
          isProrated: customPlans && customPlans[selectedPlan]?.isProrated,
          // Only include card details if paying by card
          ...(paymentMethod === "card" && {
            cardDetails: {
              number: formData.cardNumber.replace(/\s/g, ""),
              name: formData.cardName,
              expiry: `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`,
              cvv: formData.cvv,
            },
          }),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Payment processing failed")
      }

      // Payment successful
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated!",
      })

      // Redirect to success page
      router.push(`/checkout/success?plan=${selectedPlan}&returnUrl=${encodeURIComponent(returnUrl)}`)
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard/subscription" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subscription
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Complete your subscription purchase</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as "card" | "paypal")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="payment-card" />
                        <Label htmlFor="payment-card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="payment-paypal" />
                        <Label htmlFor="payment-paypal" className="cursor-pointer">
                          <svg className="h-5 w-5 mr-2 inline" viewBox="0 0 24 24" fill="#00457C">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19a.513.513 0 0 0-.507.435l-1.65 10.466a.42.42 0 0 0 .414.486h4.474c.344 0 .636-.248.69-.586l.027-.139.52-3.302.033-.179a.689.689 0 0 1 .68-.586h.428c2.78 0 4.954-.566 5.59-2.2.264-.677.422-1.5.422-2.466 0-1.128-.396-2.034-1.205-2.724z" />
                          </svg>
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details (shown only if card payment selected) */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Smith"
                          value={formData.cardName}
                          onChange={handleChange}
                          className={errors.cardName ? "border-red-500" : ""}
                        />
                        {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Expiry Month</Label>
                          <Select
                            value={formData.expiryMonth}
                            onValueChange={(value) => handleSelectChange("expiryMonth", value)}
                          >
                            <SelectTrigger id="expiryMonth" className={errors.expiryMonth ? "border-red-500" : ""}>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, "0")
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                          {errors.expiryMonth && <p className="text-sm text-red-500">{errors.expiryMonth}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Expiry Year</Label>
                          <Select
                            value={formData.expiryYear}
                            onValueChange={(value) => handleSelectChange("expiryYear", value)}
                          >
                            <SelectTrigger id="expiryYear" className={errors.expiryYear ? "border-red-500" : ""}>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryYear && <p className="text-sm text-red-500">{errors.expiryYear}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            className={errors.cvv ? "border-red-500" : ""}
                            maxLength={4}
                          />
                          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email for receipt */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email for Receipt</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  {/* Security Note */}
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex items-start">
                      <Lock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-700">Secure Checkout</p>
                        <p>
                          This is a simulated checkout. No real payment will be processed and no actual card details
                          will be stored.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        Pay £
                        {customPlans
                          ? customPlans[selectedPlan].price.toFixed(2)
                          : PLANS[selectedPlan].price.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Plan</Label>
                  <RadioGroup
                    value={String(selectedPlan)}
                    onValueChange={(value) => setSelectedPlan(value as PlanType)}
                    className="flex flex-col space-y-2"
                  >
                    {Object.entries(PLANS).map(([id, plan]) => (
                      <div key={id} className="flex items-center space-x-2">
                        <RadioGroupItem value={id} id={`plan-${id}`} />
                        <Label htmlFor={`plan-${id}`} className="flex flex-col cursor-pointer">
                          <span className="font-medium">{plan.title}</span>
                          <span className="text-sm text-gray-500">{plan.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  {customPlans && customPlans[selectedPlan]?.isProrated && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Plan Price</span>
                        <span className="line-through text-gray-500">
                          £{customPlans[selectedPlan].originalPrice?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Prorated Amount</span>
                        <span>£{customPlans[selectedPlan].price.toFixed(2)}</span>
                      </div>
                      <div className="bg-green-50 p-2 rounded text-sm text-green-700 mt-2">
                        You&apos;re only paying the difference for the remainder of your subscription period.
                      </div>
                    </>
                  )}
                  {!customPlans && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>£{PLANS[selectedPlan].price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>£0.00</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>
                      £{customPlans ? customPlans[selectedPlan].price.toFixed(2) : PLANS[selectedPlan].price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">per {PLANS[selectedPlan].period}</div>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      {searchParams.get("prorated") === "true"
                        ? "This payment covers the upgrade cost for your remaining subscription period."
                        : "Your subscription will be activated immediately after successful payment."}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
