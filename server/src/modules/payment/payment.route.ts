import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { PaymentControllers } from "./payment.controller";
import { createPaymentSchema } from "./payment.validation";
import { auth } from "../../middlewares/authRoleChecker";

const router = Router();

router.post(
  "/",
  auth("admin", "manager"),
  validateRequest(createPaymentSchema),
  PaymentControllers.createPayment,
);

router.get("/", auth("admin", "manager"), PaymentControllers.getAllPayments);

router.get(
  "/unpaid",
  auth("admin", "manager"),
  PaymentControllers.getUnpaidTenants,
);

export const paymentRoutes = router;