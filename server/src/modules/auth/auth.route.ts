import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserValidationZod, loginValidationZod } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserValidationZod),
  AuthControllers.registerController,
);

router.post(
  "/login",
  validateRequest(loginValidationZod),
  AuthControllers.loginUserController,
);

export const authRoutes = router;
