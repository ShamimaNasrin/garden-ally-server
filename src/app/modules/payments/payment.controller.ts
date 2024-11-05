import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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

// payment Activity Chart
const monthlyPaymentChart = catchAsync(async (req, res) => {
  // console.log("monthlyPaymentChart called");
  const result = await PaymentServices.monthlyPaymentChart();

  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Failed to get payment activity",
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment activity retrieved successfully",
      data: result,
    });
  }
});

export const PaymentControllers = {
  confirmationController,
  getPaymentHistory,
  monthlyPaymentChart,
};
