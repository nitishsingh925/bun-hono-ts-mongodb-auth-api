import { Hono } from "hono";
import { signin, signout, signup } from "../controllers/auth.controller";

const router = new Hono();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

export default router;
