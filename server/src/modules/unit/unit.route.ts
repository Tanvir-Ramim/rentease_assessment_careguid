import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { UnitControllers } from "./unit.controller";
import { createUnitSchema, updateUnitSchema } from "./unit.validation";
import { auth } from "../../middlewares/authRoleChecker";

const router = Router();

router.post(
  "/",
  auth("admin", "manager"),
  validateRequest(createUnitSchema),
  UnitControllers.createUnit,
);

router.get("/", auth("admin", "manager"), UnitControllers.getAllUnits);

router.patch(
  "/:id",
  auth("admin", "manager"),
  validateRequest(updateUnitSchema),
  UnitControllers.updateUnit,
);

router.delete("/:id", auth("admin", "manager"), UnitControllers.deleteUnit);

export const unitRoutes = router;
