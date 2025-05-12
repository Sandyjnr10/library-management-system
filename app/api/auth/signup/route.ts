import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json(
        {
          error: "Invalid request body. Please provide valid JSON.",
        },
        { status: 400 },
      )
    }

    const { name, email, password } = body

    console.log("Signup request received:", {
      nameProvided: !!name,
      emailProvided: !!email,
      passwordProvided: !!password,
    })

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Register the user with detailed error handling
    try {
      const result = await registerUser(name, email, password)

      return NextResponse.json(
        { success: true, message: "User registered successfully", userId: result.userId },
        { status: 201 },
      )
    } catch (error: any) {
      console.error("User registration error:", error)

      // Handle specific error cases
      if (error.message.includes("already exists")) {
        return NextResponse.json({ error: error.message }, { status: 409 }) // Conflict
      }

      if (error.code === "ER_NO_SUCH_TABLE") {
        return NextResponse.json(
          {
            error: "Database setup incomplete. Please initialize the database first.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: error.message || "Failed to register user",
          details: error.code ? `Error code: ${error.code}` : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Signup route error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during signup",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
