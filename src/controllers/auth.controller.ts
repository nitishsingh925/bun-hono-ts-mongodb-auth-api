import type { Context } from "hono";
import { sign } from "hono/jwt";
import { setSignedCookie } from "hono/cookie";
import User from "../models/user.models";
import { JWT_SECRET } from "../utils/envHandler";

interface IUser {
  name: string;
  userName: string;
  email: string;
  password: string;
}

export const signup = async (c: Context) => {
  try {
    const { name, userName, email, password }: IUser = await c.req.json();

    const userNameLower = userName.toLowerCase();
    const emailLower = email.toLowerCase();

    // Check if user with the given email,username or password blank (empty) exists
    if ([email, userName, password].some((field) => field?.trim() === "")) {
      return c.json({ message: "All fields are required" }, 400);
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
      $or: [{ email: emailLower }, { UserName: userNameLower }],
    });

    if (existedUser) return c.json({ message: "User already exists" }, 409);

    // Hash the password
    const hashPassword = await Bun.password.hash(password);

    // Capitalize the name
    const capitalizeName = (name: string) => {
      return name.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Create a new user instance
    const user = new User({
      name: capitalizeName(name),
      userName: userNameLower,
      email: emailLower,
      password: hashPassword,
    });

    // Save the user to the database
    await user.save();

    //  Create a new user instance without password
    const createdUser = await User.findById(user._id).select("-password");

    // Return a successful response
    return c.json(
      { message: "User created successfully", user: createdUser },
      201
    );
  } catch (error: any) {
    // Return an error response
    return c.json({ message: `Internal server error ${error.message}` });
  }
};

interface ISignin {
  email: string;
  password: string;
}

export const signin = async (c: Context) => {
  try {
    const { email, password }: ISignin = await c.req.json();
    const emailLower = email.toLowerCase();

    // check if user with the given email exists
    const user = await User.findOne({ email: emailLower });
    if (!user) return c.json({ message: "User not found" }, 404);

    // check if password is correct
    const isPasswordCorrect = await Bun.password.verify(
      password,
      user.password
    );
    if (!isPasswordCorrect) return c.json({ message: "Invalid password" }, 401);

    // Generate a JWT token
    const accessToken = await sign({ userId: user._id }, JWT_SECRET);

    const setCookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: true, // Send cookie only over HTTPS connections (for production)
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };
    await setSignedCookie(
      c,
      "auth_token",
      accessToken,
      JWT_SECRET,
      setCookieOptions
    );
    // Return a successful response
    return c.json({ message: "User logged in successfully", accessToken }, 200);
  } catch (error: any) {
    // Return an error response
    return c.json({ message: `Internal server error ${error.message}` });
  }
};
