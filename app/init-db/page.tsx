"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function InitDbPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const initializeDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Database Initialization</CardTitle>
            <CardDescription>
              Initialize the database tables required for the Advanced Media Library system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              This will create all necessary tables in your MySQL database and populate them with sample data. Make sure
              your database connection is properly configured.
            </p>

            {result && (
              <div
                className={`p-4 mb-4 rounded-md ${
                  result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <p className={result.success ? "text-green-800 font-medium" : "text-red-800 font-medium"}>
                      {result.success ? "Success" : "Error"}
                    </p>
                    <p className={result.success ? "text-green-700 text-sm" : "text-red-700 text-sm"}>
                      {result.message || result.error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={initializeDatabase} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
            {result?.success && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
