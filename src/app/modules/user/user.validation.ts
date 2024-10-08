import { z } from "zod";

// Define the User schema
const userValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Invalid email format").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(8, "Phone number must be at least 8 characters"),
    address: z.string().min(1, "Address is required"),
    role: z.enum(["user", "admin"]).default("user"),
    // isDeleted: z.boolean().default(false),
  }),
});

export { userValidationSchema };
