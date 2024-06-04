import type { Context } from "hono";
import User from "../models/user.models";

export const signup = async (c: Context) => {
  try {
    const { name, userName, email, password } = await c.req.json();

    const hashPassword = await Bun.password.hash(password);

    const user = new User({
      userName,
      name,
      email,
      password: hashPassword,
    });

    // Save the user to the database
    await user.save();

    // Return a successful response
    return c.json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Signup error:", error);

    // Check if the error is an instance of Error and has a message property
    if (error instanceof Error) {
      // Return an error response
      return c.json({ message: "Signup failed", error: error.message }, 500);
    } else {
      // Handle unexpected error types
      return c.json({ message: "Signup failed due to an unknown error" }, 500);
    }
  }
};
