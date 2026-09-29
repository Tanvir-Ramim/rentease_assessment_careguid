import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { propertyRoutes } from "../modules/property/property.route";
import { unitRoutes } from "../modules/unit/unit.route";
import { tenantRoutes } from "../modules/tenant/tenant.route";

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
  {
    path: "/unit",
    function: unitRoutes,
  },
  {
    path: "/tanant",
    function: tenantRoutes,
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
