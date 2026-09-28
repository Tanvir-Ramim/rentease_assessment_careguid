import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserValidationZod } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserValidationZod),
  AuthControllers.registerController,
);

export const authRoutes = router;
