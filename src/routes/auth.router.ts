import { Hono } from "hono";
import { signin, signup } from "../controllers/auth.controller";

const router = new Hono();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
