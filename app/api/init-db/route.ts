import { NextResponse } from "next/server"
import { initDatabase, updateDatabaseSchema } from "@/lib/db"

export async function GET() {
  try {
    // Initialize the database
    await initDatabase()

    // Update the database schema if needed
    await updateDatabaseSchema()

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: error.message || "Failed to initialize database" }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Initialize the database
    await initDatabase()

    // Update the database schema if needed
    await updateDatabaseSchema()

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: error.message || "Failed to initialize database" }, { status: 500 })
  }
}
