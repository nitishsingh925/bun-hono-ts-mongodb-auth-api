import { z } from "zod";

// Signup DTO validation schema
export const signupSchema = z.object({
  name: z.string().optional(),
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Signin DTO validation schema
export const signinSchema = z.object({
  userName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
