import { Hono } from "hono";
import authRouter from "./routes/auth.router";
import { logger } from "hono/logger";

const app = new Hono();

// Use the logger middleware to log requests
app.use(logger());

app.get("/", (c) => c.text("Hono! with Bun"));

app.route("/api/v1/auth", authRouter);

app.use("*", async (c) => c.json({ message: "Route not found 404" }, 404));
export { app };
