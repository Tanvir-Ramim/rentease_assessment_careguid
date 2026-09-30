
import { Router } from "express";

import { DashboardControllers } from "./dashboard.controller";
import { auth } from "../../middlewares/authRoleChecker";

const router = Router();

router.get(
  "/summary",
  auth("admin", "manager"),
  DashboardControllers.getSummary,
);
router.get(
  "/monthly-rent",
  auth("admin", "manager"),
  DashboardControllers.getMonthlyRent,
);
router.get(
  "/occupancy",
  auth("admin", "manager"),
  DashboardControllers.getOccupancy,
);
router.get(
  "/top-unpaid",
  auth("admin", "manager"),
  DashboardControllers.getTopUnpaid,
);

export const dashboardRoutes = router;
