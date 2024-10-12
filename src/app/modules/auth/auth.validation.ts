import { z } from "zod";

// Define the Login schema
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: "User id is required!",
    }),
    newPassword: z.string({
      required_error: "User password is required!",
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  changePasswordValidationSchema,
};
