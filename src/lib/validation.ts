import { z } from "zod";

/**
 * Escapes HTML special characters to mitigate Cross-Site Scripting (XSS).
 */
export function sanitizeText(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export const sanitizedString = z.string().transform((val) => sanitizeText(val.trim()));

export const safeImageUrl = z.string().url().refine((val) => {
  try {
    const parsed = new URL(val);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}, "Invalid URL scheme. Only http/https are allowed.");

// ─── Input Validation Schemas ─────────────────────────────────────────

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters").max(100).transform((val) => sanitizeText(val.trim())),
  customerEmail: z.string().email("Invalid email format"),
  phone: z.string().min(8, "Phone number is too short").max(20).refine((val) => /^[+0-9\s-()]+$/.test(val), "Invalid phone characters").transform((val) => sanitizeText(val.trim())),
  shippingAddress: z.string().min(5, "Address is too short").max(300).transform((val) => sanitizeText(val.trim())),
  postalCode: z.string().min(3, "Postal code is too short").max(15).transform((val) => sanitizeText(val.trim())),
  province: z.string().min(2, "Province is too short").max(50).transform((val) => sanitizeText(val.trim())),
  city: z.string().min(2, "City is too short").max(50).transform((val) => sanitizeText(val.trim())),
  paymentMethod: z.enum(["cod", "jazzcash", "easypaisa"]),
  receiptUrl: z.string().url().optional().nullable().transform((val) => val || null),
  orderNotes: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  couponCode: z.string().optional().nullable().transform((val) => val ? val.trim().toUpperCase() : null),
  items: z.array(
    z.object({
      productId: z.string().uuid("Invalid product ID format"),
      quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Maximum quantity exceeded"),
      size: z.string().min(1, "Size is required").max(20),
    })
  ).min(1, "At least one item is required in the order"),
}).superRefine((data, ctx) => {
  if (data.paymentMethod !== "cod" && !data.receiptUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Payment receipt is required for JazzCash/Easypaisa orders",
      path: ["receiptUrl"],
    });
  }
});

export const feedbackSchema = z.object({
  type: z.enum(["bug", "suggestion", "content_issue", "general"]),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  message: z.string().min(1, "Message is required").max(1000).transform((val) => sanitizeText(val.trim())),
  name: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  phone: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  contactPermission: z.boolean().optional().default(false),
  pageUrl: z.string().max(200).optional().default("").transform((val) => sanitizeText(val.trim())),
  subject: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  experienceCategory: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  orderId: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  wouldRecommend: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  heardFrom: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
});

export const messageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).transform((val) => sanitizeText(val.trim())),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200).transform((val) => sanitizeText(val.trim())),
  message: z.string().min(2, "Message must be at least 2 characters").max(2000).transform((val) => sanitizeText(val.trim())),
  type: z.string().optional().default("general").transform((val) => sanitizeText(val.trim())),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  body: z.string().min(2, "Review text must be at least 2 characters").max(1000).transform((val) => sanitizeText(val.trim())),
  guestName: z.string().optional().nullable().transform((val) => val ? sanitizeText(val.trim()) : null),
  guestEmail: z.string().email("Invalid email format").optional().nullable().or(z.literal("")).transform((val) => val ? val.trim() : null),
});
