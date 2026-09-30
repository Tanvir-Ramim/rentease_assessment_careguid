
import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { TenantControllers } from "./tenant.controller";
import {
  createTenantSchema,
  moveOutSchema,
  updateTenantSchema,
} from "./tenant.validation";
import { auth } from "../../middlewares/authRoleChecker";

const router = Router();

router.post(
  "/",
  auth("admin", "manager"),
  validateRequest(createTenantSchema),
  TenantControllers.createTenant,
);

router.get("/", auth("admin", "manager"), TenantControllers.getAllTenants);

router.patch(
  "/:id",
  auth("admin", "manager"),
  validateRequest(updateTenantSchema),
  TenantControllers.updateTenant,
);

router.patch(
  "/:id/move-out",
  auth("admin", "manager"),
  validateRequest(moveOutSchema),
  TenantControllers.moveOutTenant,
);

router.delete("/:id", auth("admin", "manager"), TenantControllers.deleteTenant);

export const tenantRoutes = router;
