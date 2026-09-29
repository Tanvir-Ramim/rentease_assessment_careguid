import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { propertyRoutes } from "../modules/property/property.route";

const router = Router();

const modulesRoutes = [
  {
    path: "/auth",
    function: authRoutes,
  },
  {
    path: "/property",
    function: propertyRoutes,
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
