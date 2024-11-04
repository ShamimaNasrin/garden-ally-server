import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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

// get all payments
const getPaymentHistory = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentHistory();

  if (!result?.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No Data Found",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payments retrieved successfully",
      data: result,
    });
  }
});

export const PaymentControllers = { confirmationController, getPaymentHistory };
