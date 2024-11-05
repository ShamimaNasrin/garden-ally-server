import express from "express";
import { PaymentControllers } from "./payment.controller";
import { authAdmin, authUser } from "../../middlewares/authUser";

const router = express.Router();

router.post("/confirmation", PaymentControllers.confirmationController);

// get payment history (admin)
router.get(
  "/pay-history",
  authUser,
  authAdmin,
  PaymentControllers.getPaymentHistory
);

// Payment activity chart data (admin)
router.get(
  "/payment-activity",
  authUser,
  authAdmin,
  PaymentControllers.monthlyPaymentChart
);

export const PaymentRoutes = router;
