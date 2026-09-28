import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/auth",
    function: authRoutes,
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
