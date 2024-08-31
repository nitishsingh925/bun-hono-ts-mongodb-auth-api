import { Hono } from "hono";
import authRouter from "./routes/auth.router";
import { logger } from "hono/logger";
import { HTTP_STATUS } from "./utils/httpStatus";

const app = new Hono();

// Use the logger middleware to log requests
app.use(logger());

app.get("/", (c) => c.text("Hono! with Bun"));

// Register the auth router
app.route("/api/v1/auth", authRouter);

// Catch-all route for handling 404 errors
app.use("*", async (c) =>
  c.json({ message: "Route not found 404" }, HTTP_STATUS.NOT_FOUND)
);
export { app };
