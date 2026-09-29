import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserValidationZod, loginValidationZod } from "./auth.validation";
import { auth } from "../../middlewares/authRoleChecker";

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

router.get("/managers", auth("admin"), AuthControllers.getManagersController);

router.post("/refresh-token", AuthControllers.refreshTokenController);

router.get("/me", auth("admin", "manager"), AuthControllers.getMeController);

router.post("/logout", AuthControllers.logoutController);

export const authRoutes = router;
