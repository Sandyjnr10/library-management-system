import request from "supertest"
import { createMocks } from "node-mocks-http"

jest.mock("../../lib/auth", () => ({
  verifyToken: jest.fn().mockResolvedValue({ userId: "123", email: "test@example.com" }),
  generateToken: jest.fn().mockReturnValue("mock-token"),
}))

jest.mock("../../lib/db", () => ({
  query: jest.fn().mockResolvedValue([{ id: "123", plan: "basic-monthly" }]),
  execute: jest.fn().mockResolvedValue({ affectedRows: 1 }),
}))

describe("Subscription Management API", () => {
  let app: any // <-- Fixed here
  let token: string

  beforeAll(() => {
    token = "mock-valid-token"
    app = request("http://localhost:3000")
  })

  it("should update the subscription", async () => {
    const { req, res } = createMocks({
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: { plan: "premium-monthly" },
    })

    const { PUT } = require("../../app/api/user/subscription/route")
    await PUT(req, res)
    expect(res._getStatusCode()).toBe(200)
  })

  it("should cancel the subscription", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    const { DELETE } = require("../../app/api/user/subscription/route")
    await DELETE(req, res)
    expect(res._getStatusCode()).toBe(200)
  })
})
it("should reject unauthorized subscription update", async () => {
  const { req, res } = createMocks({
    method: "PUT",
    headers: {}, // No token
    body: { plan: "premium-monthly" },
  })

  const { PUT } = require("@/app/api/user/subscription/route")
  await PUT(req, res)
  expect(res._getStatusCode()).toBe(401)
})
