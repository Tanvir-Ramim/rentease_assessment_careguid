import { Router } from "express";

const router = Router();

const modulesRoutes = [
  {
    path: "/auth",
    function: () => {},
  },
];
modulesRoutes.forEach((route) => {
  router.use(route.path, route.function);
});

export default router;
