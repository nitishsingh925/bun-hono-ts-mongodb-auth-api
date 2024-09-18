import type { Context } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setSignedCookie } from "hono/cookie";
import User from "../models/user.models";
import { JWT_SECRET } from "../utils/envHandler";
import { HTTP_STATUS } from "../utils/httpStatus";

// signup service
interface ISignup {
  name: string;
  userName: string;
  email: string;
  password: string;
}

export const signupService = async (c: Context) => {
  try {
    const { name, userName, email, password }: ISignup = await c.req.json();

    const userNameLower = userName.toLowerCase();
    const emailLower = email.toLowerCase();

    // Check if any fields are empty
    if ([email, userName, password].some((field) => field?.trim() === "")) {
      return {
        data: { message: "All fields are required" },
        status: HTTP_STATUS.BAD_REQUEST,
      };
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
      $or: [{ email: emailLower }, { userName: userNameLower }],
    });

    if (existedUser) {
      return {
        data: { message: "User already exists" },
        status: HTTP_STATUS.CONFLICT,
      };
    }

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

    // Create a new user instance without password
    const createdUser = await User.findById(user._id).select("-password");

    return {
      data: { message: "User created successfully", user: createdUser },
      status: HTTP_STATUS.CREATED,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// signin service
interface ISignin {
  userName?: string;
  email?: string;
  password: string;
}

export const signinService = async (c: Context) => {
  try {
    const { userName, email, password }: ISignin = await c.req.json();
    const emailLower = email ? email.toLowerCase() : null;
    const userNameLower = userName && userName.toLowerCase();

    // Check if user with the given email or username exists
    const user = await User.findOne({
      $or: [{ email: emailLower }, { userName: userNameLower }],
    });
    if (!user) {
      return {
        data: { message: "User not found" },
        status: HTTP_STATUS.NOT_FOUND,
      };
    }

    // Check if password is correct
    const isPasswordCorrect = await Bun.password.verify(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return {
        data: { message: "Invalid password" },
        status: HTTP_STATUS.UNAUTHORIZED,
      };
    }

    // Generate a JWT token
    const accessToken = await sign({ userId: user._id }, JWT_SECRET);

    const setCookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    };
    await setSignedCookie(
      c,
      "auth_token",
      accessToken,
      JWT_SECRET,
      setCookieOptions
    );

    return {
      data: { message: "User logged in successfully", accessToken },
      status: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// signout service
export const signoutService = async (c: Context) => {
  try {
    // Clear the authentication cookie
    deleteCookie(c, "auth_token");

    return {
      data: { message: "User logged out successfully" },
      status: HTTP_STATUS.OK,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get user profile by ID service
export const getUserProfileById = async (userId: string) => {
  try {
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
