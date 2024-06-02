import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hono! with Bun"));

export { app };
