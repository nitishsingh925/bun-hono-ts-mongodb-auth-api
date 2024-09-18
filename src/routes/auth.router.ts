import { Hono } from "hono";
import {
  getCurrentUserProfile,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware/zod.validation.middleware";
import { signinSchema, signupSchema } from "../dto/auth.dto";
import { authenticateUser } from "../middleware/auth.middleware";

const router = new Hono();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/signin", validateRequest(signinSchema), signin);
router.post("/signout", signout);
router.get("/profile", authenticateUser, getCurrentUserProfile);

export default router;
