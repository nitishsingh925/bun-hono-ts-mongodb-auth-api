import type { Context } from "hono";
import {
  signupService,
  signinService,
  signoutService,
  getUserProfileById,
} from "../services/auth.service";
import { HTTP_STATUS } from "../utils/httpStatus";

// Signup
export const signup = async (c: Context) => {
  try {
    const result = await signupService(c);
    return c.json(result.data, { status: result.status });
  } catch (error: any) {
    return c.json(
      { message: `Internal server error: ${error.message}` },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};

// Signin
export const signin = async (c: Context) => {
  try {
    const result = await signinService(c);
    return c.json(result.data, { status: result.status });
  } catch (error: any) {
    return c.json(
      { message: `Internal server error: ${error.message}` },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};

// Signout
export const signout = async (c: Context) => {
  try {
    const result = await signoutService(c);
    return c.json(result.data, { status: result.status });
  } catch (error: any) {
    return c.json(
      { message: `Internal server error: ${error.message}` },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};

// Get current user's profile
export const getCurrentUserProfile = async (c: Context) => {
  try {
    const user = c.get("user"); // Access the user from the context
    if (!user || !user.userId) {
      return c.json(
        { message: "User not authenticated" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Fetch the user profile from the database using the userId
    const userProfile = await getUserProfileById(user.userId);

    return c.json(
      { message: "User profile fetched successfully", user: userProfile },
      { status: HTTP_STATUS.OK }
    );
  } catch (error: any) {
    return c.json(
      { message: `Error fetching user profile: ${error.message}` },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};
