
import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { PropertyControllers } from "./property.controller";
import {
  assignManagersSchema,
  createPropertySchema,
  updatePropertySchema,
} from "./property.validation";
import { auth } from "../../middlewares/authRoleChecker";

const router = Router();

router.post(
  "/",
  auth("admin"),
  validateRequest(createPropertySchema),
  PropertyControllers.createProperty,
);

router.get(
  "/",
  auth("admin", "manager"),
  PropertyControllers.getAllProperties,
);

router.get(
  "/:id",
  auth("admin", "manager"),
  PropertyControllers.getSingleProperty,
);

router.patch(
  "/:id",
  auth("admin"),
  validateRequest(updatePropertySchema),
  PropertyControllers.updateProperty,
);

router.patch(
  "/:id/managers",
  auth("admin"),
  validateRequest(assignManagersSchema),
  PropertyControllers.assignManagers,
);

router.delete("/:id", auth("admin"), PropertyControllers.deleteProperty);

export const propertyRoutes = router;