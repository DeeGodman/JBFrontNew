import { z } from "zod"

export const OrderSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  amount: z.number(),
  customerPhone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number format"),
  bundleId: z.string(),
  network: z.enum(["mtn", "telecel", "at"]),
  paymentMethod: z.enum(["momo", "card"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateOrderSchema = OrderSchema.pick({
  customerPhone: true,
  bundleId: true,
  network: true,
  paymentMethod: true,
})
