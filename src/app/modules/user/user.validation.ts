import { z } from "zod";

// Define the User schema
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email format").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(8, "Phone number must be at least 8 characters"),
    address: z.string().min(1, "Address is required"),
    role: z.enum(["user", "admin"]).default("user"),
    profilePhoto: z.string().default(""),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .toLowerCase()
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    phone: z
      .string()
      .min(8, "Phone number must be at least 8 characters")
      .optional(),
    address: z.string().min(1, "Address is required").optional(),
    role: z.enum(["user", "admin"]).default("user").optional(),
    profilePhoto: z.string().default("").optional(),
  }),
});

export { createUserValidationSchema, updateUserValidationSchema };
