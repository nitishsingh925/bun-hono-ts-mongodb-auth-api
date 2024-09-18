import type { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { JWT_SECRET } from "../utils/envHandler";
import { HTTP_STATUS } from "../utils/httpStatus";
import { verify } from "hono/jwt";

export const authenticateUser = async (c: Context, next: Next) => {
  try {
    // Retrieve and decode the JWT from the signed cookie
    const authToken = await getSignedCookie(c, JWT_SECRET, "auth_token");
    if (!authToken) {
      return c.json(
        { message: "Unauthorized" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const decoded = await verify(authToken, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return c.json(
        { message: "Unauthorized" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Add the decoded user information to the context
    c.set("user", decoded);

    // Continue to the next middleware or handler
    await next();
  } catch (error) {
    return c.json(
      { message: "Unauthorized" },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }
};
