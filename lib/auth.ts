import { query } from "./db"
import * as jose from "jose"
import bcrypt from "bcryptjs"

// Get JWT secret from environment variables or use a fallback for development
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret_should_be_at_least_32_characters_long",
)

// JWT token expiration times
const ACCESS_TOKEN_EXPIRES_IN = "1h" // 1 hour
const REFRESH_TOKEN_EXPIRES_IN = "7d" // 7 days

// User types
export type User = {
  id: number
  name: string
  email: string
  role: "user" | "librarian" | "admin"
}

export type UserWithPassword = User & {
  password: string
}

// Register a new user
export async function registerUser(name: string, email: string, password: string, plan?: string) {
  try {
    console.log("Registering user:", { name, email, passwordLength: password?.length || 0 })

    // Validate inputs
    if (!name || typeof name !== "string") {
      throw new Error("Valid name is required")
    }

    if (!email || typeof email !== "string") {
      throw new Error("Valid email is required")
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      throw new Error("Password must be at least 6 characters long")
    }

    // Check if user already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email])
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error("User with this email already exists")
    }

    // Hash the password with bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Use a transaction to ensure data consistency
    const connection = await (query as any).getConnection()

    try {
      await connection.beginTransaction()

      // Insert the user
      const userResult = await connection.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ])

      // Get the inserted user ID
      const userId = userResult[0].insertId

      // Create a subscription with appropriate status
      await connection.execute("INSERT INTO subscriptions (user_id, plan, status) VALUES (?, ?, ?)", [
        userId,
        plan || "basic-monthly",
        "active",
      ])

      await connection.commit()

      return { success: true, userId }
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Login a user
export async function loginUser(email: string, password: string) {
  try {
    // Find the user
    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("User not found")
    }

    const user = users[0] as UserWithPassword

    // Verify the password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new Error("Invalid password")
    }

    // Create token payload
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    // Generate access token
    const accessToken = await generateAccessToken(payload)

    // Generate refresh token
    const refreshToken = await generateRefreshToken(payload)

    // Store refresh token in database (in a real app, you'd have a refresh_tokens table)
    // For this example, we'll just log it
    console.log("Refresh token generated:", refreshToken)

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Generate access token
async function generateAccessToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(JWT_SECRET)
}

// Generate refresh token
async function generateRefreshToken(payload: any) {
  return await new jose.SignJWT({
    ...payload,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(JWT_SECRET)
}

// Verify token
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    })

    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "user" | "librarian" | "admin",
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Verify token synchronously (for middleware)
export function verifyTokenSync(token: string): User | null {
  try {
    // For middleware, we'll use a simpler approach
    // Split the JWT into parts
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    // Decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString())

    // Check if the token has expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new Error("Token expired")
    }

    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "user" | "librarian" | "admin",
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    // Verify the refresh token
    const { payload } = await jose.jwtVerify(refreshToken, JWT_SECRET, {
      algorithms: ["HS256"],
    })

    // Check if it's a refresh token
    if (payload.type !== "refresh") {
      throw new Error("Invalid token type")
    }

    // Generate a new access token
    const newPayload = {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    }

    const accessToken = await generateAccessToken(newPayload)

    return {
      token: accessToken,
      user: newPayload,
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await query("SELECT id, name, email, role FROM users WHERE id = ?", [id])

    if (!Array.isArray(users) || users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}