import type { Context } from "hono";
import {
  signupService,
  signinService,
  signoutService,
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
