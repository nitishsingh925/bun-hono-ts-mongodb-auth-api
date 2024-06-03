import { Hono } from "hono";
import { signup } from "../controllers/auth.controller";

const router = new Hono();

router.post("/signup", signup);

export default router;
