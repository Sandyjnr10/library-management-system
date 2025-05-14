import { PUT, DELETE } from "@/app/api/user/subscription/route"
import { verifyToken } from "@/lib/auth"

jest.mock("@/lib/auth", () => ({
  verifyToken: jest.fn(),
}))

jest.mock("@/lib/subscription", () => ({
  getUserSubscription: jest.fn().mockResolvedValue({ id: 1, plan: "basic-monthly" }),
  updateSubscription: jest.fn().mockResolvedValue({ id: 1, plan: "premium-monthly" }),
}))

jest.mock("@/lib/db", () => ({
  query: jest.fn().mockResolvedValue([{ id: 1, plan: "basic-monthly" }]),
}))

describe("Subscription API", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should reject unauthorized subscription update", async () => {
    const req = new Request("http://localhost:3000/api/user/subscription", {
      method: "PUT",
      headers: {},
      body: JSON.stringify({ plan: "premium-monthly" }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(401)
  })

  it("should update subscription if authorized", async () => {
    (verifyToken as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    })

    const req = new Request("http://localhost:3000/api/user/subscription", {
      method: "PUT",
      headers: {
        cookie: "auth_token=valid-token",
      },
      body: JSON.stringify({ plan: "premium-monthly" }),
    })

    const res = await PUT(req)
    expect(res.status).toBe(200)
  })

  it("should cancel subscription if authorized", async () => {
    (verifyToken as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    })

    const req = new Request("http://localhost:3000/api/user/subscription", {
      method: "DELETE",
      headers: {
        cookie: "auth_token=valid-token",
      },
    })

    const res = await DELETE(req)
    expect(res.status).toBe(200)
  })
})