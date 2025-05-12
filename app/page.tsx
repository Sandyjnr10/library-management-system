import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, CreditCard, BarChart4 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Advanced Media Library Management System</h1>
            <p className="text-xl mb-8">
              A modern solution for managing library resources, subscriptions, and user interactions across all branches
              in England.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Extensive Media Collection"
              description="Access books, journals, periodicals, and multimedia across all branches."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Multi-Channel Access"
              description="Seamless experience via online platforms, phone support, and in-branch interactions."
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-blue-600" />}
              title="Flexible Subscriptions"
              description="Choose from monthly or yearly plans with different borrowing privileges."
            />
            <FeatureCard
              icon={<BarChart4 className="h-10 w-10 text-blue-600" />}
              title="Data-Driven Insights"
              description="Comprehensive analytics to improve library operations and user experience."
            />
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Subscription Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PlanCard
              title="Basic Monthly"
              price="£9.99"
              period="per month"
              features={["Borrow 1 book at a time", "Online reservations", "Access to all branches", "Cancel anytime"]}
              ctaText="Choose Basic Monthly"
              ctaLink="/auth/signup?plan=basic-monthly"
              highlighted={false}
            />
            <PlanCard
              title="Premium Monthly"
              price="£15.99"
              period="per month"
              features={[
                "Borrow 3 books at a time",
                "Priority reservations",
                "Access to all branches",
                "Cancel anytime",
              ]}
              ctaText="Choose Premium Monthly"
              ctaLink="/auth/signup?plan=premium-monthly"
              highlighted={true}
            />
            <PlanCard
              title="Basic Yearly"
              price="£105"
              period="per year"
              features={[
                "Borrow 1 book at a time",
                "Online reservations",
                "Access to all branches",
                "Save £14.88 yearly",
              ]}
              ctaText="Choose Basic Yearly"
              ctaLink="/auth/signup?plan=basic-yearly"
              highlighted={false}
            />
            <PlanCard
              title="Premium Yearly"
              price="£130"
              period="per year"
              features={[
                "Borrow 3 books at a time",
                "Priority reservations",
                "Access to all branches",
                "Save £61.88 yearly",
              ]}
              ctaText="Choose Premium Yearly"
              ctaLink="/auth/signup?plan=premium-yearly"
              highlighted={false}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PlanCard({
  title,
  price,
  period,
  features,
  ctaText,
  ctaLink,
  highlighted,
}: {
  title: string
  price: string
  period: string
  features: string[]
  ctaText: string
  ctaLink: string
  highlighted: boolean
}) {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden ${highlighted ? "border-2 border-blue-500 relative" : "border border-gray-200"}`}
    >
      {highlighted && <div className="bg-blue-500 text-white text-xs font-semibold py-1 text-center">MOST POPULAR</div>}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-gray-600 ml-1">{period}</span>
        </div>
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <Button asChild className={`w-full ${highlighted ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      </div>
    </div>
  )
}
