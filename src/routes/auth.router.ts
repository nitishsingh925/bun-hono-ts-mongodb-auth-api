import { Hono } from "hono";
import { signin, signout, signup } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/zod.validation.middleware";
import { signinSchema, signupSchema } from "../dto/auth.dto";

const router = new Hono();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/signout", signout);

export default router;
