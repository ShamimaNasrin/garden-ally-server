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

export const PaymentRoutes = router;
