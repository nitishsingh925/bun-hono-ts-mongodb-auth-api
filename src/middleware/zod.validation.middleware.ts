import type { Context, Next } from "hono";
import { ZodSchema, ZodError } from "zod";
import { HTTP_STATUS } from "../utils/httpStatus";

// Create a validation middleware that takes a Zod schema as an argument
export const validateRequest = (schema: ZodSchema) => {
  return async (c: Context, next: Next) => {
    try {
      // Parse and validate the request body using the provided schema
      schema.parse(await c.req.json());
      // Proceed to the next middleware or route handler if validation passes
      await next();
    } catch (error) {
      // If validation fails, check if it's a Zod error
      if (error instanceof ZodError) {
        // Extract the error issues from the Zod error

        const issues = error.issues.map((issue) => ({
          // validation: issue.code,
          // code: issue.code,
          message: issue.message,
          // path: issue.path,
        }));

        // Return a 400 Bad Request response with the error issues
        return c.json({ issues }, { status: HTTP_STATUS.BAD_REQUEST });
      } else if (error instanceof Error) {
        // Handle unexpected errors
        return c.json(
          { message: error.message },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      } else {
        // Handle unknown errors
        return c.json(
          { message: "Invalid request data" },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    }
  };
};
