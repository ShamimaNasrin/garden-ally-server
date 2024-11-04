/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { join } from "path";
import { readFileSync } from "fs";
import { PaymentModel } from "./payment.model";
import { User } from "../user/user.model";
import { verifyPayment } from "./payment.utils";

const confirmationService = async (transactionId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  // console.log("Verification status:", verifyResponse);

  if (!verifyResponse || verifyResponse.pay_status !== "Successful") {
    return getConfirmationTemplate("Payment Failed!", false);
  }

  const customerId = transactionId.split("-")[2];
  const userUpdateResult = await User.findByIdAndUpdate(
    customerId,
    { isVerified: true },
    { new: true }
  );

  if (!userUpdateResult)
    throw new AppError(httpStatus.NOT_FOUND, "User not found");

  await PaymentModel.create({ customerId, transactionId });
  return getConfirmationTemplate("Payment successful!", true);
};

// Inline function to handle template rendering
const getConfirmationTemplate = (message: string, isSuccess: boolean) => {
  const filePath = isSuccess
    ? join(__dirname, "../../../../public/confirmationSuccess.html")
    : join(__dirname, "../../../../public/confirmationFailed.html");

  const templateContent = readFileSync(filePath, "utf-8");
  return templateContent.replace("{{message}}", message);
};

const getPaymentHistory = async () => {
  const result = await PaymentModel.find().populate({
    path: "customerId",
    select: "_id name email role profilePhoto isVerified",
  });
  return result;
};

export const PaymentServices = {
  confirmationService,
  getPaymentHistory,
};
