/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { join } from "path";
import { readFileSync } from "fs";
import { PaymentModel } from "./payment.model";
import { User } from "../user/user.model";
import { verifyPayment } from "./payment.utils";
import { TPaymentWithDates } from "./payment.interface";

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

// Payment History
const getPaymentHistory = async () => {
  const result = await PaymentModel.find().populate({
    path: "customerId",
    select: "_id name email role profilePhoto isVerified",
  });
  return result;
};

// Payment Activity Chart
const monthlyPaymentChart = async () => {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Fetch all payments created in the current month
  const payments = (await PaymentModel.find({
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  }).lean()) as unknown as TPaymentWithDates[];

  // Initialize an array to store payment counts for each day of the current month
  const daysInMonth = endOfMonth.getDate();
  const paymentChartData = Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    const month = currentDate.toLocaleString("default", { month: "short" });
    return {
      day: `${day} ${month}`, // Format as "DD Mon"
      paymentCount: 0,
    };
  });

  // Calculate the payment count for each day of the current month
  payments.forEach((payment) => {
    const paymentDay = new Date(payment.createdAt).getDate();
    paymentChartData[paymentDay - 1].paymentCount += 1;
  });

  return paymentChartData;
};

export const PaymentServices = {
  confirmationService,
  getPaymentHistory,
  monthlyPaymentChart,
};
