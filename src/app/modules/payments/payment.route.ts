import express from "express";
import { authUser } from "../../middlewares/authUser";
import { PaymentControllers } from "./payment.controller";

const router = express.Router();

router.post("/confirmation", PaymentControllers.confirmationController);

export const PaymentRoutes = router;
