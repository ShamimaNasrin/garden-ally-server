import catchAsync from "../../utils/catchAsync";
// import httpStatus from "http-status";
// import sendResponse from "../../utils/sendResponse";
// import AppError from "../../errors/AppError";
import { PaymentServices } from "./payment.service";

const confirmationController = catchAsync(async (req, res) => {
  const { transactionId } = req.query;

  const result = await PaymentServices.confirmationService(
    transactionId as string
  );
  res.status(200).send(result);
});

export const PaymentControllers = { confirmationController };
